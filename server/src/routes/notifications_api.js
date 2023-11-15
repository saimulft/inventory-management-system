const express = require("express");
const connectDatabase = require("../config/connectDatabase");
const router = express.Router();

const run = async () => {
  const db = await connectDatabase();
  const all_users_collection = db.collection("all_users")
  const store_manager_admin_users_collection = db.collection("store_manager_admin_users")
  const store_manager_va_users_collection = db.collection("store_manager_va_users")
  const warehouse_admin_users_collection = db.collection("warehouse_admin_users")
  const warehouse_manager_va_users_collection = db.collection("warehouse_manager_va_users")
  const admin_va_users_collection = db.collection("admin_va_users")
  const conversationsCollection = db.collection("notifications");

    router.get("/current_user", async (req, res) => {
      try{
        const currentUserEmail = req.query.email
        const userRole = req.query.user_role

        let query;
        let result;
        
      if(userRole == "Admin"){
        console.log("admin and admin va");
        query = {email: currentUserEmail, role: userRole}
        result = await all_users_collection.findOne(query)
      }
      if(userRole == "Admin VA"){
        console.log("admin and admin va");
        query = {email: currentUserEmail, role: userRole}
        result = await admin_va_users_collection.findOne(query)
      }
      if(userRole == "Store Manager Admin"){
       console.log("Store Manager admin");
       result = await store_manager_admin_users_collection.findOne(query)
      }
      if(userRole == "Store Manager VA"){
        console.log("Store Manager va");
        result = await store_manager_va_users_collection.findOne(query)
      }
      if(userRole == "Warehouse Admin"){
      console.log("Warehouse Admin");
      result = await warehouse_admin_users_collection.findOne(query)
      }
      if(userRole == "Warehouse Manager VA"){
        result = await warehouse_manager_va_users_collection.findOne(query)
      }
      console.log(result);
      res.status(200).send(result)
      }
      catch(error){
        res.status(500).send({ error: "server error" })
      }
    })
};

run();
module.exports = router;
