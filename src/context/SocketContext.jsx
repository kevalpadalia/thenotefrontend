// import { Fragment, createContext, useState, useEffect, useContext } from "react";
// import { useSelector } from "react-redux";
// import Loader from "../components/helpers/loader/Loader";
// import InfoAlert from "../components/helpers/alerts/InfoAlert";
// import io from "socket.io-client";

// // Create a context for the socket
// export const SocketContext = createContext();
// export const useSocketContext = () => {
//     return useContext(SocketContext)
// }
// export const SocketProvider = ({ children }) => {
//     // Retrieve user and utility from Redux state
//     const utility = useSelector((state) => (state && state.utility) ? state.utility : {});
//     const user = useSelector((state) => (state && state.user && state.user.user) ? state.user.user : {});
//     const currentProject = useSelector((state) => (state && state.utility && state.utility.currentProject && state.utility.currentProject._id) ? state.utility.currentProject : {});
    
//     const [socket, setSocket] = useState(null);
//     const [onlineUsers,setOnlineUsers]=useState([])
//     const [isLoading, setIsLoading] = useState(false);
//     const [infoDetails, setInfoDetails] = useState({});
//     const [showInfoAlert, setShowInfoAlert] = useState(false);

//     const handleSocket = (members) => {
//         // Establish a socket connection only if the user is authenticated and is a member of the project
//         if (user && user.authenticated && user._id && user.loggedIn) {
//             // Use 'includes' instead of 'include'
//             if (members.includes(user._id)) {
//                 const newSocket = io("http://localhost:4000", {
//                     query: { userId: user._id }
//                 });
//                 setSocket(newSocket);
//                 socket.on("activeUsers", (users) => {
//                     setOnlineUsers(users)
//                     console.log("")
//                 })
//                 return()=>socket.close()
//                 // // Clean up the socket connection on unmount
//                 // return () => {
//                 //     if (newSocket) newSocket.disconnect();
//                 // };
//             }
//         } else {
//             if (socket) {
//                 socket.close()
//                 setSocket(null)
//             }
//         }
//     }

//     useEffect(() => {
//         if (currentProject && currentProject._id) {
//             const membersList = currentProject.members; // Corrected typo: 'memebersList' to 'membersList'
//             const userIds = membersList.map(member => member.userId);
//             handleSocket(userIds);
//         }
//     }, [user._id, currentProject._id, utility.api]); // Ensure dependencies are correct

//     return (
//         <SocketContext.Provider value={{ socket,onlineUsers }}>
//             {children}
//         </SocketContext.Provider>
//     );
// };



// SocketContext.js
// SocketContext.js
import React, { createContext, useContext, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
const SocketContext = createContext();
export const SocketProvider = ({ children }) => {
    const utility = useSelector((state) => {
        return state && state.utility ? state.utility : {}
    })
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io(utility && utility.socketApi?utility.socketApi:"http://localhost:4000", {
        // socketRef.current = io('http://localhost:4000', {
            reconnectionAttempts: Infinity,
            transports: ['websocket'],
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);

