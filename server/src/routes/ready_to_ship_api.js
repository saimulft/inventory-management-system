const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const multer = require("multer")
const path = require('path')
const { ObjectId } = require("mongodb")

const run = async () => {

    const db = await connectDatabase()
    const ready_to_ship_collection = db.collection("ready_to_ship_data")
    const preparing_form_collection = db.collection("preparing_form_collection")

    router.post("/ready_to_ship", async (req, res) => {

        try {
            const RTSdata = req.body
            console.log(RTSdata)
            const result = await ready_to_ship_collection.insertOne(RTSdata)
            if (result.acknowledged) {

                const deleteResult = await preparing_form_collection.deleteOne({ "_id": new ObjectId(RTSdata._id) })
                if (deleteResult.deletedCount) {
                    res.status(201).json({ message: "Ready to ship data inserted" })
                }
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Ready to ship error" });
        }

    })
    router.get('/get_all_RTS_data', async (req, res) => {
        try {
            const data = await ready_to_ship_collection.find({}).toArray()
            console.log(data)
            if (data.length) {
                res.status(200).json({ data: data })

            }
           

        } catch (error) {
            res.status(500).json({ message: "get_all_RTS_data_ error" })
        }
    })
}
run()

module.exports = router;