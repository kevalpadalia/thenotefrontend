import { io } from "socket.io-client"


export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttemo: 'Infinity',
        timeout: 10000,
        transport:['websocket']
    }
    return io('http://localhost:4000',options)
}