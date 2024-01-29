const express = require("express");
const connectDatabase = require("../config/connectDatabase");
const { ObjectId } = require("mongodb");
const router = express.Router();

const run = async () => {
  const db = await connectDatabase();
  const all_users_collection = db.collection("all_users");
  const admin_users_collection = db.collection("admin_users");
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
  const store_owner_collection = db?.collection(
    "store_owner_users"
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
      if (userRole == "Store Owner") {
        query = { email: currentUserEmail, role: userRole };
        result = await store_owner_collection.findOne(query);
      }
      if (userRole == "Store Manager Admin") {
        query = { email: currentUserEmail, role: userRole };
        result = await store_manager_admin_users_collection.findOne(query);
      }
      if (userRole == "Store Manager VA") {
        query = { email: currentUserEmail, role: userRole };
        result = await store_manager_va_users_collection.findOne(query);
      }
      if (userRole == "Warehouse Admin") {
        query = { email: currentUserEmail, role: userRole };
        result = await warehouse_admin_users_collection.findOne(query);
      }
      if (userRole == "Warehouse Manager VA") {
        query = { email: currentUserEmail, role: userRole };
        result = await warehouse_manager_va_users_collection.findOne(query);
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: "server error" });
    }
  });

  // set notifications in db
  router.post("/send_notification", async (req, res) => {
    const {
      currentUser,
      status,
      notification_link,
      notification_search,
      storeId,
      warehouseId,
    } = req.body;
    const notificationSenderRole = currentUser?.role;
    const notificationSenderName = currentUser?.full_name;

    // send notification by admin
    try {
      if (currentUser?.role == "Admin") {
        // get access admin and admin va users
        const adminVAQuery = { admin_id: currentUser?._id };
        const adminVAAccessUsers = await admin_va_users_collection
          .find(adminVAQuery)
          .toArray();

        //  get storeManager and store manager va access users
        let storeManagerAdminAndStoreManagerVAQuery = {
          admin_id: currentUser?._id,
        };

        if (storeId) {
          storeManagerAdminAndStoreManagerVAQuery.store_access_ids = {
            $in: [storeId],
          };
        }

        const storeManagerAdminAccessUsers =
          await store_manager_admin_users_collection
            .find(storeManagerAdminAndStoreManagerVAQuery)
            .toArray();


        const storeManagerVAAccessUsers =
          await store_manager_va_users_collection
            .find(storeManagerAdminAndStoreManagerVAQuery)
            .toArray();

        //get warehouse  admin and warehouse manager va access users
        let warehouseAdminAndWarehouseManagerVAQuery = {
          admin_id: currentUser?._id,
        };
        if (warehouseId) {
          warehouseAdminAndWarehouseManagerVAQuery.warehouse_id = warehouseId;
        }

        const warehouseAdminAccessUsers = await warehouse_admin_users_collection
          .find(warehouseAdminAndWarehouseManagerVAQuery)
          .toArray();

        const warehouseManagerVaAccessUsers =
          await warehouse_manager_va_users_collection
            .find(warehouseAdminAndWarehouseManagerVAQuery)
            .toArray();

        const adminNotificationAccessUsers = [
          ...adminVAAccessUsers,
          ...storeManagerAdminAccessUsers,
          ...storeManagerVAAccessUsers,
          ...warehouseAdminAccessUsers,
          ...warehouseManagerVaAccessUsers,
        ];

        // define notification receiver email
        const notificationReceiversEmail = adminNotificationAccessUsers
          ?.map(
            (adminNotificationAccessUser) => adminNotificationAccessUser?.email
          )
          ?.filter((email) => email != currentUser?.email);

        // define notification unseen email
        const unseenUsersArray = {};
        const findNotificationUnseenUsers = adminNotificationAccessUsers?.map(
          (adminNotificationAccessUser) => {
            const unseenUser =
              adminNotificationAccessUser?.email?.split("@")[0];
            unseenUsersArray[unseenUser] = false;
          }
        );

        const timestamp = new Date().toISOString();
        const notificationData = {
          notification_receivers_email: notificationReceiversEmail,
          notification_sender_name: notificationSenderName,
          notification_sender_role: notificationSenderRole,
          timestamp,
          status,
          notification_search,
          notification_link,
          isNotificationSeen: unseenUsersArray,
          storeId,
          warehouseId,
        };
        const finalResult = await notification_collection.insertOne(
          notificationData,
          { upsert: true }
        );
        res.send({ finalResult, notificationData });
      }
    } catch (error) {
      console.log(error);
    }

    // send notification by admin va
    try {
      if (currentUser?.role == "Admin VA") {
        // get access admin and admin va users
        const adminQuery = { admin_id: currentUser?.admin_id };
        const adminAccessUsers = await admin_users_collection
          .find(adminQuery)
          .toArray();

        //  get storeManager and store manager va access users
        let storeManagerAdminAndStoreManagerVAQuery = {
          admin_id: currentUser?.admin_id,
        };
        if (storeId) {
          storeManagerAdminAndStoreManagerVAQuery.store_access_ids = {
            $in: [storeId],
          };
        }

        const storeManagerAdminAccessUsers =
          await store_manager_admin_users_collection
            .find(storeManagerAdminAndStoreManagerVAQuery)
            .toArray();
        const storeManagerVAAccessUsers =
          await store_manager_va_users_collection
            .find(storeManagerAdminAndStoreManagerVAQuery)
            .toArray();

        //get warehouse  admin and warehouse manager va access users
        let warehouseAdminAndWarehouseManagerVAQuery = {
          admin_id: currentUser?.admin_id,
        };
        if (warehouseId) {
          warehouseAdminAndWarehouseManagerVAQuery.warehouse_id = warehouseId;
        }
        const warehouseAdminAccessUsers = await warehouse_admin_users_collection
          .find(warehouseAdminAndWarehouseManagerVAQuery)
          .toArray();

        const warehouseManagerVaAccessUsers =
          await warehouse_manager_va_users_collection
            .find(warehouseAdminAndWarehouseManagerVAQuery)
            .toArray();

        const adminNotificationAccessUsers = [
          ...adminAccessUsers,
          ...storeManagerAdminAccessUsers,
          ...storeManagerVAAccessUsers,
          ...warehouseAdminAccessUsers,
          ...warehouseManagerVaAccessUsers,
        ];
        // define notification receiver email
        const notificationReceiversEmail = adminNotificationAccessUsers
          ?.map(
            (adminNotificationAccessUser) => adminNotificationAccessUser?.email
          )
          ?.filter((email) => email != currentUser?.email);

        // define notification unseen email
        const unseenUsersArray = {};
        const findNotificationUnseenUsers = adminNotificationAccessUsers?.map(
          (adminNotificationAccessUser) => {
            const unseenUser =
              adminNotificationAccessUser?.email?.split("@")[0];
            unseenUsersArray[unseenUser] = false;
          }
        );

        const timestamp = new Date().toISOString();
        const notificationData = {
          notification_receivers_email: notificationReceiversEmail,
          notification_sender_name: notificationSenderName,
          notification_sender_role: notificationSenderRole,
          timestamp,
          status,
          notification_search,
          notification_link,
          isNotificationSeen: unseenUsersArray,
          storeId,
          warehouseId,
        };
        const finalResult = await notification_collection.insertOne(
          notificationData,
          { upsert: true }
        );
        res.send({ finalResult, notificationData });
      }
    } catch (error) {
      console.log(error);
    }

    // send notification by store manager admin
    try {
      if (currentUser?.role == "Store Manager Admin") {
        const adminQuery = { admin_id: currentUser?.admin_id };
        const adminAccessUsers = await admin_users_collection
          .find(adminQuery)
          .toArray();

        const adminVAQuery = { admin_id: currentUser?.admin_id };
        const adminVAAccessUsers = await admin_va_users_collection
          .find(adminVAQuery)
          .toArray();

        const storeManagerAdminQuery = {
          admin_id: currentUser?.admin_id,
        };

        if (storeId) {
          storeManagerAdminQuery.store_access_ids = { $in: [storeId] };
        }

        const storeManagerAccessUsers =
          await store_manager_admin_users_collection
            .find(storeManagerAdminQuery)
            .toArray();

        const storeManagerVAQuery = {
          admin_id: currentUser?.admin_id,
        };

        if (storeId) {
          storeManagerAdminQuery.store_access_ids = { $in: [storeId] };
        }

        const storeManagerVAAccessUsers =
          await store_manager_va_users_collection
            .find(storeManagerVAQuery)
            .toArray();

        const warehouseAdminQuery = {
          admin_id: currentUser?.admin_id,
        };
        if (warehouseId) {
          warehouseAdminQuery.warehouse_id = warehouseId;
        }
        const warehouseAdminAccessUsers = await warehouse_admin_users_collection
          .find(warehouseAdminQuery)
          .toArray();

        const warehouseManagerVAQuery = {
          admin_id: currentUser?.admin_id,
        };
        if (warehouseId) {
          warehouseAdminQuery.warehouse_id = warehouseId;
        }
        const warehouseManagerVAAccessUsers =
          await warehouse_manager_va_users_collection
            .find(warehouseManagerVAQuery)
            .toArray();

        const storeManagerNotificationUsersAccessArr = [
          ...adminAccessUsers,
          ...adminVAAccessUsers,
          ...storeManagerAccessUsers,
          ...storeManagerVAAccessUsers,
          ...warehouseAdminAccessUsers,
          ...warehouseManagerVAAccessUsers,
        ];

        // send notification
        // define notification receiver email
        const notificationReceiversEmail =
          storeManagerNotificationUsersAccessArr.map(
            (storeManagerNotificationUser) =>
              storeManagerNotificationUser?.email
          );

        // define notification unseen email
        const unseenUsersArray = {};
        const findNotificationUnseenUsers =
          storeManagerNotificationUsersAccessArr?.map(
            (storeManagerNotificationUser) => {
              const unseenUser =
                storeManagerNotificationUser?.email?.split("@")[0];
              unseenUsersArray[unseenUser] = false;
            }
          );

        const timestamp = new Date().toISOString();
        const notificationData = {
          notification_receivers_email: notificationReceiversEmail,
          notification_sender_name: notificationSenderName,
          notification_sender_role: notificationSenderRole,
          timestamp,
          status,
          notification_search,
          notification_link,
          isNotificationSeen: unseenUsersArray,
          storeId,
          warehouseId,
        };
        const finalResult = await notification_collection.insertOne(
          notificationData
        );
        res.send({ finalResult, notificationData });
      }
    } catch (error) {
      console.log(error);
    }

    // send notification by store manager va
    try {
      if (currentUser?.role == "Store Manager VA") {
        const adminQuery = { admin_id: currentUser?.admin_id };
        const adminAccessUsers = await admin_users_collection
          .find(adminQuery)
          .toArray();

        const adminVAQuery = { admin_id: currentUser?.admin_id };
        const adminVAAccessUsers = await admin_va_users_collection
          .find(adminVAQuery)
          .toArray();

        const storeManagerAdminQuery = {
          admin_id: currentUser?.admin_id,
        };

        if (storeId) {
          storeManagerAdminQuery.store_access_ids = { $in: [storeId] };
        }

        const storeManagerAccessUsers =
          await store_manager_admin_users_collection
            .find(storeManagerAdminQuery)
            .toArray();

        const storeManagerVAQuery = {
          email: { $ne: currentUser?.email },
          admin_id: currentUser?.admin_id,
        };

        if (storeId) {
          storeManagerAdminQuery.store_access_ids = { $in: [storeId] };
        }

        const storeManagerVAAccessUsers =
          await store_manager_va_users_collection
            .find(storeManagerVAQuery)
            .toArray();

        const warehouseAdminQuery = {
          admin_id: currentUser?.admin_id,
        };

        if (warehouseId) {
          storeManagerAdminQuery.warehouse_id = warehouseId;
        }

        const warehouseAdminAccessUsers = await warehouse_admin_users_collection
          .find(warehouseAdminQuery)
          .toArray();

        const warehouseManagerVAQuery = {
          admin_id: currentUser?.admin_id,
        };

        if (warehouseId) {
          storeManagerAdminQuery.warehouse_id = warehouseId;
        }

        const warehouseManagerVAAccessUsers =
          await warehouse_manager_va_users_collection
            .find(warehouseManagerVAQuery)
            .toArray();

        const storeManagerVANotificationUsersAccessArr = [
          ...adminAccessUsers,
          ...adminVAAccessUsers,
          ...storeManagerAccessUsers,
          ...storeManagerVAAccessUsers,
          ...warehouseAdminAccessUsers,
          ...warehouseManagerVAAccessUsers,
        ];

        // send notification
        // define notification receiver email
        const notificationReceiversEmail =
          storeManagerVANotificationUsersAccessArr.map(
            (storeManagerVANotificationUser) =>
              storeManagerVANotificationUser?.email
          );

        // define notification unseen email
        const unseenUsersArray = {};
        const findNotificationUnseenUsers =
          storeManagerVANotificationUsersAccessArr?.map(
            (storeManagerVANotificationUser) => {
              const unseenUser =
                storeManagerVANotificationUser?.email?.split("@")[0];
              unseenUsersArray[unseenUser] = false;
            }
          );

        const timestamp = new Date().toISOString();
        const notificationData = {
          notification_receivers_email: notificationReceiversEmail,
          notification_sender_name: notificationSenderName,
          notification_sender_role: notificationSenderRole,
          timestamp,
          status,
          notification_search,
          notification_link,
          isNotificationSeen: unseenUsersArray,
          storeId,
          warehouseId,
        };
        const finalResult = await notification_collection.insertOne(
          notificationData
        );
        res.send({ finalResult, notificationData });
      }
    } catch (error) {
      console.log(error);
    }

    // send notification by warehouse admin
    try {
      if (currentUser?.role == "Warehouse Admin") {
        const adminQuery = { admin_id: currentUser?.admin_id };
        const adminAccessUsers = await admin_users_collection
          .find(adminQuery)
          .toArray();

        const adminVAQuery = { admin_id: currentUser?.admin_id };
        const adminVAAccessUsers = await admin_va_users_collection
          .find(adminVAQuery)
          .toArray();

        const storeManagerAdminQuery = {
          admin_id: currentUser?.admin_id,
          store_access_ids: { $in: [storeId] },
        };
        const storeManagerAccessUsers =
          await store_manager_admin_users_collection
            .find(storeManagerAdminQuery)
            .toArray();

        const storeManagerVAQuery = {
          admin_id: currentUser?.admin_id,
          store_access_ids: { $in: [storeId] },
        };
        const storeManagerVAAccessUsers =
          await store_manager_va_users_collection
            .find(storeManagerVAQuery)
            .toArray();

        const warehouseManagerVAQuery = {
          admin_id: currentUser?.admin_id,
          warehouse_id: warehouseId,
        };
        const warehouseManagerVAAccessUsers =
          await warehouse_manager_va_users_collection
            .find(warehouseManagerVAQuery)
            .toArray();

        const warehouseNotificationUsersAccessArr = [
          ...adminAccessUsers,
          ...adminVAAccessUsers,
          ...storeManagerAccessUsers,
          ...storeManagerVAAccessUsers,
          ...warehouseManagerVAAccessUsers,
        ];

        // send notification
        // define notification receiver email
        const notificationReceiversEmail =
          warehouseNotificationUsersAccessArr.map(
            (warehouseNotificationUser) => warehouseNotificationUser?.email
          );

        // define notification unseen email
        const unseenUsersArray = {};
        const findNotificationUnseenUsers =
          warehouseNotificationUsersAccessArr?.map(
            (warehouseNotificationUser) => {
              const unseenUser =
                warehouseNotificationUser?.email?.split("@")[0];
              unseenUsersArray[unseenUser] = false;
            }
          );

        const timestamp = new Date().toISOString();
        const notificationData = {
          notification_receivers_email: notificationReceiversEmail,
          notification_sender_name: notificationSenderName,
          notification_sender_role: notificationSenderRole,
          timestamp,
          status,
          notification_search,
          notification_link,
          isNotificationSeen: unseenUsersArray,
          storeId,
          warehouseId,
        };
        const finalResult = await notification_collection.insertOne(
          notificationData
        );
        res.send({ finalResult, notificationData });
      }
    } catch (error) {
      console.log(error);
    }

    // send notification by warehouse admin
    try {
      if (currentUser?.role == "Warehouse Manager VA") {
        const adminQuery = { admin_id: currentUser?.admin_id };
        const adminAccessUsers = await admin_users_collection
          .find(adminQuery)
          .toArray();

        const adminVAQuery = { admin_id: currentUser?.admin_id };
        const adminVAAccessUsers = await admin_va_users_collection
          .find(adminVAQuery)
          .toArray();

        const storeManagerAdminQuery = {
          admin_id: currentUser?.admin_id,
          store_access_ids: { $in: [storeId] },
        };
        const storeManagerAccessUsers =
          await store_manager_admin_users_collection
            .find(storeManagerAdminQuery)
            .toArray();

        const storeManagerVAQuery = {
          admin_id: currentUser?.admin_id,
          store_access_ids: { $in: [storeId] },
        };
        const storeManagerVAAccessUsers =
          await store_manager_va_users_collection
            .find(storeManagerVAQuery)
            .toArray();

        const warehouseAdminQuery = {
          admin_id: currentUser?.admin_id,
          warehouse_id: warehouseId,
        };
        const warehouseAdminAccessUsers = await warehouse_admin_users_collection
          .find(warehouseAdminQuery)
          .toArray();

        const warehouseManagerVAQuery = {
          email: { $ne: currentUser?.email },
          admin_id: currentUser?.admin_id,
          warehouse_id: warehouseId,
        };
        const warehouseManagerVAAccessUsers =
          await warehouse_manager_va_users_collection
            .find(warehouseManagerVAQuery)
            .toArray();

        const warehouseNotificationUsersAccessArr = [
          ...adminAccessUsers,
          ...adminVAAccessUsers,
          ...storeManagerAccessUsers,
          ...storeManagerVAAccessUsers,
          ...warehouseAdminAccessUsers,
          ...warehouseManagerVAAccessUsers,
        ];

        // send notification
        // define notification receiver email
        const notificationReceiversEmail =
          warehouseNotificationUsersAccessArr.map(
            (warehouseVANotificationUser) => warehouseVANotificationUser?.email
          );

        // define notification unseen email
        const unseenUsersArray = {};
        const findNotificationUnseenUsers =
          warehouseNotificationUsersAccessArr?.map(
            (warehouseVANotificationUser) => {
              const unseenUser =
                warehouseVANotificationUser?.email?.split("@")[0];
              unseenUsersArray[unseenUser] = false;
            }
          );
        const timestamp = new Date().toISOString();
        const notificationData = {
          notification_receivers_email: notificationReceiversEmail,
          notification_sender_name: notificationSenderName,
          notification_sender_role: notificationSenderRole,
          timestamp,
          status,
          notification_search,
          notification_link,
          isNotificationSeen: unseenUsersArray,
          storeId,
          warehouseId,
        };
        await notification_collection.insertOne(notificationData);
      }
    } catch (error) {
      console.log(error);
    }
  });

  router.patch('/notifications/read_all', async (req, res) => {
    const email = req?.query?.email
    const notificationSeenObjKey = email.split("@")[0]
    const query = { [`isNotificationSeen.${notificationSeenObjKey}`]: false }
    const updatedData = {
      $set: {
        [`isNotificationSeen.${notificationSeenObjKey}`]: true,
      },
    };
    const result = await notification_collection.updateMany(query, updatedData)
    res.status(200).send(result);
  })

  // notification seen
  router.patch("/notification_seen", async (req, res) => {
    const { id, email } = req.query;
    const seenNotificationUser = email.split("@")[0];
    const query = { _id: new ObjectId(id) };
    const updatedData = {
      $set: {
        [`isNotificationSeen.${seenNotificationUser}`]: true,
      },
    };
    const result = await notification_collection.updateOne(query, updatedData);
    if (result) {
      res
        .status(200)
        .send({ data: result, message: "successfully update seen status" });
    } else {
      res.status(404).send({ data: {}, message: "conversation not found." });
    }
  });

  // get notifications
  router.get("/notifications", async (req, res) => {
    const email = req.query?.email;
    const limit = req.query?.limit;
    const skip = req.query?.skip;
    const query = { notification_receivers_email: { $in: [email] } };
    if (limit && email) {
      const result = await notification_collection
        .find(query)
        .sort({ timestamp: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .toArray();
      res.status(200).send(result);
    }
  });

  // get all notification
  router.get("/all_notifications", async (req, res) => {
    const email = req?.query?.email;
    const query = { notification_receivers_email: { $in: [email] } };
    const result = await notification_collection.find(query).toArray();
    res.status(200).send(result);
  });
};

run();
module.exports = router;
