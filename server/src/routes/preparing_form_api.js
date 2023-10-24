const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const multer = require("multer")
const path = require('path')
const { ObjectId } = require("mongodb")
const fs = require('fs')
const run = async () => {

    const db = await connectDatabase()
    const preparing_form_collection = db.collection("preparing_form_collection")

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

    // preparing form insersation
    router.post('/preparing_form_insert', upload.array("file", 2), async (req, res) => {
        try {
            const uploadedFiles = req.files;
            let shippingFilename = null
            let invoiceFileName = null
            const filenames = uploadedFiles.map((file) => file.filename);
            if (uploadedFiles.length === 2) {
                invoiceFileName = filenames[0]
                shippingFilename = filenames[1]
            }
            if (uploadedFiles.length === 1) {
                if (uploadedFiles[0].originalname.startsWith("invoice")) {
                    invoiceFileName = filenames[0]
                }
                else {
                    shippingFilename = filenames[0]
                }
            }
            const data = {
                admin_id: req.body.adminId,
                creator_email: req.body.creatorEmail,
                date: req.body.date,
                code: req.body.code,
                order_id: req.body.orderID,
                courier: req.body.courier === "Select courier" ? null : req.body.courier,
                product_name: req.body.productName,
                store_name: req.body.storeName,
                code_type: req.body.codeType,
                upin: req.body.upin,
                quantity: req.body.quantity,
                tracking_number: req.body.trackingNumber ? req.body.trackingNumber : null,
                invoice_file: invoiceFileName,
                shipping_file: shippingFilename,
                notes: req.body.notes ? req.body.notes : null,
                warehouse: req.body.warehouse,
            };

            const result = await preparing_form_collection.insertOne(data)
            if (result.acknowledged) {
                res.status(201).json({ message: "Preparing form inserted" })
            }
            else {
                res.status(500).json({ message: "Error to Preparing form " });
            }
        } catch (error) {
            res.status(500).json({ message: "Multer error" });
        }
    });


    // preparing form update
    router.put('/preparing_form_update', upload.array("file", 2), async (req, res) => {
        try {
            const id = req.body.id
            const existData = await preparing_form_collection.findOne({ _id: new ObjectId(id) })
            const uploadedFiles = req.files;
            let shippingFilename = existData.shipping_file
            let invoiceFileName = existData.invoice_file
            const filenames = uploadedFiles.map((file) => file.filename);

            if (uploadedFiles.length === 2) {
                invoiceFileName = filenames[0]
                shippingFilename = filenames[1]
            }
            if (uploadedFiles.length === 1) {
                if (uploadedFiles[0].originalname.startsWith("invoice")) {
                    invoiceFileName = filenames[0]
                }
                else {
                    shippingFilename = filenames[0]
                }
            }
            const UpdateData = {

                courier: req.body.courier === "Select courier" ? existData.courier : req.body.courier,
                code_type: req.body.codeType === "Select type" || !req.body.codeType ? existData.code_type : req.body.codeType,
                tracking_number: req.body.trackingNumber ? req.body.trackingNumber : existData.tracking_number,
                invoice_file: invoiceFileName,
                shipping_file: shippingFilename,
                shipping_file: shippingFilename,
                notes: req.body.notes ? req.body.notes : existData.notes,
                quantity: req.body.quantity ? req.body.quantity : existData.quantity,
                product_name: req.body.productName ? req.body.productName : existData.product_name,
                code: req.body.code ? req.body.code : existData.code,

            };

            const result = await preparing_form_collection.updateOne({ _id: new ObjectId(id) }, { $set: UpdateData })

            if (result.modifiedCount) {
                res.status(200).json({ message: "Preparing form updated" })
            }
            else {
                res.status(500).json({ message: "Error to Preparing form " });
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Multer error" });
        }
    });


    // get all preparing request data

    router.get('/get_all_preparing_request_data', async (req, res) => {
        try {
            const data = await preparing_form_collection.find({}).toArray()
            if (data.length) {
                res.status(200).json({ data: data })

            }
           

        } catch (error) {
            res.status(500).json({ message: "get_all_preparing_request_data error" })
        }
    })


    router.post('/delete_preparing_request_data', async (req, res) => {
        const id = req.body.id;
        const invoice_file = req.body.invoice_file;
        const shipping_file = req.body.shipping_file;

        try {
            const data = await preparing_form_collection.deleteOne({ _id: new ObjectId(id) });

            if (data.deletedCount) {
                // Delete the associated files if they exist
                if (invoice_file) {
                    const filePath = 'public/uploads/' + invoice_file;
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            return res.status(404).json({ message: "Data not found" });
                        }
                    });
                }

                if (shipping_file) {
                    const filePath = 'public/uploads/' + shipping_file;
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            return res.status(404).json({ message: "Data not found" });
                        }
                    });
                }

                res.status(200).json({ message: "Deleted preparing request data and associated files" });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting preparing request data" });
        }
    });


}
run()

module.exports = router;