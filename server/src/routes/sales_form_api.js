const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")
const verifyJWT = require("../middlewares/verifyJWT")

const run = async () => {
    const db = await connectDatabase()
    const profit_tracker_collection = db.collection("profit_tracker")

    router.post('/insert_sales_form', verifyJWT, async (req, res) => {
        try {
            const result = await profit_tracker_collection.insertOne({ ...req.body, order_item_id: '' })
            if (result.insertedId) {
                return res.status(201).send()
            }
            else {
                return res.status(204).send()
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "internal server error" })
        }
    })

    router.put('/update_profit_tracker', verifyJWT, async (req, res) => {
        try {
            const result = await profit_tracker_collection.updateOne({ _id:new ObjectId(req.query.id) }, { $set:req.body })
            if (result.modifiedCount) {
                return res.status(200).send()
            }
            else {
                return res.status(204).send()
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "internal server error" })
        }
    })
}
run()

module.exports = router;