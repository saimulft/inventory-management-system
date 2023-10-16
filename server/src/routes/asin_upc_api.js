const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const multer = require("multer")

const run = async () => {

    const db = await connectDatabase()
    const asin_upc_collection = db.collection("asin_upc")

    // upload asin upc image 
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/product_images'); // Destination folder for uploaded files
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix);
        },
    });
    const upload = multer({ storage, limits: { fileSize: 5000000 } });



    // insert a new asin or upc
    router.post('/insert_asin_upc', async (req, res) => {
        const data = {
            date: req.body.date,
            asin_upc_code: req.body.asin_upc_code,
            store_manager_name: req.body.store_manager_name,
            product_name: req.body.product_name,
            product_image: req.body.product_image,
            min_price: req.body.min_price,
            code_type: req.body.code_type
        }
        try {

            const result = await asin_upc_collection.insertOne(data)

            if (result.acknowledged) {
                res.status(201).json({ message: "asin_upc inserted" })
            }
            else {
                res.status(500).json({ message: "Error to inserting asin" })
            }

        } catch (error) {
            res.status(500).json({ message: 'SInternal Server Error' });
        }


    })

    // get all asin or upc
    router.get('/get_asin_upc', async (req, res) => {

        try {
            const result = await asin_upc_collection.find({}).toArray()
            if (result.length) {
                res.status(200).json({ message: "successfully get all asin_upc" })
            }
            else {
                res.status(500).json({ message: "Error to geting asin_upc" })
            }
        } catch (error) {
            res.status(500).json({ message: 'SInternal Server Error' });
        }
    })


    //   get asin or upc by id
    router.get('/get_asin_upc', async (req, res) => {

        const asin_upc_id = req.query.asin_upc_id
        try {
            const result = await asin_upc_collection.findOne({ asin_upc_id: asin_upc_id }).toArray()
            if (result) {
                res.status(200).json({ message: "successfully get a asin_upc" })
            }
            else {
                res.status(500).json({ message: "Error to geting  a asin_upc" })
            }
        } catch (error) {
            res.status(500).json({ message: 'SInternal Server Error' });
        }
    })

}
run()

module.exports = router;