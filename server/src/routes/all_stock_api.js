const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')

const run = async () => {
    const db = await connectDatabase()
    const all_stock_collection = db.collection("all_stock")

    //get all stock data
    router.get('/get_all_stock_data', async (req, res) => {
        try {
            // const creator_email = req.query.email;
            const admin_id = req.query.admin_id;
            const result = await all_stock_collection.find({ admin_id: admin_id }).toArray()
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
    router.get('/all_stock_by_upin', async (req, res) => {
        const upin = req.query.upin
        
        try {
            // const creator_email = req.query.email;

            const result = await all_stock_collection.findOne({ upin: upin })
          
            if (result) {
                res.status(200).json({ data: result, message: "Successfully got all stock data" })
            }
            else {
                res.status(404).json({ message: "No data found" ,status:false})
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}
run()

module.exports = router;