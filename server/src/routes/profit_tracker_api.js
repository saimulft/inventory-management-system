const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")
const verifyJWT = require("../middlewares/verifyJWT")

const run = async () => {
    const db = await connectDatabase()
    const all_stock_collection = db.collection("all_stock")
    const all_stores_collection = db.collection("all_stores")

    // get specific store data for profit tracker
    router.get('/single_store_data',verifyJWT, async (req, res) => {
        try {
            const storeId = req.query.storeId

            const store = await all_stores_collection.findOne({ _id: new ObjectId(storeId) })

            const storeResult = await all_stock_collection.find({ store_id: storeId }).toArray()

            if (store) {
                if (storeResult.length) {

                    return res.status(200).json({ data: storeResult, store_name: store.store_name, message: "Data successfully get" })
                }
                else {
                    return res.status(200).json({ store_name: store.store_name, message: "Data got successfully" })
                }
            }
            else {
                res.status(204).json({ message: "No data found" })
            }
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    })

    // get all store data for dashboard
    router.get('/all_store_data',verifyJWT, async (req, res) => {
        try {
            const adminId = req.query.adminId;

            const stockData = await all_stock_collection.find({ admin_id: adminId }).toArray()
            const totalStore = await all_stores_collection.countDocuments({admin_id: adminId})

            if (stockData.length) {
                return res.status(200).json({ data: stockData, total_store: totalStore, message: "Data got successfully" })
            }
            else {
                res.status(204).json({ message: "No data found" })
            }
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    })

    // get store graph data for dashboard and profit tracker
    router.get('/single_store_graph_data',verifyJWT, async (req, res) => {
        try {
            const storeId = req.query.storeId
            const adminId = req.query.adminId
            const view = req.query.view
            const day = parseInt(req.query.day)
            let startDate = new Date();
            startDate.setDate(startDate.getDate() - day);
            const dataArray = [];
            const numberOfChunks = 7;

            const queryAndPushData = async () => {

                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + day);
                let query;
                if (view === "dashboard") {
                    query = { date: { $gte: startDate.toISOString(), $lt: endDate.toISOString() }, admin_id: adminId }
                }
                else {
                    query = { date: { $gte: startDate.toISOString(), $lt: endDate.toISOString() }, store_id: storeId }
                }
                const data = await all_stock_collection.find(query).toArray();
                dataArray.push(data);
                startDate.setDate(startDate.getDate() - day);
            };

            const fetchDataInChunks = async () => {
                for (let i = 0; i < numberOfChunks; i++) {
                    await queryAndPushData();
                }
                const calculateSum = (array, type) => {
                    const result = array.reduce((sum, d) => {
                        const amazonFee = (parseFloat(d.amazon_price) + parseFloat(d.amazon_shipping)) * 0.15
                        const supplierPrice = parseFloat(d.walmart_quantity) * parseFloat(d.average_price)
                        const tax = parseFloat(d.walmart_quantity) * parseFloat(d.average_tax)
                        const cashProfit = (parseFloat(d.amazon_price) + parseFloat(d.amazon_shipping)) - (supplierPrice + amazonFee + parseFloat(d.shipping_cost) + tax + parseFloat(d.handling_cost))
                        const costOfGoods = supplierPrice + parseFloat(d.shipping_cost) + tax + parseFloat(d.handling_cost)
                        const roi = (cashProfit / costOfGoods) * 100;
                        const sales = parseInt(d.walmart_quantity) * parseFloat(d.amazon_price)
                        if (type === "netProfit") {
                            return sum + cashProfit
                        }
                        if (type === "totalExpenses") {
                            return sum + costOfGoods
                        }
                        if (type === "roi") {
                            return sum + roi
                        }
                        if (type === "sales") {
                            return sum + sales
                        }
                    }, 0);
                    return result.toFixed(2)
                };

                let name;
                const calculateSumForEachArray = (arrayOfArrays) => {
                    return arrayOfArrays.map((childArray, index) => {
                        if (day === 1) {
                            name = `Day ${index + 1}`
                        }
                        if (day === 7) {
                            name = `Week ${index + 1}`
                        }
                        if (day === 15) {
                            name = `Past ${(index + 1) * 15}`
                        }
                        if (day === 30) {
                            name = `Month ${index + 1}`
                        }
                        if (day === 365) {
                            name = `Year ${index + 1}`
                        }
                        return (
                            {
                                "name": name,
                                "Net Profit": calculateSum(childArray, "netProfit"),
                                "Total Expenses": calculateSum(childArray, "totalExpenses"),
                                "Total Sales": calculateSum(childArray, "sales"),
                                "ROI": calculateSum(childArray, "roi")
                            }
                        )

                    });
                };
                const result = calculateSumForEachArray(dataArray);

                return res.status(200).json({ data: result })
            };
            fetchDataInChunks();
        }

        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

}
run()

module.exports = router;