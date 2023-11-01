const express = require("express")
const router = express.Router()
const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://ims:5uNYAIiVgikBL3Zu@practice.6vpv5du.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri);

const run = async () => {
    client.connect()
    const asin_upc_collection = client.db("inventory_management_system").collection("demo_asin_upc")


    for (let index = 0; index < 1000; index++) {
        const data = {
            admin_id: 'bfde5fa9-fed8-477c-8816-51ff90226fe0',
            date: '2023-10-30T09:13:58.645Z',
            creator_email: 'torikul.meraj@gmail.com',
            asin_upc_code: 'SSHP',
            store_manager_name: 'TIMU',
            product_name: 'Mobile',
            product_image: 'file-1698657238669-451850880.png',
            min_price: '400',
            code_type: 'UPC'
        }
        const result = await asin_upc_collection.insertOne(data)
        console.log(result)
    }
}
run()

module.exports = router;