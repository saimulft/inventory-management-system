const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")

const run = async () => {

    const db = await connectDatabase()
    const shipped_data_collection = db.collection("shipped_data")
    const ready_to_ship_collection = db.collection("ready_to_ship_data")
    const all_stock_collection = db.collection("all_stock")

    router.post("/shipped", async (req, res) => {
        try {
            const id = req.query.id;

            const existData = await ready_to_ship_collection.findOne({ _id: new ObjectId(id) })
            if (existData) {
                const result = await shipped_data_collection.insertOne(existData);

                if (result.acknowledged) {
                    const deleteResult = await ready_to_ship_collection.deleteOne({ _id: new ObjectId(id) });

                    if (deleteResult.deletedCount) {
                        return res.status(200).json({ message: "Shipped data inserted and deleted from ready_to_ship_data" });
                    } else {
                        return res.status(404).json({ message: "No matching document found in ready_to_ship_data to delete" });
                    }
                }
            }
            else {
                return res.status(500).json({ message: "Data not found" });
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

    //delete a shipped data
    router.delete('/delete_shipped_data', async (req, res) => {
        try {
            const id = req.query.id;
            const result = await shipped_data_collection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount) {
                res.status(200).json({ message: "Successfully deleted a shipped data" })
            }
            else {
                res.status(500).json({ message: "Error to delete shipped data" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // update pending arrival data from inventory management
    router.put('/update_shipped_data', async (req, res) => {
        try {
            const id = req.query.id;

            const existData = await shipped_data_collection.findOne({ _id: new ObjectId(id) });
            if (existData) {
                const deletedResult = await shipped_data_collection.deleteOne({ _id: new ObjectId(id) })
                if (!deletedResult.deletedCount) {
                    return res.status(500).json({ message: "Error to delete shipped data" })
                }

                const existInStock = await all_stock_collection.findOne({ upin: existData.upin })
                if (existInStock) {
                    const stock = parseInt(existInStock.stock) + parseInt(req.body.resaleable_quantity);
                    const totalSold = parseFloat(existInStock.total_sold) - parseInt(req.body.resaleable_quantity);

                    const updateStockdata = {
                        stock: stock,
                        total_sold: totalSold,
                        remark: req.body.remark ? req.body.remark : existInStock.remark
                    }
                    const id = existInStock._id
                    const updateStockResult = await all_stock_collection.updateOne({ _id: new ObjectId(id) }, { $set: updateStockdata })

                    if (updateStockResult.modifiedCount) {
                        return res.status(201).json({ status: 'success', message: 'Data delete and update operations successful' });
                    }
                    else {
                        return res.status(500).json({ message: 'Error to update all stock data' });
                    }
                }
                //TODO: add else statement if there is no data eixist in all sotck
            }
            else {
                return res.status(404).json({ message: 'Data not found' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
}
run()

module.exports = router;