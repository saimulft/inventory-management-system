const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")
const verifyJWT = require("../middlewares/verifyJWT")

const run = async () => {
    const db = await connectDatabase()
    const all_stock_collection = db?.collection("all_stock")

    router.put('/update_stock_product', async (req, res) => {

        const updateData = {
            amazon_quantity: req.body.amazon_quantity,
            customer_name: req.body.customer_name,
            amazon_shipping: req.body.amazon_shipping,
            shipping_cost: req.body.shipping_cost,
            handling_cost: req.body.handling_cost,
            walmart_quantity: req.body.walmart_quantity,
            amazon_price: req.body.amazon_price,
            average_price: req.body.average_price,
            average_tax: req.body.average_tax,
            order_number: req.body.order_number,
        }
        try {
            const upin = req.body.upin
            const updateProduct = await all_stock_collection.updateOne({ admin_id: req.body.admin_id, upin: upin }, {
                $set: updateData
            })

            if (updateProduct.modifiedCount) {
                res.status(200).json({ message: "Data updated" })
            }
            else {
                res.status(204).json({ message: "Data up to date" })
            }
        } catch (error) {
            res.status(500).json({ message: "internal server error" })
        }
    })
}
run()

module.exports = router;