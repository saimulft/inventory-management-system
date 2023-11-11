const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')

const run = async () => {
    const db = await connectDatabase()
    const warehouses_collection = db.collection("warehouses")

    router.get('/get_warehouse_dropdown_data', async (req, res) => {
        try {
            const admin_id = req.query.id;
            const allWarehouseData = await warehouses_collection.find({ admin_id: admin_id }).sort({ date: -1 }).toArray()
            if (allWarehouseData) {
                const data = allWarehouseData.map(item => {
                    return { data: allWarehouseData, value: item._id, label: item.warehouse_name }
                })
                res.status(200).json({ data: data, message: "successfully warehouse data" })
            }
            else {
                res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error in warehouse data' });
        }
    });
}
run()
module.exports = router;