// ActiveUserList.js
import React, { useEffect, useState, Fragment } from "react";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import axios from "axios";
import { CheckCircle, XCircle, NetworkSlash  } from "@phosphor-icons/react";
import { Typography, Box,useTheme,Avatar, Divider } from "@mui/material";
import { tokens } from "../../theme";

const ActiveUserList = () => {
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socketRef = useSocket();
    const currentProject = useSelector(state => state.utility?.currentProject || {});
    const user = useSelector(state => state.user?.user || {});
    const utility = useSelector(state => state.utility || {});
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const getAllUsers = async () => {
        if (currentProject && currentProject._id) { 
            try {
                const response = await axios.post(utility.api + "accounts/get/loggedIn/users", { project_id: currentProject._id }, utility.config);
                if (response.data.status === 'success') {
                    setUsers(response.data.users);
                } else {
                    setUsers([])
                    console.error(response.data.message);
                }
            } catch (error) {
                setUsers([])
                setOnlineUsers([])
                console.error(error.message);
            }
        } else {
            setUsers([])
            setOnlineUsers([])
        }
    };

    useEffect(() => {
    if (socketRef && socketRef.current) {
        
        const handleConnect = () => {
            socketRef.current.emit('join', { projectId: currentProject._id, userName: user.name });
        };

        const handleJoin = ({ users }) => {
            setOnlineUsers(users);
        };

        const handleDisconnect = ({ socketId }) => {
            setUsers([])
            getAllUsers()
            setOnlineUsers((prev) => prev.filter((user) => user.socketId !== socketId));
        };

        socketRef.current.on('connect', handleConnect);
        socketRef.current.on('joined', handleJoin);
        socketRef.current.on('disconnected', handleDisconnect);
        socketRef.current.on('leave-project', handleDisconnect);
        socketRef.current.on('delete-project', handleDisconnect);

        return () => {
            socketRef.current.off('connect', handleConnect);
            socketRef.current.off('joined', handleJoin);
            socketRef.current.off('disconnected', handleDisconnect);
            socketRef.current.off('leave-project',handleDisconnect);
            socketRef.current.off('delete-project');
        };
    }
}, [socketRef, currentProject, user]);


    useEffect(() => {
        if (socketRef && socketRef.current) { 
            socketRef.current.emit('join', { projectId: currentProject._id, userName: user.name });
        }
        if (currentProject && currentProject._id) {
            getAllUsers();
        } else {
            setOnlineUsers([])
            setUsers([]);
        }
    }, [currentProject, user]);

    return (
        <Fragment>
            <Box pt={2}>
    <Typography
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={2}
        variant="h5"
        color={colors.grey[100]}
        fontWeight="bold"
    >
        Members
    </Typography>
    <Divider/>
    {users.length > 0 ? (
        <Box display="flex" flexDirection="column" alignItems="flex-start">
            {users.map((user) => (
                <Box
                    key={user._id}
                    py={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        width: '100%',
                        // borderBottom: `1px solid ${colors.grey[theme.palette.mode==='dark' ? 700:900]}`,
                        // borderTop: `1px solid ${colors.grey[700]}`,
                        padding: '5px 0'
                    }}
                >
                    {/* Avatar */}
                    <Box display="flex" alignItems="center" minWidth="50px" ml={2}>
                        <Avatar
                            sx={{
                                cursor: "pointer",
                                width: 25,
                                height: 25,
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: colors.grey[theme.palette.mode === 'dark' ? 100 : 1000],
                                bgcolor: theme.palette.mode === "dark" ? colors.blueAccent[700] : colors.blueAccent[300]
                            }}
                        >
                            {user.name ? user.name.charAt(0) : ""}
                        </Avatar>
                        <Typography
                            ml={1}
                            variant="body2"
                            color={colors.grey[100]}
                            sx={{ textAlign: 'center' }}
                        >
                            {user.name}
                        </Typography>
                    </Box>

                    {/* User Name */}

                    {/* Online Status Icon */}
                    <Box mx={2}>
                        {onlineUsers.some((onlineUser) => onlineUser.userName === user.name) ? (
                            <CheckCircle size={20} weight="duotone" color={colors.greenAccent[500]} />
                        ) : (
                            <XCircle size={20} weight="duotone" color={colors.redAccent[500]} />
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    ) : (
        <Typography pb={2} display="flex" alignItems="center" justifyContent="center" ml={1} pt={2} variant="body1" color={colors.grey[300]}>
            <NetworkSlash style={{ marginRight: "10px" }} size={25} weight="duotone" color={colors.redAccent[500]} />
            No one is active
        </Typography>
                )}
                <Divider/>
    </Box>
        </Fragment>
    );
};

export default ActiveUserList;
