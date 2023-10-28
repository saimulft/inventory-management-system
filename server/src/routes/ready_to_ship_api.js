const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")

const run = async () => {

    const db = await connectDatabase()
    const ready_to_ship_collection = db.collection("ready_to_ship_data")
    const preparing_form_collection = db.collection("preparing_form_data")
    const all_stock_collection = db.collection("all_stock")

    router.post("/ready_to_ship", async (req, res) => {
        try {
            const id = req.query.id;
            const existData = await preparing_form_collection.findOne({ _id: new ObjectId(id) })

            if (existData) {
                const upin = existData.upin
                const existInStock = await all_stock_collection.findOne({ upin: upin })
                const stock = parseInt(existInStock.stock) - parseInt(existData.quantity)
                const totalSold = parseInt(existInStock.total_sold) + parseInt(existData.quantity)
                const updateStockdata = {
                    stock: stock,
                    total_sold: totalSold
                }
                const StockProductid = existInStock._id
                const updateStockResult = await all_stock_collection.updateOne({ _id: new ObjectId(StockProductid) }, { $set: updateStockdata })
                if (updateStockResult.modifiedCount) {
                    const result = await ready_to_ship_collection.insertOne(existData)

                    if (result.acknowledged) {
                        const deleteResult = await preparing_form_collection.deleteOne({ "_id": new ObjectId(id) })
                        if (deleteResult.deletedCount) {
                            res.status(201).json({ message: "RTS data inserted" })
                        }
                    }
                }
            }
            else {
                return res.status(500).json({ message: "Data not found" });
            }
        } catch (error) {
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