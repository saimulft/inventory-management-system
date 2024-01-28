const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")
const verifyJWT = require("../middlewares/verifyJWT")

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

                const soldPrice = totalSold * parseFloat(existInStock.unit_price)
                const remainingPrice = stock * parseFloat(existInStock.unit_price)

                const updateStockdata = {
                    stock: stock,
                    total_sold: totalSold,
                    sold_price: soldPrice,
                    remaining_price: remainingPrice
                }
                const StockProductid = existInStock._id
                const updateStockResult = await all_stock_collection.updateOne({ _id: new ObjectId(StockProductid) }, { $set: updateStockdata })
                if (updateStockResult.modifiedCount) {
                    const result = await ready_to_ship_collection.insertOne(existData)

                    if (result.acknowledged) {
                        const deleteResult = await preparing_form_collection.deleteOne({ "_id": new ObjectId(id) })
                        if (deleteResult.deletedCount) {
                            res.status(201).json({ message: "RTS data inserted", result })
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


    router.post('/get_all_RTS_data',verifyJWT, async (req, res) => {
        try {
            const user = req.body.user;
            const role = req.role;

            let query;

            if (role === 'Admin' || role === 'Admin VA') {
                query = { admin_id: user.admin_id }
            }

            else if (role === 'Store Manager Admin' || role === 'Store Manager VA') {

                const store_access_ids = req.body.user.store_access_ids;
                query = { store_id: { $in: store_access_ids.map(id => id) } };
            }

            else if (role === 'Warehouse Admin' || role === 'Warehouse Manager VA') {
                query = { warehouse_id: user.warehouse_id}
            }

            const data = await ready_to_ship_collection.find(query).sort({ date: -1 }).toArray()

            if (data) {
                res.status(200).json({ data: data })
            }
            else {
                res.status(204).json({ message: "No content" })
            }

        } catch (error) {
            res.status(500).json({ message: "get_all_RTS_data_ error" })
        }
    })
}
run()

module.exports = router;