const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')

const run = async () => {
    const db = await connectDatabase()
    const pending_arrival_collection = db.collection("pending_arrival")

    // insert pending arrival data
    router.post('/insert_pending_arrival_form_data', async (req, res) => {
        const data = {
            admin_id: req.body.admin_id,
            date: req.body.date,
            store_name: req.body.store_name,
            asin_upc_code: req.body.asin_upc_code,
            code_type: req.body.code_type,
            supplier_id: req.body.supplier_id,
            product_name: req.body.product_name,
            upin: req.body.upin,
            quantity: req.body.quantity,
            unit_price: req.body.unit_price,
            eda: req.body.eda,
            warehouse_name: req.body.warehouse_name
        }
        try {

            const result = await pending_arrival_collection.insertOne(data)

            if (result.acknowledged) {
                res.status(201).json({ message: "Successfully inserted pending arrival data" })
            }
            else {
                res.status(500).json({ message: "Internal server error while inserting pending arrival data"})
            }

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}
run()

module.exports = router;