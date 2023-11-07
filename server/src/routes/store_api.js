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
                store_status: req.body.store_status,
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

    // update store details 
    router.post("/update_store_details", async (req, res) => {
        try {
            const admin_id = req.query.id
            const existData = await all_stores_collection.findOne({ admin_id: admin_id })
            if (existData) {
                const updateData = {
                    store_name: req.body.storeName ? req.body.storeName : existData.store_name,
                    store_manager_name: req.body.storeManagername ? req.body.storeManagername : existData.store_manager_name,
                    store_type: req.body.storeType !== "Pick Store Type" ? req.body.storeType : existData.store_type,
                    store_status: req.body.storeStatus !== "Select Status" ? req.body.storeStatus : existData.store_status,
                }
                const updateResult = await all_stores_collection.updateOne({ admin_id: admin_id }, { $set: updateData })
               
                if (updateResult.modifiedCount) {
                    return res.status(200).json({ message: "Store data updated" })
                }
                else {
                    res.status(204).json({ message: "No data found" })
                }
            }
            else {
                res.status(204).json({ message: "No data found" })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    })
    
    // get all stores
    router.get('/get_all_stores', async (req, res) => {
        try {
            const id = req.query.id
            const storeType = req.query.storeType
            const storeStatus = req.query.storeStatus

            if (storeType && storeType !== 'All Store') {
                const allStores = await all_stores_collection.find({ admin_id: id, store_type: storeType, store_status: storeStatus }).sort({ date: -1 }).toArray()

                if (allStores.length) {
                    return res.status(200).json({ data: allStores, message: "Successfully get all stores" })
                }
                else {
                    return res.status(204).json({ message: "No content" })
                }
            }

            const allStores = await all_stores_collection.find({ admin_id: id, store_status: storeStatus }).sort({ date: -1 }).toArray()

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

    // get all stores for profit tracker page
    router.get('/profit_tracker_all_stores', async (req, res) => {
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

                const store_access_ids = user.store_access_ids;
                query = { _id: { $in: store_access_ids?.map(id => new ObjectId(id)) } };
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