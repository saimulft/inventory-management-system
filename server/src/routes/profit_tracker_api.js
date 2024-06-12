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
    const profit_tracker_collection = db.collection("profit_tracker")

    cron.schedule('0 0 * * *', async () => {

        try {
            const stores = await all_stores_collection.find().toArray()
            const amazonStore = stores.filter(store => store.refresh_token)

            amazonStore.forEach(async (store) => {
                axios.post(`https://api.amazon.com/auth/o2/token?grant_type=refresh_token&refresh_token=${store.refresh_token}&client_id=${process.env.AMAZON_CLIENT_ID}&client_secret=${process.env.AMAZON_CLIENT_SECRET}`)
                    .then((response) => {
                        const accessToken = response.data.access_token
                        let isoDate;

                        if (store.sync_date) {
                            const last30Days = new Date();
                            last30Days.setDate(last30Days.getDate() - 30);
                            isoDate = last30Days.toISOString()
                        }
                        else {
                            const today = new Date();
                            today.setDate(today.getDate() - 2);
                            today.setHours(0, 0, 0, 0);
                            isoDate = today.toISOString()
                        }
                        axios.get(`https://sellingpartnerapi-na.amazon.com/orders/v0/orders?MarketplaceIds=${store.marketplace_id}&CreatedAfter=${isoDate}`, {

                            headers: {
                                'x-amz-access-token': accessToken
                            }
                        })
                            .then(async (res) => {
                                const shippedData = res.data.payload.Orders.filter(order => order.OrderStatus === 'Shipped');
                                const allOrderIds = shippedData.map(order => order.AmazonOrderId);

                                const delay = (ms = 2000) => new Promise(r => setTimeout(r, ms));
                                const urlArray = allOrderIds.map(orderId => `https://sellingpartnerapi-na.amazon.com/orders/v0/orders/${orderId}/orderItems`);

                                const getDataSeries = async (items) => {
                                    const failedItems = [];

                                    for (let index = 0; index < items.length; index++) {
                                        await delay();
                                        try {
                                            const response = await axios.get(items[index], {
                                                headers: {
                                                    'x-amz-access-token': accessToken
                                                }
                                            });
                                            const orderItems = response.data.payload.OrderItems;
                                            const orders = orderItems.map(item => ({
                                                admin_id: store.admin_id,
                                                upin: `${store.store_name}_${item.ASIN}`,
                                                store_id: store._id?.toString(),
                                                quantity: parseInt(item?.QuantityShipped),
                                                source_quantity: null,
                                                customer_name: 'N/A',
                                                shipping_cost: null,
                                                handling_cost: null,
                                                selling_price: parseInt(item?.ItemPrice?.Amount),
                                                tax: parseFloat(item?.ItemTax?.Amount),
                                                order_number: null,
                                                purchase_date: shippedData[index]?.PurchaseDate,
                                                order_item_id: item?.OrderItemId,
                                            }));
                                            // upsert orders to amazon_stock_collection
                                            for (const order of orders) {
                                                await profit_tracker_collection.updateOne(
                                                    { order_item_id: order.order_item_id }, // Filter
                                                    { $set: order }, // Update
                                                    { upsert: true } // If no document matches, insert the document
                                                );
                                            }
                                            console.log('saved ' + index);
                                        } catch (error) {
                                            failedItems.push(items[index]);
                                            console.error('Error at index ' + index + ': ' + error);
                                        }
                                    }

                                    return failedItems;
                                };

                                const retryFailedItems = async (failedItems) => {
                                    if (failedItems.length > 0) {
                                        console.log('Retrying failed orders...');
                                        const retryFailed = await getDataSeries(failedItems);

                                        if (retryFailed.length > 0) {
                                            console.error('Failed to retrieve and save some orders after retrying:', retryFailed);
                                        } else {
                                            await all_stores_collection.updateOne({ _id: new ObjectId(store._id) }, { $set: { sync_date: false } })
                                        }
                                    }
                                    else {
                                        await all_stores_collection.updateOne({ _id: new ObjectId(store._id) }, { $set: { sync_date: false } })
                                        console.log('All orders successfully processed.');
                                    }
                                };

                                const failedItems = await getDataSeries(urlArray);
                                await retryFailedItems(failedItems);
                            })
                            .catch((error) => {
                                console.log('Initial request error: ' + error);
                            });

                    })
                    .catch((error) => {
                        console.error('error 2 ' + error)
                    })
            })
        } catch (error) {
            console.log('error 4 ' + error)
        }
    });

    router.get('/live_sync', verifyJWT, async (req, apiRes) => {
        try {
            const store = await all_stores_collection.findOne({ _id: new ObjectId(req.query.storeId) })
            axios.post(`https://api.amazon.com/auth/o2/token?grant_type=refresh_token&refresh_token=${store.refresh_token}&client_id=${process.env.AMAZON_CLIENT_ID}&client_secret=${process.env.AMAZON_CLIENT_SECRET}`)
                .then((response) => {
                    const accessToken = response.data.access_token
                    // today date from 12:00:00 AM
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isoDate = today.toISOString()
                    axios.get(`https://sellingpartnerapi-na.amazon.com/orders/v0/orders?MarketplaceIds=${store.marketplace_id}&CreatedAfter=${isoDate}`, {

                        headers: {
                            'x-amz-access-token': accessToken
                        }
                    })
                        .then(async (res) => {
                            const shippedData = res.data.payload.Orders.filter(order => order.OrderStatus === 'Shipped');
                            const allOrderIds = shippedData.map(order => order.AmazonOrderId);
                            const delay = (ms = 2000) => new Promise(r => setTimeout(r, ms));
                            const urlArray = allOrderIds.map(orderId => `https://sellingpartnerapi-na.amazon.com/orders/v0/orders/${orderId}/orderItems`);

                            const getDataSeries = async (items) => {
                                const failedItems = [];

                                for (let index = 0; index < items.length; index++) {
                                    await delay();
                                    try {
                                        const response = await axios.get(items[index], {
                                            headers: {
                                                'x-amz-access-token': accessToken
                                            }
                                        });
                                        const orderItems = response.data.payload.OrderItems;
                                        const orders = orderItems.map(item => ({
                                            admin_id: store.admin_id,
                                            upin: `${store.store_name}_${item.ASIN}`,
                                            store_id: store._id?.toString(),
                                            quantity: parseInt(item?.QuantityShipped),
                                            source_quantity: null,
                                            customer_name: 'N/A',
                                            shipping_cost: null,
                                            handling_cost: null,
                                            selling_price: parseInt(item?.ItemPrice?.Amount),
                                            average_tax: null,
                                            order_number: null,
                                            purchase_date: shippedData[index]?.PurchaseDate,
                                            order_item_id: item?.OrderItemId,
                                        }));
                                        // upsert orders to amazon_stock_collection
                                        for (const order of orders) {
                                            await profit_tracker_collection.updateOne(
                                                { order_item_id: order.order_item_id }, // Filter
                                                { $set: order }, // Update
                                                { upsert: true } // If no document matches, insert the document
                                            );
                                        }
                                        console.log('saved ' + index);
                                    } catch (error) {
                                        failedItems.push(items[index]);
                                        console.error('Error at index ' + index + ': ' + error);
                                    }
                                }

                                return failedItems;
                            };

                            const retryFailedItems = async (failedItems) => {
                                if (failedItems.length > 0) {
                                    console.log('Retrying failed orders...');
                                    const retryFailed = await getDataSeries(failedItems);

                                    if (retryFailed.length > 0) {
                                        apiRes.status(500).json({ message: "Internal server error" })
                                    } else {
                                        return apiRes.status(200).json({ message: "Data synced successfully" })
                                    }
                                }
                                else {
                                    return apiRes.status(200).json({ message: "Data synced successfully" })
                                }
                            };

                            const failedItems = await getDataSeries(urlArray);
                            await retryFailedItems(failedItems);

                        })
                        .catch((error) => {
                            apiRes.status(500).json({ message: "Internal server error" })
                            console.log('Initial request error: ' + error);
                        });

                })
                .catch((error) => {
                    console.error('error 2 ' + error)
                })
        } catch (error) {
            apiRes.status(500).json({ message: "Internal server error" })
        }
    })
    // get specific store data for profit tracker
    router.get('/single_store_data', verifyJWT, async (req, res) => {
        try {
            const storeId = req.query.storeId
            const store = await all_stores_collection.findOne({ _id: new ObjectId(storeId) })
            const storeResult = await all_stock_collection.find({ store_id: storeId }).toArray()
            const profitTrackerData = await profit_tracker_collection.find({ store_id: storeId }).sort({ purchase_date: -1 }).toArray()
            if (store) {

                if (storeResult.length) {
                    return res.status(200).json({ allStockData: storeResult, profitTrackerData, store_name: store.store_name, total_order: store.total_order, amazon_orders: [] })
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