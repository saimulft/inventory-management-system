import { Server } from 'socket.io';

const io = new Server(9000, {
    cors: {
        origin: 'http://localhost:5173',
    }, 
})


let users = [];
const addUser = (userData, socketId) => {
    console.log({...userData, socketId});
    !users.some(user => user.email == userData.email ) && users.push({...userData, socketId})
}

const getUser = (receiver) => {
    return users?.find(user => user?.email == receiver)
}


// const removeUser = (socketId) => {
//     users = users.filter(user => user.socketId !== socketId);
// }

// const getUser = (userId) => {
//     return users.find(user => user.sub === userId);
// }

io.on('connection',  (socket) => {
    console.log('user connected')

    // connect 
    socket.on('addUsers', userData => {
        addUser(userData, socket.id)
        io.emit("getUsers", users);
    })

    // send message 
    socket.on('sendMessage',  (data) => {
        const user =  getUser(data.receiver)
        console.log(user);
        io.to(user?.socketId).emit('getMessage', data)
    })

//     //send message
//     socket.on('sendMessage', (data) => {
//         const user = getUser(data.receiverId);
//         io.to(user.socketId).emit('getMessage', data)
//     })

//     //disconnect
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//         removeUser(socket.id);
//         io.emit('getUsers', users);
//     })
})