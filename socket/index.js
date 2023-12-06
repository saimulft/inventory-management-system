import { Server } from "socket.io";

const io = new Server(9000, {
  cors: {
    origin: ['https://ims.nabilnewaz.com'],
  },
})

let users = [];
const addUser = (userData, socketId) => {
  !users.some((user) => user?.email == userData?.email) &&
    users?.push({ ...userData, socketId });
};

// add current user with creator email
let currentUsers = [];
const addCurrentUser = (currentUserData, socketId) => {
  !currentUsers.some(
    (currentUser) => currentUser?.email == currentUserData?.email
  ) && currentUsers?.push({ ...currentUserData, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiver) => {
  return users?.find((user) => user?.email == receiver);
};

io.on('connection', (socket) => {


  // connect
  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  });

  // send message
  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiver);
    {
      user && io.to(user?.socketId).emit("getMessage", data);
    }
  });

  // send message fast time
  socket.on("sendMessageFastTime", (data) => {
    const user = getUser(data?.lastMassages?.receiver);
    {
      user && io.to(user?.socketId).emit("getMessageFastTime", data);
    }
  });

  // lest message update conversation user list
  socket.on("sentLestMessageUpdateConversationUserList", (data) => {
    const user = getUser(data?.receiver);
    {
      user &&
        io
          .to(user?.socketId)
          .emit("getLestMessageUpdateConversationUserList", data);
    }
  });

  // typing status
  socket.on("typing", ({ isTyping: status, receiver }) => {
    const user = getUser(receiver);
    {
      user && io.to(user?.socketId).emit("getTyping", status);
    }
  });

  // seen unseen status
  socket.on("sentSeenUnseenStatus", ({ status, receiver }) => {

    const user = getUser(receiver);

    {
      user && io.to(user?.socketId)?.emit("getSeenUnseenStatus", status);
    }
  });

  // add current user
  socket.on("addCurrentUser", ({ currentUser }) => {

    addCurrentUser(currentUser, socket.id);
  });

  // notification
  socket.on("sendNotification", ({ user, notificationData }) => {
    const currentUsersData = currentUsers.filter(
      (currentUser) =>
        currentUser?.admin_id == user?.admin_id ||
        currentUser?._id == user?.admin_id
    );

    let adminAdminVANotificationAccessUsers;
    if (user?.role == "Admin") {
      adminAdminVANotificationAccessUsers = currentUsersData?.filter(
        (currentUser) => currentUser?.admin_id == user?.admin_id
      );
    }
    if (user?.role == "Admin VA") {
      adminAdminVANotificationAccessUsers = currentUsersData?.filter(
        (currentUser) => currentUser?._id == user?.admin_id
      );
    }
    // send notification
    adminAdminVANotificationAccessUsers?.forEach(
      (adminAdminVANotificationAccessUser) => {
        if (notificationData) {
          io?.to(adminAdminVANotificationAccessUser?.socketId)?.emit(
            "getNotification",
            { notificationData }
          );
        }
      }
    );

    const checkAdminId = (currentUser, user) => {
      if (currentUser.role == "Admin") {
        const data = currentUser._id == user?.admin_id;
        return data;
      }
    };
    const checkAdminVAId = (currentUser, user) => {
      if (currentUser.role == "Admin VA") {
        const data = currentUser.admin_id == user?.admin_id;
        return data;
      }
    };
    const checkUsersStoreManagerAdminByStoreAccessId = (
      currentUser,
      user,
      notificationData
    ) => {
      if (currentUser.role == "Store Manager Admin") {
        const data =
          currentUser.store_access_ids?.find(
            (storeAccessId) => storeAccessId == notificationData.storeId
          ) == notificationData.storeId && currentUser.email != user?.email;
        return data;
      }
    };
    const checkUsersStoreManagerVAByStoreAccessId = (
      currentUser,
      user,
      notificationData
    ) => {
      if (currentUser.role == "Store Manager VA") {
        const data =
          currentUser.store_access_ids?.find(
            (storeAccessId) => storeAccessId == notificationData.storeId
          ) == notificationData.storeId && currentUser.email != user?.email;
        return data;
      }
    };
    const checkUsersWarehouseAdminByWarehouseId = (
      currentUser,
      notificationData
    ) => {
      if (currentUser.role == "Warehouse Admin") {
        const data =
          currentUser?.warehouse_id == notificationData?.warehouseId &&
          currentUser.email != user?.email;
        return data;
      }
    };
    const checkUsersWarehouseManagerVAByWarehouseId = (
      currentUser,
      notificationData
    ) => {
      if (currentUser.role == "Warehouse Manager VA") {
        const data =
          currentUser?.warehouse_id == notificationData?.warehouseId &&
          currentUser.email != user?.email;
        return data;
      }
    };

    if (user?.role == "Store Manager Admin") {
      const adminUsers = currentUsersData.filter((currentUser) =>
        checkAdminId(currentUser, user)
      );
      const adminVAUsers = currentUsersData.filter((currentUser) =>
        checkAdminVAId(currentUser, user)
      );
      const storeManagerAdminUsers = currentUsersData.filter((currentUser) =>
        checkUsersStoreManagerAdminByStoreAccessId(
          currentUser,
          user,
          notificationData
        )
      );

      const storeManagerVAUsers = currentUsersData.filter((currentUser) =>
        checkUsersStoreManagerVAByStoreAccessId(
          currentUser,
          user,
          notificationData
        )
      );

      const warehouseAdminUsers = currentUsersData.filter((currentUser) =>
        checkUsersWarehouseAdminByWarehouseId(currentUser, notificationData)
      );
      const warehouseManagerVAUsers = currentUsersData.filter((currentUser) =>
        checkUsersWarehouseManagerVAByWarehouseId(currentUser, notificationData)
      );

      const storeManagerAdminNotificationAccessUsers = [
        ...adminUsers,
        ...adminVAUsers,
        ...storeManagerAdminUsers,
        ...storeManagerVAUsers,
        ...warehouseAdminUsers,
        ...warehouseManagerVAUsers,
      ];

      // send notification
      storeManagerAdminNotificationAccessUsers?.forEach(
        (storeManagerAdminNotificationAccessUser) => {
          if (notificationData) {
            io?.to(storeManagerAdminNotificationAccessUser?.socketId)?.emit(
              "getNotification",
              { notificationData }
            );
          }
        }
      );
    }

    if (user?.role == "Store Manager VA") {
      const adminUsers = currentUsersData.filter((currentUser) =>
        checkAdminId(currentUser, user)
      );
      const adminVAUsers = currentUsersData.filter((currentUser) =>
        checkAdminVAId(currentUser, user)
      );
      const storeManagerAdminUsers = currentUsersData.filter((currentUser) =>
        checkUsersStoreManagerAdminByStoreAccessId(currentUser, user, notificationData)
      );
      const storeManagerVAUsers = currentUsersData.filter((currentUser) =>
        checkUsersStoreManagerVAByStoreAccessId(currentUser, user, notificationData)
      );
      const warehouseAdminUsers = currentUsersData.filter((currentUser) =>
        checkUsersWarehouseAdminByWarehouseId(currentUser, notificationData)
      );
      const warehouseManagerVAUsers = currentUsersData.filter((currentUser) =>
        checkUsersWarehouseManagerVAByWarehouseId(currentUser, notificationData)
      );

      const storeManagerVANotificationAccessUsers = [
        ...adminUsers,
        ...adminVAUsers,
        ...storeManagerAdminUsers,
        ...storeManagerVAUsers,
        ...warehouseAdminUsers,
        ...warehouseManagerVAUsers,
      ];

      // send notification
      storeManagerVANotificationAccessUsers?.forEach(
        (storeManagerVANotificationAccessUser) => {
          if (notificationData) {
            io?.to(storeManagerVANotificationAccessUser?.socketId)?.emit(
              "getNotification",
              { notificationData }
            );
          }
        }
      );
    }

    if (user?.role == "Warehouse Admin") {
      const adminUsers = currentUsersData.filter((currentUser) =>
        checkAdminId(currentUser, user)
      );
      const adminVAUsers = currentUsersData.filter((currentUser) =>
        checkAdminVAId(currentUser, user)
      );
      const storeManagerAdminUsers = currentUsersData.filter((currentUser) =>
        checkUsersStoreManagerAdminByStoreAccessId(currentUser, user, notificationData)
      );
      const storeManagerVAUsers = currentUsersData.filter((currentUser) =>
        checkUsersStoreManagerVAByStoreAccessId(currentUser, user, notificationData)
      );
      const warehouseAdminUsers = currentUsersData.filter((currentUser) =>
        checkUsersWarehouseAdminByWarehouseId(currentUser, notificationData)
      );
      const warehouseManagerVAUsers = currentUsersData.filter((currentUser) =>
        checkUsersWarehouseManagerVAByWarehouseId(currentUser, notificationData)
      );

      const warehouseNotificationAccessUsers = [
        ...adminUsers,
        ...adminVAUsers,
        ...storeManagerAdminUsers,
        ...storeManagerVAUsers,
        ...warehouseAdminUsers,
        ...warehouseManagerVAUsers,
      ];

      // send notification
      warehouseNotificationAccessUsers?.forEach(
        (warehouseNotificationAccessUser) => {
          if (notificationData) {
            io?.to(warehouseNotificationAccessUser?.socketId)?.emit(
              "getNotification",
              { notificationData }
            );
          }
        }
      );
    }

    if (user?.role == "Warehouse Manager VA") {
      const adminUsers = currentUsersData.filter((currentUser) =>
        checkAdminId(currentUser, user)
      );
      const adminVAUsers = currentUsersData.filter((currentUser) =>
        checkAdminVAId(currentUser, user)
      );
      const storeManagerAdminUsers = currentUsersData.filter((currentUser) =>
        checkUsersStoreManagerAdminByStoreAccessId(currentUser, user, notificationData)
      );
      const storeManagerVAUsers = currentUsersData.filter((currentUser) =>
        checkUsersStoreManagerVAByStoreAccessId(currentUser, user, notificationData)
      );
      const warehouseAdminUsers = currentUsersData.filter((currentUser) =>
        checkUsersWarehouseAdminByWarehouseId(currentUser, notificationData)
      );
      const warehouseManagerVAUsers = currentUsersData.filter((currentUser) =>
        checkUsersWarehouseManagerVAByWarehouseId(currentUser, notificationData)
      );

      const warehouseManagerVANotificationAccessUsers = [
        ...adminUsers,
        ...adminVAUsers,
        ...storeManagerAdminUsers,
        ...storeManagerVAUsers,
        ...warehouseAdminUsers,
        ...warehouseManagerVAUsers,
      ];
      // send notification
      warehouseManagerVANotificationAccessUsers?.forEach(
        (storeManagerVANotificationAccessUser) => {
          if (notificationData) {
            io?.to(storeManagerVANotificationAccessUser?.socketId)?.emit(
              "getNotification",
              { data: storeManagerVANotificationAccessUser }
            );
          }
        }
      );
    }
  });

  //disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
