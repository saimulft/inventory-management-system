const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const multer = require("multer")
const path = require('path')

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

    // asin_upc_image_upload api 
    router.post('/asin_upc_image_upload', upload.single('image'), async (req, res) => {

        try {
            const product_image = req.file.filename
            console.log(product_image)

            if (product_image) {
                res.status(201).json({ message: "image uploaded successful", imageURL: product_image })
            } else {
                res.status(500).json({ message: "Multer error" })
            }

        } catch (error) {
            res.status(500).json({ message: "Multer error" })
        }
    })


    // insert a new asin or upc
    router.post('/insert_asin_upc', async (req, res) => {
        const data = {
            admin_id: req.body.adminId,
            date: req.body.date,
            creator_email: req.body.creatorEmail,
            asin_upc_code: req.body.asinUpc,
            store_manager_name: req.body.storeManagerName,
            product_name: req.body.productName,
            product_image: req.body.productImage,
            min_price: req.body.minPrice,
            code_type: req.body.codeType
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


    //   get asin or upc by id
    router.get('/get_asin_upc_by_email', async (req, res) => {
        const creator_email = req.query.email
        try {
            const asinUpcData = await asin_upc_collection.find({ creator_email: creator_email }).toArray()
            if (asinUpcData.length) {

                const data = asinUpcData.map(item => {
                    return { key: item.asin_upc_code, value: item.asin_upc_code, text: item.asin_upc_code }
                })
                res.status(200).json({ data: data, message: "successfully get asin_upc" })
            }
            else {
                res.status(500).json({ message: "Error to geting  asin_upc" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error in asin_upc' });
        }
    })

}
run()

module.exports = router;