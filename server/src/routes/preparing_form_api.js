const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const multer = require("multer")
const path = require('path')

const run = async () => {

    const db = await connectDatabase()
    const preparing_form_collection = db.collection("preparing_form_collection")

    // upload asin upc image 
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/uploads'); // Destination folder for uploaded files
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix);
        },
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('File type not supported. Supported file types are JPEG, PNG, and PDF.'), false);
        }
    };

    const upload = multer({
        storage,
        limits: { fileSize: 5000000 },
        fileFilter,
    });

    // asin_upc_file_upload API
    router.post('/preparing_form_file_upload', upload.any(), async (req, res) => {
        const uploadedFile = req.files;
        if (uploadedFile) {
            res.status(201).json({ message: "File uploaded", filename: uploadedFile[0].filename });
        } else {
            res.status(500).json({ message: "Multer error" });
        }
    });

    // insert a new preparingform request
    router.post('/preparing_form_insert', async (req, res) => {
        const data = {
            admin_id: req.body.adminId,
            creator_email: req.body.creatorEmail,
            date: req.body.date,
            code: req.body.code,
            order_id: req.body.orderID,
            courier: req.body.courier,
            product_name: req.body.productName,
            store_name: req.body.storeName,
            code_type: req.body.codeType,
            upin: req.body.upin,
            quantity: req.body.quantity,
            tracking_number: req.body.trackingNumber,
            invoice_file: req.body.invoiceFileName,
            shipping_file: req.body.shippingFilename,
            warehouse: req.body.warehouse,
            note: req.body.note,
        }
        try {
            const result = await preparing_form_collection.insertOne(data)
            if (result.acknowledged) {
                res.status(201).json({ message: "preparing_form inserted" })
            }
            else {
                res.status(500).json({ message: "Error to inserting preparing_form" })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // get all preparing request data

    router.get('/get_all_preparing_request_data', async (req, res) => {
        try {
            const data = await preparing_form_collection.find({}).toArray()
            if (data.length) {
                res.status(200).json({ data: data })
            }
            else {
                res.status(401).json({ message: "Data not found" })
            }
        } catch (error) {
            res.status(500).json({ message: "get_all_preparing_request_data error" })
        }
    })



}
run()

module.exports = router;