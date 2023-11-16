const express = require("express");
const connectDatabase = require("../config/connectDatabase");
const { ObjectId } = require("mongodb");
const router = express.Router();

const run = async () => {
  const db = await connectDatabase();
  const all_users_collection = db.collection("all_users");
  const store_manager_admin_users_collection = db.collection(
    "store_manager_admin_users"
  );
  const store_manager_va_users_collection = db.collection(
    "store_manager_va_users"
  );
  const warehouse_admin_users_collection = db.collection(
    "warehouse_admin_users"
  );
  const warehouse_manager_va_users_collection = db.collection(
    "warehouse_manager_va_users"
  );
  const admin_va_users_collection = db.collection("admin_va_users");
  const notification_collection = db.collection("notifications");

  // get current user 
  router.get("/current_user", async (req, res) => {
    try {
      const currentUserEmail = req.query.email;
      const userRole = req.query.user_role;

      let query;
      let result;

      if (userRole == "Admin") {
        query = { email: currentUserEmail, role: userRole };
        result = await all_users_collection.findOne(query);
      }
      if (userRole == "Admin VA") {
        query = { email: currentUserEmail, role: userRole };
        result = await admin_va_users_collection.findOne(query);
      }
      if (userRole == "Store Manager Admin") {
        result = await store_manager_admin_users_collection.findOne(query);
      }
      if (userRole == "Store Manager VA") {
        result = await store_manager_va_users_collection.findOne(query);
      }
      if (userRole == "Warehouse Admin") {
        result = await warehouse_admin_users_collection.findOne(query);
      }
      if (userRole == "Warehouse Manager VA") {
        result = await warehouse_manager_va_users_collection.findOne(query);
      }
      console.log(result);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: "server error" });
    }
  });

  // notification 
  router.post("/send_notification", async (req, res) => {
    const { currentUser, status } = req.body;

    // send notification by admin  || admin va
    if (currentUser?.role == "Admin" || currentUser?.role == "Admin VA") {
      let query;
      if (currentUser?.role == "Admin") {
        const condition1 = { admin_id: currentUser?._id };
        const condition2 = { _id: new ObjectId(currentUser?._id) };
        query = {
          $or: [condition1, condition2],
        };
      }
      if (currentUser?.role == "Admin VA") {
        const condition1 = { admin_id: currentUser?.admin_id };
        const condition2 = { _id: new ObjectId(currentUser?.admin_id) };
        query = {
          $or: [condition1, condition2],
        };
      }

      const adminNotificationAccessUsers = await all_users_collection
        .find(query)
        .toArray();
      adminNotificationAccessUsers.forEach(
        async (adminNotificationAccessUser) => {
          if (adminNotificationAccessUser?.role != currentUser?.role) {
            console.log(adminNotificationAccessUser.role);
            const notificationReceiverEmail =
              adminNotificationAccessUser?.email;
            const timestamp = new Date().toISOString();
            const notificationData = {
              email: notificationReceiverEmail,
              notification_sender: adminNotificationAccessUser?.full_name,
              role: adminNotificationAccessUser?.role,
              timestamp,
              status,
            };
            await notification_collection.insertOne(notificationData);
          }
        }
      );
    }

    // send notification by store manager admin
    if (currentUser?.role == "Store Manager Admin") {
      const adminQuery = { _id: new ObjectId(currentUser?.admin_id) };
      const result = await all_users_collection.find(adminQuery).toArray();
      const query = {
        role: {
          $nin: ["Store Manager Admin", "Store Manager VA"],
        },
        admin_id: currentUser?.admin_id,
      };
      const result2 = await all_users_collection.find(query).toArray();
      const storeVAQuery = {
        store_manager_admin_id: currentUser?.store_manager_admin_id,
      };
      const result3 = await store_manager_va_users_collection
        .find(storeVAQuery)
        .toArray();
      const storeManagerNotificationAccessArr = [
        ...result,
        ...result2,
        ...result3,
      ];

      // send notification
      storeManagerNotificationAccessArr.forEach(
        async (storeManagerAccessUser) => {
          const notificationReceiverEmail = storeManagerAccessUser?.email;
          const timestamp = new Date().toISOString();
          const notificationData = {
            email: notificationReceiverEmail,
            notification_sender: storeManagerAccessUser?.full_name,
            role: storeManagerAccessUser?.role,
            timestamp,
            status,
          };
          await notification_collection.insertOne(notificationData);
        }
      );
    }

    // send notification by store manager va
    if (currentUser?.role == "Store Manager VA") {
      console.log(currentUser);

      const findAdminQuery = { _id: new ObjectId(currentUser?.admin_id) };
      const result = await all_users_collection.find(findAdminQuery).toArray();

      const query = {
        role: {
          $nin: ["Store Manager Admin", "Store Manager VA"],
        },
        admin_id: currentUser?.admin_id,
      };
      const result2 = await all_users_collection.find(query).toArray();

      const findStoreManagerAdminQuery = {
        store_manager_admin_id: currentUser?.store_manager_admin_id,
      };
      const result3 = await store_manager_admin_users_collection
        .find(findStoreManagerAdminQuery)
        .toArray();

      const storeManagerVANotificationUsersAccessArr = [
        ...result,
        ...result2,
        ...result3,
      ];

      // send notification
      storeManagerVANotificationUsersAccessArr.forEach(
        async (storeManagerVANotificationUser) => {
          const notificationReceiverEmail =
            storeManagerVANotificationUser?.email;
          const timestamp = new Date().toISOString();
          const notificationData = {
            email: notificationReceiverEmail,
            notification_sender: storeManagerVANotificationUser?.full_name,
            role: storeManagerVANotificationUser?.role,
            timestamp,
            status,
          };
          await notification_collection.insertOne(notificationData);
        }
      );
    }

    // send notification by warehouse admin
    if (currentUser?.role == "Warehouse Admin") {
      const adminQuery = { _id: new ObjectId(currentUser?.admin_id) };
      const result = await all_users_collection.find(adminQuery).toArray();
      const query = {
        role: {
          $nin: ["Warehouse Admin", "Warehouse Manager VA"],
        },
        admin_id: currentUser?.admin_id,
      };
      const result2 = await all_users_collection.find(query).toArray();
      const warehouseVAQuery = {
        warehouse_admin_id: currentUser?.warehouse_admin_id,
      };
      const result3 = await warehouse_manager_va_users_collection
        .find(warehouseVAQuery)
        .toArray();
      const warehouseNotificationUsersAccessArr = [
        ...result,
        ...result2,
        ...result3,
      ];

      // send notification
      warehouseNotificationUsersAccessArr.forEach(
        async (warehouseNotificationUser) => {
          const notificationReceiverEmail = warehouseNotificationUser?.email;
          const timestamp = new Date().toISOString();
          const notificationData = {
            email: notificationReceiverEmail,
            notification_sender: warehouseNotificationUser?.full_name,
            role: warehouseNotificationUser?.role,
            timestamp,
            status,
          };
          await notification_collection.insertOne(notificationData);
        }
      );
    }

    // send notification by warehouse admin
    if (currentUser?.role == "Warehouse Manager VA") {
      console.log(currentUser);

      const findAdminQuery = { _id: new ObjectId(currentUser?.admin_id) };
      const result = await all_users_collection.find(findAdminQuery).toArray();

      const query = {
        role: {
          $nin: ["Warehouse Admin", "Warehouse Manager VA"],
        },
        admin_id: currentUser?.admin_id,
      };
      const result2 = await all_users_collection.find(query).toArray();
      const findWarehouseManagerAdminQuery = {
        warehouse_admin_id: currentUser?.warehouse_admin_id,
      };
      const result3 = await warehouse_admin_users_collection
        .find(findWarehouseManagerAdminQuery)
        .toArray();
      const warehouseVANotificationUsersAccessArr = [
        ...result,
        ...result2,
        ...result3,
      ];

      // send notification
      warehouseVANotificationUsersAccessArr.forEach(
        async (warehouseVANotificationUser) => {
          const notificationReceiverEmail = warehouseVANotificationUser?.email;
          const timestamp = new Date().toISOString();
          const notificationData = {
            email: notificationReceiverEmail,
            notification_sender: warehouseVANotificationUser?.full_name,
            role: warehouseVANotificationUser?.role,
            timestamp,
            status,
          };
          await notification_collection.insertOne(notificationData);
        }
      );
    }
  });
};

run();
module.exports = router;
