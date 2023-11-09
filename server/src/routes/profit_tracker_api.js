const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")

const run = async () => {
    const db = await connectDatabase()
    const all_stock_collection = db.collection("all_stock")
    const all_stores_collection = db.collection("all_stores")

    // get details for specific store 
    router.get('/single_store_data', async (req, res) => {
        try {
            const storeId = req.query.storeId

            const storeResult = await all_stock_collection.find({ store_id: storeId }).toArray()

            const store = await all_stores_collection.findOne({ _id: new ObjectId(storeId) })

            if (store) {
                if (storeResult.length) {

                    return res.status(200).json({ data: storeResult, store_name: store.store_name, message: "Data successfully get" })
                }
                else {
                    return res.status(200).json({ store_name: store.store_name, message: "Data successfully get" })
                }
            }
            else {
                res.status(204).json({ message: "No data found" })
            }
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    })

    // get all store data for dashboard
    router.get('/all_store_data', async (req, res) => {
        try {
            const adminId = req.query.id

            const storeResult = await all_stock_collection.find({ admin_id: adminId }).toArray()

            if (storeResult.length) {
                return res.status(200).json({ data: storeResult, message: "Data successfully get" })
            }
            else {
                res.status(204).json({ message: "No data found" })
            }
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    })
}
run()

module.exports = router;