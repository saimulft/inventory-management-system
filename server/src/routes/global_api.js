const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const path = require("path")
const verifyJWT = require("../middlewares/verifyJWT")
const run = async () => {
    const db = await connectDatabase()
    const all_stock_collection = db.collection("all_stock")
    const pending_arrival_collection = db.collection("pending_arrival")
    const preparing_form_data_collection = db.collection("preparing_form_data")
    const ready_to_ship_collection = db.collection("ready_to_ship_data")
    const shipped_data_collection = db.collection("shipped_data")
    const out_of_stock_collection = db.collection("out_of_stock")
    const missing_arrival_collection = db.collection("missing_arrival")
    const asin_upc_collection = db.collection("asin_upc")

    // const collections = [
    //     'all_stock',
    //     'pending_arrival',
    //     'preparing_form_data',
    //     'ready_to_ship_data',
    //     'shipped_data',
    //     'out_of_stock',
    //     'missing_arrival',
    //     'asin_upc',
    // ];
    // for (const collectionName of collections) {
    //     const collection = db.collection(collectionName);
    //     const count = await collection.countDocuments(query);
    //     counts[collectionName] = count;
    // }

    // Define a route to get document counts for all collections
    router.post('/collections-docs-counts', verifyJWT, async (req, res) => {
        try {
            const user = req.body.user;
            const role = req.role;

            const projection = { _id: 1 }
            let query;

            if (role === 'Admin' || role === 'Admin VA') {
                query = { admin_id: user.admin_id }
            }

            else if ((role === 'Store Manager Admin' || role === 'Store Manager VA') && user?.store_access_ids?.length) {
                const store_access_ids = req.body.user.store_access_ids;
                query = { store_id: { $in: store_access_ids?.map(id => id) } };
            }

            else if (role === 'Warehouse Admin' || role === 'Warehouse Manager VA') {
                query = { warehouse_id: user.warehouse_id }
            }

            const all_stock = await all_stock_collection.countDocuments(query, projection)
            const pending_arrival = await pending_arrival_collection.countDocuments(query, projection)
            const preparing_form_data = await preparing_form_data_collection.countDocuments(query, projection)
            const ready_to_ship_data = await ready_to_ship_collection.countDocuments(query, projection)
            const shipped_data = await shipped_data_collection.countDocuments(query, projection)
            const out_of_stock = await out_of_stock_collection.countDocuments(query, projection)
            const missing_arrival = await missing_arrival_collection.countDocuments(query, projection)
            const asin_upc = await asin_upc_collection.countDocuments({ admin_id: user.admin_id }, projection)

            const counts = { all_stock, pending_arrival, preparing_form_data, ready_to_ship_data, shipped_data, out_of_stock, missing_arrival, asin_upc };

            res.status(200).json({ data: counts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.get('/download/:fileName', (req, res) => {
        const fileName = req.params.fileName;
        const uploadsDirectory = path.join(__dirname, '..', '..', 'public', 'uploads');
        const filePath = path.join(uploadsDirectory, fileName);
        res.download(filePath, fileName, (err) => {
            if (err) {
                res.status(404).json({ message: 'File not found' });
            }
        });
    });

}
run()

module.exports = router;