const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const path = require("path")
const run = async () => {
    const db = await connectDatabase()

    const collections = [
        'all_stock',
        'pending_arrival',
        'preparing_form_data',
        'ready_to_ship_data',
        'shipped_data',
        'out_of_stock',
        'missing_arrival',
        'asin_upc',
    ];

    // Define a route to get document counts for all collections
    router.get('/collections-docs-counts', async (req, res) => {
        try {
            const role = req.query.role;
            const admin_id = req.query.admin_id;
            const creator_email = req.query.creator_email;

            let query;

            if (role === 'Admin' || role === 'Admin VA') {
                query = { admin_id: admin_id }
            }
            else {
                query = { creator_email: creator_email }
            }

            const counts = {};

            for (const collectionName of collections) {
                const collection = db.collection(collectionName);
                const count = await collection.countDocuments(query);
                counts[collectionName] = count;
            }

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