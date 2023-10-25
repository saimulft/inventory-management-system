const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')

const run = async () => {
    const db = await connectDatabase()
    const stores_collection = db.collection("stores")
    const asin_upc_collection = db.collection("asin_upc")
    const warehouses_collection = db.collection("warehouses")


    //   get stores by admin id
    router.get('/get_store_data', async (req, res) => {

        const admin_id = req.query.admin_id
        try {
            const result = await stores_collection.findOne({ admin_id: admin_id }).toArray()
            if (result) {
                res.status(200).json({ message: "Successfully get stores data" })
            }
            else {
                res.status(500).json({ message: "Error to geting stores data" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    //   get asin or upc by admin id
    router.get('/get_asin_upc', async (req, res) => {

        const admin_id = req.query.admin_id
        try {
            const result = await asin_upc_collection.findOne({ admin_id: admin_id }).toArray()
            if (result) {
                res.status(200).json({ message: "Successfully get asin_upc" })
            }
            else {
                res.status(500).json({ message: "Error to geting  a asin_upc" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    //   get asin or upc by admin id
    router.get('/get_warehouse_data', async (req, res) => {

        const admin_id = req.query.admin_id
        try {
            const result = await warehouses_collection.findOne({ admin_id: admin_id }).toArray()
            if (result) {
                res.status(200).json({ message: "Successfully get warehouse data" })
            }
            else {
                res.status(500).json({ message: "Error to geting warehouse data" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}
run()

module.exports = router;