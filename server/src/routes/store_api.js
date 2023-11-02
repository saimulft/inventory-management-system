const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")

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

    // get all stores
    router.get('/get_all_stores', async (req, res) => {

        try {
            const id = req.query.id
            const storeType = req.query.storeType

            if (storeType && storeType !== 'All Store') {
                const allStores = await all_stores_collection.find({ admin_id: id, store_type: storeType }).sort({ date: -1 }).toArray()

                if (allStores.length) {
                    return res.status(200).json({ data: allStores, message: "Successfully get all stores" })
                }
                else {
                    return res.status(204).json({ message: "No content" })
                }
            }

            const allStores = await all_stores_collection.find({ admin_id: id }).sort({ date: -1 }).toArray()

            if (allStores.length) {
                res.status(200).json({ data: allStores, message: "Successfully get all stores" })
            }
            else {
                res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error in all_asin_upc' });
        }
    });

    // get store by id
    router.get('/get_store_by_id', async (req, res) => {
        try {
            const id = req.query.id;
            const storeData = await all_stores_collection.findOne({ _id: new ObjectId(id) })

            if (storeData) {
                res.status(200).json({ data: storeData, message: "Successfully get store" })
            }
            else {
                res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error in store api' });
        }
    });

    router.post('/get_stores_dropdown_data', async (req, res) => {
        try {
            const user = req.body.user;
            const role = user.role;

            let query;

            if (role === 'Admin' || role === 'Admin VA') {
                query = { admin_id: user.admin_id }
            }

            else if (role === 'Store Manager Admin' || role === 'Store Manager VA') {
                query = {_id: new ObjectId(user.store_id) }
            }

            const allStores = await all_stores_collection.find(query).sort({ date: -1 }).toArray()
            if (allStores) {
                const data = allStores.map(item => {
                    return { data: allStores, value: item._id, label: item.store_name }
                })
                res.status(200).json({ data: data, message: "successfully stores data" })
            }
            else {
                res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error in stores data' });
        }
    });
}
run()

module.exports = router;