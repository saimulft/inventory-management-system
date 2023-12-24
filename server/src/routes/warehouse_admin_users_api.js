const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const bcrypt = require("bcrypt")
const sendEmail = require("../utilities/send_email")
const verifyJWT = require("../middlewares/verifyJWT")

const run = async () => {
    const db = await connectDatabase()
    const warehouse_admin_users_collection = db.collection("warehouse_admin_users")
    const all_users_collection = db.collection("all_users")
    const warehouses_collection = db.collection("warehouses")

    // create new warehouse admin
    router.post('/create_warehouse_admin', async (req, res) => {
        try {
            const inputEmail = req.body.email
            const isExist = await all_users_collection.findOne({ email: inputEmail })
            if (isExist) {
                return res.status(200).json({ message: "Email already exist" })
            }

            const hashed_password = await bcrypt.hash(req.body.password, 10)

            const login_data = {
                admin_id: req.body.admin_id,
                full_name: req.body.full_name,
                creator_email: req.body.creator_email,
                email: req.body.email,
                password: hashed_password,
                role: req.body.role,
                email_verified: false,
            }

            const result = await all_users_collection.insertOne(login_data)

            if (result.acknowledged) {
                const warehouse_data = {
                    admin_id: req.body.admin_id,
                    warehouse_admin_id: result.insertedId.toString(),
                    warehouse_name: req.body.warehouse_name,
                    creator_email: req.body.creator_email,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    zip: req.body.zip,
                    country: req.body.country
                }

                const warehouseResult = await warehouses_collection.insertOne(warehouse_data)

                if (warehouseResult.acknowledged) {
                    const warehouse_admin_user_data = {
                        admin_id: req.body.admin_id,
                        warehouse_admin_id: result.insertedId.toString(),
                        creator_email: req.body.creator_email,
                        warehouse_id: warehouseResult.insertedId.toString(),
                        full_name: req.body.full_name,
                        email: req.body.email,
                        username: req.body.username,
                        role: req.body.role,
                        phone: null,
                        address: null,
                        city: null,
                        state: null,
                        zip: null,
                        country: null,
                        whatsapp_number: null
                    }
                    const response = await warehouse_admin_users_collection.insertOne(warehouse_admin_user_data)
                    if (response.acknowledged) {
                        const send_email_data = {
                            email: req.body.email,
                            subject: `Hi ${req.body.full_name}, Verify your email`,
                            html: `
                            <div class="container">
                                <h2>Your login credentials</h2>
                                <div class="user-info">
                                    <p><strong>Email:</strong> ${req.body.email}</p>
                                    <p><strong>Password:</strong> ${req.body.password}</p>
                                    <p><strong>Role:</strong> ${req.body.role}</p>
                                </div>
                                <hr />
                                <h2>Please verify your email before login to your account</h2>
                                <p>To verify your email <a href="http://localhost:5173/verify_email?id=${result.insertedId.toString()}">Click here</a></p>
                            </div>`
                        }

                        sendEmail(send_email_data);
                        res.status(201).json({ message: 'Warehouse admin user created successfully', status: "success" });
                    }

                }
                else {
                    res.status(500).json({ message: 'Failed to create Warehouse' });
                }

            } else {
                res.status(500).json({ message: 'Failed to create Warehouse admin user' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })


    // get all warehouse admin
    router.get('/get_all_warehouse_admin', verifyJWT, async (req, res) => {
        try {
            const admin_id = req.query.id;

            const result = await warehouse_admin_users_collection.find({ admin_id: admin_id }).toArray()

            if (result.length) {
                const data = result.map(item => {
                    return { warehouse_admin_id: item.warehouse_admin_id, value: item.warehouse_id, label: item.full_name }
                })
                return res.status(200).json({ data: data, message: 'Successfully got all warehouse admin' })
            }
            else {
                return res.status(204).json({ message: 'No content found' })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}
run()
module.exports = router;