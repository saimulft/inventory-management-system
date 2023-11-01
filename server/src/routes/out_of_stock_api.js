const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")

const run = async () => {

    const db = await connectDatabase()
    const out_of_stock_collection = db.collection("out_of_stock")
    const preparing_form_collection = db.collection("preparing_form_data")

    // insert out of stock data
    router.post("/out_of_stock", async (req, res) => {

        try {
            const id = req.query.id;

            const existData = await preparing_form_collection.findOne({ _id: new ObjectId(id) })

            if (existData) {
                const result = await out_of_stock_collection.insertOne({ ...existData, status: "Pending" })
                if (result.acknowledged) {
                    const deleteResult = await preparing_form_collection.deleteOne({ "_id": new ObjectId(id) })
                    if (deleteResult.deletedCount) {
                        res.status(201).json({ message: "OOS data inserted" })
                    }
                }
            }
            else {
                return res.status(500).json({ message: "Data not found" });
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "OOS  error" });
        }
    })

    //get out of stock data
    router.get('/get_all_OOS_data', async (req, res) => {
        try {
            const admin_id = req.query.admin_id;
            const data = await out_of_stock_collection.find({ admin_id: admin_id }).sort({date: -1}).toArray()

            if (data) {
                res.status(200).json({ data: data })

            }
            else {
                res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            res.status(500).json({ message: "get_all_OOS_data_ error" })
        }
    })

    //delete an out of stock data
    router.delete('/delete_OOS_data', async (req, res) => {
        try {
            const id = req.query.id;

            const result = await out_of_stock_collection.deleteOne({ _id: new ObjectId(id) });
            console.log(result)

            if (result.deletedCount) {
                res.status(200).json({ message: "Successfully deleted an out of stock data" })
            }
            else {
                res.status(500).json({ message: "Error to delete out of stock data" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // update an out of stock data
    router.put('/update_OOS_data', async (req, res) => {
        try {
            const id = req.query.id;
            const from = req.query.from
            const updatedData = {
                product_name: req.body.product_name,
                quantity: req.body.quantity,
                upin: req.body.upin,
                notes: req.body.notes,
            }

            if (req.body.status && from === "inventory") {
                const result = await out_of_stock_collection.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: updatedData },
                    { returnDocument: "after" }
                );

                if (result) {
                    const deletedResult = await out_of_stock_collection.deleteOne({ _id: new ObjectId(id) });
                    if (!deletedResult.deletedCount) {
                        res.status(500).json({ message: "Error to delete out of stock data" })
                    }

                    const preparingData = {
                        ...result,
                    }
                    const preparingResult = await preparing_form_collection.insertOne(preparingData)
                    console.log(preparingResult)

                    if (preparingResult.insertedId) {
                        return res.status(201).json({ status: 'success', message: 'Data update and insert operations successful' });
                    }
                    else {
                        return res.status(500).json({ message: 'Error to insert prepering data' });
                    }
                }
                else {
                    return res.status(203).json({ status: 'failed', message: 'Data not modified' })
                }
            }

            else if (req.body.status && from === "store") {
                const updatedDataStore = {
                    product_name: req.body.product_name,
                    quantity: req.body.quantity,
                    upin: req.body.upin,
                    notes: req.body.notes,
                    status: "Solved"
                }
                const result = await out_of_stock_collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedDataStore },
                    { upsert: true }
                );

                if (result.modifiedCount) {
                    return res.status(201).json({ status: 'success', message: 'Data update successful' });
                }
                else {
                    return res.status(203).json({ message: 'Error to modify out of stock data' });
                }
            }

            else {
                const updatedData = {
                    product_name: req.body.product_name,
                    quantity: req.body.quantity,
                    upin: req.body.upin,
                    notes: req.body.notes,

                }
                const result = await out_of_stock_collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );


                if (result.modifiedCount) {
                    return res.status(201).json({ status: 'success', message: 'Data update successful' });
                }
                else {
                    return res.status(203).json({ message: 'Error to modify out of stock data' });
                }
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
}
run()

module.exports = router;