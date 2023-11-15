import { Server } from 'socket.io';

const io = new Server(9000, {
    cors: {
        origin: ['http://localhost:5174', 'http://localhost:5173'],
    },
})

let users = [];
const addUser = (userData, socketId) => {
    !users.some(user => user?.email == userData?.email) && users?.push({ ...userData, socketId })
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (receiver) => {
    return users?.find(user => user?.email == receiver)
}

io.on('connection', (socket) => {
    console.log('user connected')

    // connect 
    socket.on('addUsers', userData => {
        addUser(userData, socket.id)
        io.emit("getUsers", users);
    })

    // send message 
    socket.on('sendMessage', (data) => {
        const user = getUser(data.receiver)
        { user && io.to(user?.socketId).emit('getMessage', data) }
    })

    // send message fast time
    socket.on('sendMessageFastTime', (data) => {
        const user = getUser(data?.lastMassages?.receiver)
        { user && io.to(user?.socketId).emit('getMessageFastTime', data) }
    })

    // lest message update conversation user list
    socket.on('sentLestMessageUpdateConversationUserList', (data) => {
        const user = getUser(data?.receiver)
        { user && io.to(user?.socketId).emit('getLestMessageUpdateConversationUserList', data) }
    })

    // typing status
    socket.on('typing', ({ isTyping: status, receiver }) => {
        const user = getUser(receiver)
        { user && io.to(user?.socketId).emit('getTyping', status) }
    })

    // seen unseen status 
    socket.on("seenUnseenStatus", ({ status, receiver }) => {
        const user = getUser(receiver)
        console.log("🚀 ~ file: index.js:60 ~ socket.on ~ user:", user)
        { user && io.to(user?.socketId).emit('getSeenUnseenStatus', status) }

    })

    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})