const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")

const run = async () => {
    const db = await connectDatabase()
    const missing_arrival_collection = db.collection("missing_arrival")

    //get all missing arrival data
    router.get('/get_all_missing_arrival_data', async (req, res) => {
        try {
            // const creator_email = req.query.email;
            const admin_id = req.query.admin_id;
            const result = await missing_arrival_collection.find({ admin_id: admin_id }).toArray()
            if (result.length) {
                res.status(200).json({ data: result, message: "Successfully got missing arrival data" })
            }
            else {
                res.status(500).json({ message: "Error to get missing arrival data" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}
run()

module.exports = router;