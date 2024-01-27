const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")
const verifyJWT = require("../middlewares/verifyJWT")

const run = async () => {
    const db = await connectDatabase()
    const pending_arrival_collection = db?.collection("pending_arrival")
    const missing_arrival_collection = db?.collection("missing_arrival")
    const all_stock_collection = db?.collection("all_stock")
    const all_stores_collection = db?.collection("all_stores")

    // insert pending arrival data
    router.post('/insert_pending_arrival_form_data', async (req, res) => {
        try {
            const data = {
                admin_id: req.body.admin_id,
                date: req.body.date,
                creator_email: req.body.creator_email,
                store_name: req.body.store_name,
                store_id: req.body.store_id,
                asin_upc_code: req.body.asin_upc_code,
                code_type: req.body.code_type,
                supplier_id: req.body.supplier_id,
                product_name: req.body.product_name,
                upin: req.body.upin,
                quantity: req.body.quantity,
                unit_price: req.body.unit_price,
                eda: req.body.eda,
                warehouse_name: req.body.warehouse_name,
                warehouse_id: req.body.warehouse_id,

                amazon_quantity: 0,
                customer_name: 'N/A',
                amazon_shipping: 0,
                shipping_cost: 0,
                handling_cost: 0,
                walmart_quantity: 0,
                amazon_price: 0,
                average_price: 0,
                average_tax: 0,
                order_number: "N/A",
            }

            const storeData = await all_stores_collection.findOne({ _id: new ObjectId(req.body.store_id) })
            if (storeData) {
                if (storeData?.pending_form_submitted < storeData?.max_form_submission_limit) {
                    const result = await pending_arrival_collection.insertOne(data)
                    await all_stores_collection.updateOne(
                        { _id: new ObjectId(req.body.storeId) },
                        { $set: { pending_form_submitted: storeData?.pending_form_submitted + 1 } }
                    )
                    res.status(201).json({ message: "Successfully inserted pending arrival data", result })
                }
                else {
                    res.json({ status: 'exceeded', message: `Your pending arrival request limit for ${storeData.store_name} store has exceeded!` })
                }
            }
            else {
                res.status(500).json({ message: "Internal server error while inserting pending arrival data" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    //get all pending arrival data
    router.post('/get_all_pending_arrival_data', verifyJWT, async (req, res) => {
        try {
            const user = req.body.user;
            const role = req.role;
            const notificationSearch = req.query.notification_search
            let query;
            let result;

            if (notificationSearch != "null") {
                console.log(notificationSearch)
                result = await pending_arrival_collection.findOne({ _id: new ObjectId(notificationSearch) })
                result = [result]
            }

            else {
                if (role === 'Admin' || role === 'Admin VA') {
                    query = { admin_id: user.admin_id }
                }

                else if (role === 'Store Manager Admin' || role === 'Store Manager VA') {
                    const store_access_ids = req.body.user.store_access_ids;
                    query = { store_id: { $in: store_access_ids.map(id => id) } };
                }

                else if (role === 'Warehouse Admin' || role === 'Warehouse Manager VA') {
                    query = { warehouse_id: user.warehouse_id }
                }
                result = await pending_arrival_collection.find(query).sort({ date: -1 }).toArray()
            }

            if (result.length) {
                res.status(200).json({ data: result, message: "Successfully got pending arrival data" })
            }
            else {
                res.status(204).json({ message: "Error to get pending arrival data" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    //delete a pending arrival data
    router.delete('/delete_pending_arrival_data', async (req, res) => {
        try {
            const id = req.query.id;
            const result = await pending_arrival_collection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount) {
                res.status(200).json({ message: "Successfully deleted a pending arrival data" })
            }
            else {
                res.status(204).json({ message: "Error to delete pending arrival data" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // update pending arrival data from store management
    router.put('/update_store_pending_arrival_data', async (req, res) => {
        try {
            const id = req.query.id;

            const existData = await pending_arrival_collection.findOne({ _id: new ObjectId(id) });

            if (existData) {
                const updatedData = {
                    product_name: req.body.product_name ? req.body.product_name : existData.product_name,
                    quantity: req.body.quantity ? req.body.quantity : existData.quantity,
                    eda: req.body.eda ? req.body.eda : existData.eda,
                    courier: req.body.courier !== 'Select Courier' ? req.body.courier : existData.courier,
                    supplier_tracking: req.body.supplier_tracking ? req.body.supplier_tracking : existData.supplier_tracking
                }
                const result = await pending_arrival_collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );

                if (result.modifiedCount) {
                    return res.status(200).json({ status: 'success', message: 'Data modified successful' });
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

    // update pending arrival data from inventory management
    router.put('/update_inventory_pending_arrival_data', async (req, res) => {
        try {
            const id = req.query.id;

            const existData = await pending_arrival_collection.findOne({ _id: new ObjectId(id) });
            if (existData) {
                const updatedData = {
                    product_name: req.body.product_name ? req.body.product_name : existData.product_name,
                    quantity: req.body.quantity ? req.body.quantity : existData.quantity,
                    eda: req.body.eda ? req.body.eda : existData.eda,
                    received_quantity: req.body.received_quantity ? req.body.received_quantity : existData.received_quantity,
                    remark: req.body.remark ? req.body.remark : existData.remark
                }
                const result = await pending_arrival_collection.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: updatedData },
                    { returnDocument: "after" }
                );

                if (result) {
                    if (req.body.received_quantity) {
                        const missingQuantity = parseInt(result.quantity) - parseInt(result.received_quantity);

                        const deletedResult = await pending_arrival_collection.deleteOne({ _id: new ObjectId(id) });
                        if (!deletedResult.deletedCount) {
                            return res.status(500).json({ message: "Error to delete pending arrival data" })
                        }

                        // let missingArrivalInsertedId;
                        let missingArrivalInsertedId;
                        if (missingQuantity) {
                            const missingArrivalData = {
                                ...result,
                                missing_quantity: missingQuantity,
                                missing_status: 'active'
                            }
                            const insertResult = await missing_arrival_collection.insertOne(missingArrivalData);
                            missingArrivalInsertedId = insertResult.insertedId
                            // missingArrivalData = insertResult.insertedId
                            if (!insertResult.insertedId) {
                                return res.status(500).json({ message: 'Internal server error while inserting missing arrival data' });
                            }
                        }

                        const existInStock = await all_stock_collection.findOne({ upin: result.upin })
                        if (existInStock) {
                            const quantity = parseInt(result.received_quantity) + parseInt(existInStock.received_quantity)
                            const stock = parseInt(result.received_quantity) + parseInt(existInStock.stock)

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
                            const id = existInStock._id
                            let notificationSearchArray = []
                            if (missingArrivalInsertedId) {
                                notificationSearchArray = [id, missingArrivalInsertedId]
                            }
                            else {
                                notificationSearchArray = id
                            }
                            const updateStockResult = await all_stock_collection.updateOne({ _id: new ObjectId(id) }, { $set: updateStockdata })
                            if (updateStockResult.modifiedCount) {
                                return res.status(201).json({ status: 'success', message: 'Data update and insert operations successful', result: notificationSearchArray });
                            }
                            else {
                                return res.status(500).json({ message: 'Error to insert all stock data' });
                            }
                        }

                        else {
                            const remainingPrice = parseInt(result.received_quantity) * result.unit_price;
                            const allStockData = {
                                ...result,
                                stock: result.received_quantity,
                                total_sold: 0,
                                sold_price: 0,
                                remaining_price: remainingPrice
                            }
                            const allStockIntertResult = await all_stock_collection.insertOne(allStockData)
                            if (allStockIntertResult.insertedId) {
                                return res.status(201).json({ status: 'success', message: 'Data update and insert operations successful', result: [allStockIntertResult.insertedId, missingArrivalInsertedId] });
                            }
                            else {
                                return res.status(500).json({ message: 'Error to insert all stock data' });
                            }
                        }
                    }
                    else {
                        return res.status(201).json({ status: 'success', message: 'Data update successful' });
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