const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")

const run = async () => {

    const db = await connectDatabase()
    const out_of_stock_collection = db.collection("out_of_stock")
    const preparing_form_collection = db.collection("preparing_form_data")

    router.post("/out_of_stock", async (req, res) => {

        try {
            const OOSdata = req.body
            const result = await out_of_stock_collection.insertOne(OOSdata)
            if (result.acknowledged) {

                const deleteResult = await preparing_form_collection.deleteOne({ "_id": new ObjectId(OOSdata._id) })
                if (deleteResult.deletedCount) {
                    res.status(201).json({ message: "OOS data inserted" })
                }
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "OOS  error" });
        }

    })
    router.get('/get_all_OOS_data', async (req, res) => {
        try {
            const data = await out_of_stock_collection.find({}).toArray()

            if (data) {
                res.status(200).json({ data: data })

            }


        } catch (error) {
            res.status(500).json({ message: "get_all_OOS_data_ error" })
        }
    })
}
run()

module.exports = router;