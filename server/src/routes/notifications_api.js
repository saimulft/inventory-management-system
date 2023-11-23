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
  const warehouse_admin_users_collection = db?.collection(
    "warehouse_admin_users"
  );
  const warehouse_manager_va_users_collection = db?.collection(
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
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: "server error" });
    }
  });

  // set notifications in db
  router.post("/send_notification", async (req, res) => {
    const { currentUser, status, notification_links } = req.body;
    const notificationSenderRole = currentUser?.role
    const notificationSenderName = currentUser?.full_name

// send notification by admin  || admin va
   try{
    if (currentUser?.role == "Admin" || currentUser?.role == "Admin VA") {
      console.log("admin");
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

      const adminNotificationAccessUsers = await all_users_collection.find(query).toArray();
          const notificationReceiversEmail =
          adminNotificationAccessUsers?.map(adminNotificationAccessUser => adminNotificationAccessUser?.email)?.filter(email => email != currentUser?.email)
        const timestamp = new Date().toISOString();
        const notificationData = {
          notification_receivers_email: notificationReceiversEmail,
          notification_sender_name: notificationSenderName,
          notification_sender_role: notificationSenderRole,
          notification_links,
          timestamp,
          status,
        };
       const finalResult =  await notification_collection.insertOne(notificationData, {upsert: true});
       res.send({finalResult, notificationData})
        }
   }
   catch(error){
    console.log(error);
   }

// send notification by store manager admin
   try{
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
      const storeManagerNotificationUsersAccessArr = [
        ...result,
        ...result2,
        ...result3,
      ];

      // send notification
      const notificationReceiversEmail = storeManagerNotificationUsersAccessArr.map(storeManagerNotificationUser => storeManagerNotificationUser?.email);
          const timestamp = new Date().toISOString();
          const notificationData = {
            notification_receivers_email: notificationReceiversEmail,
            notification_sender_name: notificationSenderName,
            notification_sender_role: notificationSenderRole,
            notification_links,
            timestamp,
            status,
          };
        const finalResult =  await notification_collection.insertOne(notificationData);
        res.send(finalResult)
    }
   }
   catch(error){
    console.log(error);
   }

// send notification by store manager va
  try{
    if (currentUser?.role == "Store Manager VA") {
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
      const notificationReceiversEmail = storeManagerVANotificationUsersAccessArr.map(storeManagerVANotificationUser => storeManagerVANotificationUser?.email);
          const timestamp = new Date().toISOString();
          const notificationData = {
            notification_receivers_email: notificationReceiversEmail,
            notification_sender_name: notificationSenderName,
            notification_sender_role: notificationSenderRole,
            notification_links,
            timestamp,
            status,
          };
          const finalResult =  await notification_collection.insertOne(notificationData);
          res.send(finalResult)
    }

  }
  catch(error){
    console.log(error);
  }
// send notification by warehouse admin
  try{
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
      const notificationReceiversEmail = warehouseNotificationUsersAccessArr.map(warehouseNotificationUser => warehouseNotificationUser?.email);
          const timestamp = new Date().toISOString();
          const notificationData = {
            notification_receivers_email: notificationReceiversEmail,
            notification_sender_name: notificationSenderName,
            notification_sender_role: notificationSenderRole,
            notification_links,
            timestamp,
            status,
          };
          const finalResult =  await notification_collection.insertOne(notificationData);
          res.send(finalResult)
    }
  }
  catch(error){
    console.log(error);
  }

// send notification by warehouse admin
  try{
    if (currentUser?.role == "Warehouse Manager VA") {
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
      const notificationReceiversEmail = warehouseVANotificationUsersAccessArr.map(warehouseVANotificationUser => warehouseVANotificationUser?.email);
          const timestamp = new Date().toISOString();
          const notificationData = {
            notification_receivers_email: notificationReceiversEmail,
            notification_sender_name: notificationSenderName,
            notification_sender_role: notificationSenderRole,
            notification_links,
            timestamp,
            status,
          };
          await notification_collection.insertOne(notificationData);
    }
  }
  catch(error){
    console.log(error);
  }
    });

  // get all notifications 
  router.get("/notifications", async (req, res) => {
    const email = req.query?.email
    const limit = req.query?.limit
    const skip = req.query?.skip
    const query = {notification_receivers_email: { $in: [email] }}
    const result = await notification_collection.find(query).sort({ timestamp: -1 }).skip(Number(skip)).limit(Number(limit)).toArray()
    // const result = await notification_collection.find(query).sort({ timestamp: -1 }).toArray()
    res.status(200).send(result)
  })
};

run();
module.exports = router;
