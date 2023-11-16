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
        // console.log("🚀 ~ file: index.js:74 ~ socket.on ~ currentUsers:", currentUsers)
    }) 

    // pending arrival notification data 
    socket.on("sendNotification", ({user, status}) => {
        const currentUsersData = currentUsers.filter(currentUser => (currentUser?.admin_id || (user?.email != currentUser?.email) && currentUser._id) == user?.admin_id)
     
        console.log(user);
        if(user?.role == "Admin" || user?.role == "Admin VA"){
          const adminAdminVANotificationAccessUsers = currentUsersData?.filter(currentUser => currentUser?.admin_id == user?.admin_id)
          
        // send notification 
          adminAdminVANotificationAccessUsers?.forEach(adminAdminVANotificationAccessUser => {
                {adminAdminVANotificationAccessUser && io?.to(adminAdminVANotificationAccessUser?.socketId)?.emit("getNotification", ({status, data: user}))}
            })
        }

        if(user?.role == "Store Manager Admin"){
            const storeManagerAdminNotificationAccessUsers = currentUsersData?.filter(
                currentUser =>
                  (currentUser?.store_manager_admin_id == user?.store_manager_admin_id &&
                    currentUser?.role == "Store Manager VA") ||
                  (currentUser?.admin_id == user?.admin_id &&
                    currentUser.role !== "Store Manager Admin" &&
                    currentUser.role !== "Store Manager VA")
              );

            // send notification 
            storeManagerAdminNotificationAccessUsers?.forEach(storeManagerAdminNotificationAccessUser => {
                {storeManagerAdminNotificationAccessUser && io?.to(storeManagerAdminNotificationAccessUser?.socketId)?.emit("getNotification", ({status, data: storeManagerAdminNotificationAccessUser}))}
            })            
        }

        if(user?.role == "Store Manager VA"){
            const storeManagerVANotificationAccessUsers = currentUsersData?.filter(
                currentUser =>
                    (currentUser?.store_manager_admin_id == user?.store_manager_admin_id && currentUser?.role == "Store Manager Admin") || 
                    (currentUser?.admin_id == user?.admin_id &&
                        currentUser.role !== "Store Manager Admin" &&
                        currentUser.role !== "Store Manager VA")
                )
            // send notification 
            storeManagerVANotificationAccessUsers?.forEach(storeManagerVANotificationAccessUser => {
                {storeManagerVANotificationAccessUser && io?.to(storeManagerVANotificationAccessUser?.socketId)?.emit("getNotification", ({status, data: storeManagerVANotificationAccessUser}))}
            })               
        }

        if(user?.role == "Warehouse Admin"){
            const warehouseNotificationAccessUsers = currentUsersData?.filter(
                currentUser =>
                  (currentUser?.warehouse_admin_id == user?.warehouse_admin_id &&
                    currentUser?.role == "Warehouse Admin") ||
                  (currentUser?.admin_id == user?.admin_id &&
                    currentUser.role !== "Warehouse Admin" &&
                    currentUser.role !== "Warehouse Manager VA")
              );

            // send notification 
            warehouseNotificationAccessUsers?.forEach(warehouseNotificationAccessUser => {
                {warehouseNotificationAccessUser && io?.to(warehouseNotificationAccessUser?.socketId)?.emit("getNotification", ({status, data: warehouseNotificationAccessUser}))}
            })  
        }

        if(user?.role == "Warehouse Manager VA"){
            const warehouseManagerVANotificationAccessUsers = currentUsersData?.filter(
                currentUser =>
                    (currentUser?.warehouse_admin_id == user?.warehouse_admin_id &&
                         currentUser?.role == "Warehouse Admin") || 
                    (currentUser?.admin_id == user?.admin_id &&
                        currentUser?.role !== "Warehouse Admin" &&
                        currentUser?.role !== "Warehouse Manager VA")
                )
            // send notification 
            warehouseManagerVANotificationAccessUsers?.forEach(storeManagerVANotificationAccessUser => {
                {storeManagerVANotificationAccessUser && io?.to(storeManagerVANotificationAccessUser?.socketId)?.emit("getNotification", ({status, data: storeManagerVANotificationAccessUser}))}
            })
        }
    })

    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})