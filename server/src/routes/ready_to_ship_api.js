const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")

const run = async () => {

    const db = await connectDatabase()
    const ready_to_ship_collection = db.collection("ready_to_ship_data")
    const preparing_form_collection = db.collection("preparing_form_data")

    router.post("/ready_to_ship", async (req, res) => {
        try {
            const id = req.query.id;
            console.log(id);

            const existData = await preparing_form_collection.findOne({ _id: new ObjectId(id) })
            console.log(existData)

            if (existData) {
                const result = await ready_to_ship_collection.insertOne(existData)
                if (result.acknowledged) {
                    const deleteResult = await preparing_form_collection.deleteOne({ "_id": new ObjectId(id) })
                    if (deleteResult.deletedCount) {
                        res.status(201).json({ message: "RTS data inserted" })
                    }
                }
            }
            else{
                return res.status(500).json({ message: "Data not found" });
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Ready to ship error" });
        }
    })


    router.get('/get_all_RTS_data', async (req, res) => {
        try {
            const admin_id = req.query.admin_id;
            const data = await ready_to_ship_collection.find({ admin_id: admin_id }).toArray()

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