const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")

const run = async () => {

    const db = await connectDatabase()

    const shipped_data_collection = db.collection("shipped_data")
    const ready_to_ship_collection = db.collection("ready_to_ship_data")
    router.post("/shipped", async (req, res) => {
        try {
            const shippedData = req.body;

            const result = await shipped_data_collection.insertOne(shippedData);
            console.log(result)

            if (result.acknowledged) {
                const deleteResult = await ready_to_ship_collection.deleteOne({ "_id": shippedData._id });
                console.log(deleteResult);

                if (deleteResult.deletedCount === 1) {
                    res.status(200).json({ message: "Shipped data inserted and deleted from ready_to_ship_data" });
                } else {
                    res.status(404).json({ message: "No matching document found in ready_to_ship_data to delete" });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error occurred while processing shipped data" });
        }
    });
    router.get('/get_all_shipped_data', async (req, res) => {
        try {
            const admin_id = req.query.admin_id;
            const data = await shipped_data_collection.find({ admin_id: admin_id }).toArray()
            if (data) {
                res.status(200).json({ data: data })
            }

        } catch (error) {
            res.status(500).json({ message: "get_all_RTS_data_ error" })
        }
    })
}
run()

module.exports = router;