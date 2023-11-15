import { Server } from 'socket.io';

const io = new Server(9000, {
    cors: {
        origin: 'http://localhost:5173',
    }, 
})

let users = [];
const addUser = (userData, socketId) => {
    !users.some(user => user?.email == userData?.email ) && users?.push({...userData, socketId})
}   

// add current user with creator email 
let currentUsers = [];
const addCurrentUser = (currentUserData, socketId) => {  
    !currentUsers.some(currentUser => currentUser?.email == currentUserData?.email) && currentUsers?.push({...currentUserData, socketId})
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (receiver) => {
    return users?.find(user => user?.email == receiver)
}

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
       {user && io.to(user?.socketId).emit('getMessage', data)}
    })

    // send message fast time
    socket.on('sendMessageFastTime',  (data) => {
        const user =  getUser(data?.lastMassages?.receiver)
       {user && io.to(user?.socketId).emit('getMessageFastTime', data)}
    })

    // lest message update conversation user list
    socket.on('sentLestMessageUpdateConversationUserList',  (data) => {
        const user =  getUser(data?.receiver)
       {user && io.to(user?.socketId).emit('getLestMessageUpdateConversationUserList', data)}
    })

    // typing status
    socket.on('typing',  ({isTyping: status, receiver}) => {
       const user =  getUser(receiver)
      {user && io.to(user?.socketId).emit('getTyping', status)}
    })

    // seen unseen status 
    socket.on("seenUnseenStatus", ({status, receiver}) => {
        const user =  getUser(receiver)
      {user && io.to(user?.socketId).emit('getSeenUnseenStatus', status)}

    } )

    // add current user 
    socket.on("addCurrentUser", ({currentUser}) => {
        addCurrentUser(currentUser, socket.id)
        console.log("🚀 ~ file: index.js:74 ~ socket.on ~ currentUsers:", currentUsers)
    }) 

    // pending arrival notification data 
    socket.on("arrivalFormSubmit", ({user, status}) => {
        const currentUsersData = currentUsers.filter(currentUser => (currentUser?.admin_id || (user?.email != currentUser?.email) && currentUser._id) == user?.admin_id)
     
        if(user?.role == "Admin" || user?.role == "Admin VA"){
          const adminAdminVAUnderUsers = currentUsersData?.filter(currentUser => currentUser?.admin_id == user?.admin_id)
          adminAdminVAUnderUsers?.forEach(adminAdminVAUnderUser => {
                {adminAdminVAUnderUser && io?.to(adminAdminVAUnderUser?.socketId)?.emit("getArrivalFormSubmit", ({status, data: adminAdminVAUnderUser}))}
            })
        }
        if(user?.role == "Store Manager Admin"){
            const storeManagerAdminNotificationAccessUsers = currentUsersData?.filter(
                currentUser =>
                  (currentUser?.store_manager_admin_id === user?.store_manager_admin_id &&
                    currentUser?.role === "Store Manager VA") ||
                  (currentUser?.admin_id === user?.admin_id &&
                    currentUser.role !== "Store Manager Admin" &&
                    currentUser.role !== "Store Manager VA")
              );
            console.log("🚀 ~ file: index.js:93 ~ socket.on ~ storeManagerAdminAccessUsers:", storeManagerAdminNotificationAccessUsers)

            // send notification 
            storeManagerAdminNotificationAccessUsers?.forEach(storeManagerAdminAccessUser => {
                {storeManagerAdminAccessUser && io?.to(storeManagerAdminAccessUser?.socketId)?.emit("getArrivalFormSubmit", ({status, data: storeManagerAdminAccessUser}))}
            })            
        }
        if(user?.role == "Store Manager VA"){
            const storeManagerVANotificationAccessUsers = currentUsersData?.filter(
                currentUser =>
                    (d)
                )
        }

        // if(user?.role == "Warehouse Admin" || user?.role == "Warehouse Manager VA"){
        //     console.log("Warehouse Admin || Warehouse Manager VA");
        //     // send notifications to the client 
        //     if(data?.role != "Warehouse Admin" && data?.role != "Warehouse Manager VA"){
        //         {data && io?.to(data?.socketId).emit("getArrivalFormSubmit", ({status, data}))}
        //     }
        // }
    })

    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})