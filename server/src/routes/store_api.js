const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')

const run = async () => {
    const db = await connectDatabase()
    const all_stores_collection = db.collection("all_stores")

    // add new store
    router.post('/add_new_store', async (req, res) => {
        try {
            const data = {
                admin_id: req.body.admin_id,
                date: req.body.date,
                creator_email: req.body.creator_email,
                store_name: req.body.store_name,
                store_manager_name: req.body.store_manager_name,
                store_type: req.body.store_type,
                supplier_information: req.body.supplier_information,
                additional_payment_details: req.body.additional_payment_details
            }

            const result = await all_stores_collection.insertOne(data)

            if (result.acknowledged) {
                res.status(201).json({ message: "Successfully inserted new store data" })
            }
            else {
                res.status(500).json({ message: "Internal server error while inserting store data" })
            }

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}
run()

module.exports = router;