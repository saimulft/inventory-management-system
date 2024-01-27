const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const multer = require("multer")
const path = require('path')
const { ObjectId } = require("mongodb")
const fs = require('fs')
const run = async () => {

    const db = await connectDatabase()
    const asin_upc_collection = db?.collection("asin_upc")
    const all_stock_collection = db?.collection("all_stock")

    // upload asin upc image 
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/uploads'); // Destination folder for uploaded files
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix);
        },
    });
    const upload = multer({ storage, limits: { fileSize: 5000000 } });

    // asin_upc_image_upload api 
    router.post('/asin_upc_image_upload', upload.single('file'), async (req, res) => {

        try {
            const product_image = req.file.filename
            if (product_image) {
                res.status(201).json({ message: "image uploaded successful", imageURL: product_image })
            } else {
                res.status(500).json({ message: "Multer error" })
            }

        } catch (error) {
            res.status(500).json({ message: "Multer error" })
        }
    })

    router.put('/update_asin_upc', upload.single('file'), async (req, res) => {
        const id = req.query.id
        const exitsData = await asin_upc_collection.findOne({ _id: new ObjectId(id) })
        const updateData = {
            product_image: req.body.productImage ? req.body.productImage : exitsData.product_image,
            min_price: req.body.minPrice ? req.body.minPrice : exitsData.min_price
        }
        try {
            const result = await asin_upc_collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

            if (result.modifiedCount) {
                res.status(200).json({ message: "asin upc updated" })
            } else {
                res.status(500).json({ message: "asin upc error" })
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "asin upc error" })
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
                res.status(201).json({ message: "asin_upc inserted", result })
            }
            else {
                res.status(500).json({ message: "Error to inserting asin" })
            }

        } catch (error) {
            res.status(500).json({ message: 'SInternal Server Error' });
        }


    })

    // get all asin or upc by email for dropdown
    router.post('/get_asin_upc_dropdown_data', async (req, res) => {
        try {
            const user = req.body.user;
            const asinUpcData = await asin_upc_collection.find({ admin_id: user.admin_id }).project({ "value": { $toString: "$_id" }, "label": "$asin_upc_code", product_name: "$product_name", "code_type": "$code_type", _id: 0 }).sort({ date: -1 }).toArray()
            if (asinUpcData) {
                res.status(200).json({ data: asinUpcData, message: "successfully get asin_upc" })
            }
            else {
                res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error in asin_upc' });
        }
    });

    // get store based asin upc for dropdown
    router.post('/get_store_based_asin_upc_data', async (req, res) => {
        try {
            const { store_id } = req.body;

            if (store_id) {
                const asinUpcData = await all_stock_collection.find({ store_id: store_id }).project({ label: "$asin_upc_code", value: "$asin_upc_code", code_type: "$code_type", _id: 0 }).toArray()
                if (asinUpcData.length) {
                    return res.status(200).json({ data: asinUpcData, message: "Successfully get asin_upc" })
                }
                else {
                    return res.status(204).json({ message: "No content" })
                }
            }
            else {
                return res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error in asin_upc' });
        }
    });

    // get single asin or upc by id
    router.get('/get_asin_upc_by_id', async (req, res) => {
        const id = req.query.id;
        try {
            const asinUpcData = await asin_upc_collection.findOne({ _id: new ObjectId(id) })
            if (asinUpcData) {

                res.status(200).json({ data: asinUpcData, message: "successfully get asin_upc" })
            }
            else {
                res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error in asin_upc' });
        }
    });

    // get all asin upc for table
    router.get('/get_all_asin_upc', async (req, res) => {
        try {
            const notificationSearch = req.query.notification_search
            const id = req.query.id

            let asinUpcData;
            if (notificationSearch != 'null') {
                asinUpcData = await asin_upc_collection.findOne({ _id: new ObjectId(notificationSearch) })
                console.log(asinUpcData)
                asinUpcData = [asinUpcData]
            }
            else if (id) {
                asinUpcData = await asin_upc_collection.find({ admin_id: id }).sort({ date: -1 }).toArray()
            }
            if (asinUpcData) {
                res.status(200).json({ data: asinUpcData, message: "successfully all get asin_upc" })
            }
            else {
                res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error in all_asin_upc' });
        }
    });

    router.delete('/delete_asin_upc', async (req, res) => {
        try {
            const id = req.query.id
            const product_image = req.query.product_image


            const result = await asin_upc_collection.deleteOne({ _id: new ObjectId(id) })
            if (result.deletedCount) {

                if (product_image.startsWith('file')) {

                    const filePath = 'public/uploads/' + product_image;
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({ message: 'error to delete asin upc' });
                        }
                    });
                    return res.status(200).json({ message: 'deleted asin upc' });

                }
                return res.status(200).json({ message: 'deleted asin upc' });
            }
            else {
                return res.status(500).json({ message: 'error to delete asin upc' });
            }
        } catch (error) {
            res.status(500).json({ message: 'error to delete asin upc' });
        }
    })
}
run()

module.exports = router;