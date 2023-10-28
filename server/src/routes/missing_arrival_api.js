const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")

const run = async () => {
    const db = await connectDatabase()
    const missing_arrival_collection = db.collection("missing_arrival")
    const all_stock_collection = db.collection("all_stock")

    //get all missing arrival data
    router.get('/get_all_missing_arrival_data', async (req, res) => {
        try {
            // const creator_email = req.query.email;
            const admin_id = req.query.admin_id;
            const missingStatus = req.query.status;

            const result = await missing_arrival_collection.find({ admin_id: admin_id, missing_status: missingStatus }).toArray()
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

    //delete a missing arrival data
    router.delete('/delete_missing_arrival_data', async (req, res) => {
        try {
            const id = req.query.id;
            const result = await missing_arrival_collection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount) {
                res.status(200).json({ message: "Successfully deleted a missing arrival data" })
            }
            else {
                res.status(500).json({ message: "Error to delete missing arrival data" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // update missing arrival data from store management
    router.put('/update_missing_arrival_data', async (req, res) => {
        try {
            const id = req.query.id;

            const existData = await missing_arrival_collection.findOne({ _id: new ObjectId(id) });
            if (existData) {
                const updatedData = {
                    product_name: req.body.product_name ? req.body.product_name : existData.product_name,
                    quantity: req.body.quantity ? req.body.quantity : existData.quantity,
                    upin: req.body.upin ? req.body.upin : existData.upin,
                    eda: req.body.eda ? req.body.eda : existData.eda,
                    missing_status: req.body.missing_status !== 'Select Status' ? req.body.missing_status : existData.missing_status,
                    remark: req.body.notes ? req.body.notes : existData.remark
                }
                const result = await missing_arrival_collection.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: updatedData },
                    { returnDocument: "after" }
                );

                if (result) {
                    const existInStock = await all_stock_collection.findOne({ upin: result.upin })
                    const quantity = parseInt(result.missing_quantity) + parseInt(existInStock.received_quantity)
                    const stock = parseInt(result.missing_quantity) + parseInt(existInStock.stock)
                    const oldPrice = parseFloat(existInStock.unit_price)
                    const newPrice = parseFloat(result.unit_price)
                    const avgUnitPrice = (oldPrice + newPrice) / 2;

                    const updateStockdata = {
                        received_quantity: quantity,
                        unit_price: avgUnitPrice.toFixed(2),
                        stock: stock,
                        remark: result.remark
                    }

                    const updatedResult = await all_stock_collection.updateOne(
                        { _id: new ObjectId(existInStock._id) },
                        { $set: updateStockdata }
                    );
                    
                    if (updatedResult.modifiedCount) {
                        return res.status(200).json({ status: 'success', message: 'Data modified successful' });
                    }
                    else {
                        return res.status(203).json({ status: 'failed', message: 'Data not modified' })
                    }
                }
                else {
                    return res.status(203).json({ status: 'failed', message: 'Data not modified' })
                }
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