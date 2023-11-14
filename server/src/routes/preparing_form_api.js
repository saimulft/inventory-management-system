const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const multer = require("multer")
const path = require('path')
const { ObjectId } = require("mongodb")
const fs = require('fs')
const verifyJWT = require("../middlewares/verifyJWT")
const run = async () => {

    const db = await connectDatabase()
    const preparing_form_collection = db.collection("preparing_form_data")
    const all_stock_collection = db.collection("all_stock")

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
                created_at: req.body.createdAt,
                asin_upc_code: req.body.asin_upc_code,
                order_id: req.body.orderID,
                courier: req.body.courier === "Select courier" ? null : req.body.courier,
                product_name: req.body.productName,
                store_name: req.body.storeName,
                store_id: req.body.storeId,
                code_type: req.body.codeType,
                upin: req.body.upin,
                quantity: req.body.quantity,
                tracking_number: req.body.trackingNumber ? req.body.trackingNumber : null,
                invoice_file: invoiceFileName,
                shipping_file: shippingFilename,
                notes: req.body.notes ? req.body.notes : null,
                warehouse_name: req.body.warehouseName,
                warehouse_id: req.body.warehouseId,
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
                asin_upc_code: req.body.code ? req.body.code : existData.asin_upc_code,
            };

            const result = await preparing_form_collection.updateOne({ _id: new ObjectId(id) }, { $set: UpdateData })

            if (result.modifiedCount) {
                if (req.body.productName) {
                    const allStockResult = await all_stock_collection.updateOne({ upin: existData.upin }, { $set: { product_name: req.body.productName } })

                    if (allStockResult.modifiedCount) {
                        return res.status(200).json({ message: "All stock updated" })
                    }
                    else {
                        return res.status(500).json({ message: "Error to update all stock" });
                    }
                }
                return res.status(200).json({ message: "Preparing form updated" })
            }
            else {
                return res.status(500).json({ message: "Error to Preparing form " });
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Multer error" });
        }
    });


    // get all preparing request data
    router.post('/get_all_preparing_request_data',verifyJWT,async (req, res) => {
        try {
            const user = req.body.user;
            const role = req.role;

            let query;

            if (role === 'Admin' || role === 'Admin VA') {
                query = { admin_id: user.admin_id }
            }

            else if (role === 'Store Manager Admin' || role === 'Store Manager VA') {

                const store_access_ids = req.body.user.store_access_ids;
                query = { store_id: { $in: store_access_ids.map(id => id) } };
            }

            else if (role === 'Warehouse Admin' || role === 'Warehouse Manager VA') {
                query = { warehouse_id: user.warehouse_id }
            }

            const data = await preparing_form_collection.find(query).sort({ created_at: -1 }).toArray()

            if (data) {
                res.status(200).json({ data: data })
            }
            else {
                res.status(204).json({ message: "No content" })
            }

        } catch (error) {
            res.status(500).json({ message: "get_all_preparing_request_data error" })
        }
    })


    router.delete('/delete_preparing_request_data', async (req, res) => {

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
                            // return res.status(404).json({ message: "Data not found" });
                        }
                    });
                }

                if (shipping_file) {
                    const filePath = 'public/uploads/' + shipping_file;
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            // return res.status(404).json({ message: "Data not found" });
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