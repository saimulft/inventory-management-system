const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require("mongodb")
const verifyJWT = require("../middlewares/verifyJWT")
const axios = require('axios')
const cron = require('node-cron');

const run = async () => {
    const db = await connectDatabase()
    const all_stock_collection = db.collection("all_stock")
    const all_stores_collection = db.collection("all_stores")
    const amazon_stock_collection = db.collection("amazon_stock")

    cron.schedule('*/20 * * * * *', async () => {

        const stores = await all_stores_collection.find().toArray()
        const amazonStore = stores.filter(store => store.refresh_token)

        amazonStore.forEach(async (store) => {

            axios.post(`https://api.amazon.com/auth/o2/token?grant_type=refresh_token&refresh_token=${store.refresh_token}&client_id=${process.env.AMAZON_CLIENT_ID}&client_secret=${process.env.AMAZON_CLIENT_SECRET}`)
                .then((response) => {
                    const accessToken = response.data.access_token
                 const last30Days = new Date();
                 last30Days.setDate(last30Days.getDate() - 30);
                 const isoDate = last30Days.toISOString()
                    axios.get(`https://sellingpartnerapi-na.amazon.com/orders/v0/orders?MarketplaceIds=${store.marketplace_id}&CreatedAfter=${isoDate}`, {

                        headers: {
                            'x-amz-access-token': accessToken
                        }
                    })
                        .then(async (res) => {
                            const allOrderIds = res.data.payload.Orders.map(order => order.AmazonOrderId);
                            allOrderIds.forEach(async (orderId) => {
                                setTimeout(async () => {
                                    try {
                                        const order = await axios.get(`https://sellingpartnerapi-na.amazon.com/orders/v0/orders/${orderId}/orderItems`, {
                                            headers: {
                                                'x-amz-access-token': accessToken
                                            }
                                        })
                                        const orderItems = order.data.payload.OrderItems;
                                        const flattenedOrderItems = orderItems.map((orderItem) => {
                                            return {

                                                amazon_asin: orderItem.ASIN,
                                                amazon_title: orderItem.Title,

                                            };
                                        });

                                        await amazon_stock_collection.insertMany(flattenedOrderItems);
                                        console.log('Order items have been saved to the database successfully');
                                    } catch (error) {
                                        console.log('Error fetching order items or saving to the database', error);
                                    }
                                }, 2000)
                            })
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
                .catch((error) => {
                    console.error(error)
                })
        })
    });

    // get specific store data for profit tracker
    router.get('/single_store_data', verifyJWT, async (req, res) => {
        try {
            const storeId = req.query.storeId
            const store = await all_stores_collection.findOne({ _id: new ObjectId(storeId) })
            const storeResult = await all_stock_collection.find({ store_id: storeId }).toArray()
            if (store) {

                if (storeResult.length) {
                    return res.status(200).json({ data: storeResult, store_name: store.store_name, total_order: store.total_order, amazon_orders: [] })
                }
                else {
                    return res.status(200).json({ store_name: store.store_name, amazon_orders: [], message: "Data got successfully" })
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
    router.get('/all_store_data', verifyJWT, async (req, res) => {
        try {
            const adminId = req.query.adminId;

            const stockData = await all_stock_collection.find({ admin_id: adminId }).toArray()
            const totalStore = await all_stores_collection.find({ admin_id: adminId }).toArray()
            const totalOrder = totalStore.reduce((sum, store) => sum + parseFloat(store?.total_order), 0);

            if (stockData.length) {
                return res.status(200).json({ data: stockData, total_store: totalStore?.length, total_order: totalOrder, message: "Data got successfully" })
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
    router.get('/single_store_graph_data', verifyJWT, async (req, res) => {
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
                        const roi = (cashProfit / costOfGoods) * 100 || 0;
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