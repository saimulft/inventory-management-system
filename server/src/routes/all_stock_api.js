const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')

const run = async () => {
    const db = await connectDatabase()
    const all_stock_collection = db.collection("all_stock")

    //get all stock data
    router.post('/get_all_stock_data', async (req, res) => {
        try {
            const user = req.body.user;
            const role = user.role;

            let query;

            if (role === 'Admin' || role === 'Admin VA') {
                query = { admin_id: user.admin_id }
            }

            else if (role === 'Store Manager Admin' || role === 'Store Manager VA') {

                const store_access_ids = req.body.user.store_access_ids; // Assuming store_access_ids is an array of IDs
                query = { store_id: { $in: store_access_ids.map(id => id) } };
            }

            else if (role === 'Warehouse Admin' || role === 'Warehouse Manager VA') {
                query = { warehouse_id: user.warehouse_id }
            }

            const result = await all_stock_collection.find(query).sort({ date: -1 }).toArray()
            if (result.length) {
                res.status(200).json({ data: result, message: "Successfully got all stock data" })
            }
            else {
                res.status(500).json({ message: "Error to get all stock data" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // get stock data by UPIN
    router.post('/all_stock_by_upin', async (req, res) => {
        try {
            const upin = req.query.upin
            const user = req.body.user;
            const role = user.role;

            let query;

            if (role === 'Admin' || role === 'Admin VA') {
                query = { admin_id: user.admin_id, upin: upin }
            }
            else if (role === 'Store Manager Admin' || role === 'Store Manager VA') {

                const store_access_ids = req.body.user.store_access_ids;
                query = { store_id: { $in: store_access_ids.map(id => id) }, upin: upin };
            }

            else if (role === 'Warehouse Admin' || role === 'Warehouse Manager VA') {
                query = { warehouse_id: user.warehouse_id, upin: upin }
            }
            const result = await all_stock_collection.findOne(query)

            if (result) {
                res.status(200).json({ data: result, message: "Successfully got all stock data" })
            }
            else {
                res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}
run()

module.exports = router;