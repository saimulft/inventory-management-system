const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')

const run = async () => {
    const db = await connectDatabase()
    const store_manager_collection = db.collection("admin_users")
    try {


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
run()

module.exports = router;