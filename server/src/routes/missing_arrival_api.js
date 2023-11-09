const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")

const run = async () => {
    const db = await connectDatabase()
    const missing_arrival_collection = db.collection("missing_arrival")
    const all_stock_collection = db.collection("all_stock")

    //get all missing arrival data
    router.post('/get_all_missing_arrival_data', async (req, res) => {
        try {
            const user = req.body.user
            const role = user.role
            const missingStatus = req.query.status;
            let query;

            if (role === 'Admin' || role === 'Admin VA') {
                query = { admin_id: user.admin_id, missing_status: missingStatus }
            }
            else if (role === 'Store Manager Admin' || role === 'Store Manager VA') {

                const store_access_ids = req.body.user.store_access_ids;
                query = { store_id: { $in: store_access_ids.map(id => id) }, missing_status: missingStatus };
            }

            else if (role === 'Warehouse Admin' || role === 'Warehouse Manager VA') {
                query = { warehouse_id: user.warehouse_id, missing_status: missingStatus }
            }



            const result = await missing_arrival_collection.find(query).sort({ date: -1 }).toArray()
            if (result.length) {
                res.status(200).json({ data: result, message: "Successfully got missing arrival data" })
            }
            else {
                res.status(204).json({ message: "No content" })
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
                    // product_name: req.body.product_name ? req.body.product_name : existData.product_name,
                    // eda: req.body.eda ? req.body.eda : existData.eda,
                    missing_status: req.body.missing_status !== 'Select Status' ? req.body.missing_status : existData.missing_status,
                    remark: req.body.notes ? req.body.notes : existData.remark
                }
                const result = await missing_arrival_collection.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: updatedData },
                    { returnDocument: "after" }
                );

                if (result) {
                    if (req.body.missing_status !== 'Select Status') {
                        const existInStock = await all_stock_collection.findOne({ upin: result.upin })
                        const quantity = parseInt(result.missing_quantity) + parseInt(existInStock.received_quantity)
                        const stock = parseInt(result.missing_quantity) + parseInt(existInStock.stock)
                        const oldPrice = parseFloat(existInStock.unit_price)
                        const newPrice = parseFloat(result.unit_price)
                        const avgUnitPrice = (oldPrice + newPrice) / 2;

                        const remainingPrice = stock * avgUnitPrice

                        const updateStockdata = {
                            received_quantity: quantity,
                            unit_price: avgUnitPrice.toFixed(2),
                            stock: stock,
                            remark: result.remark,
                            remaining_price: remainingPrice
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
                    else{
                        return res.status(200).json({ status: 'success', message: 'Data modified successful' });
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