const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const connectDatabase = require('../config/connectDatabase')
const bcrypt = require("bcrypt")
const run = async () => {
    const db = await connectDatabase()
    const admin_users_collection = db.collection("admin_users")

    try {

        // create a new admin
        router.post('/admin_signup', async (req, res) => {
            try {
                
                const inputEmail = req.body.email
                const isExist = await admin_users_collection.findOne({ email: inputEmail })
                if (isExist) {
                    return res.status(500).json({ message: "Email already exist" })
                }
                const hashed_password = await bcrypt.hash(req.body.password, 10)
                const admin_user_data = {
                    admin_id: req.body.admin_id,
                    full_name: req.body.full_name,
                    email: req.body.email,
                    password: hashed_password,
                    role: req.body.role,
                    phone: req.body.phone,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    zip: req.body.zip,
                    country: req.body.country,
                    whatsapp_number: req.body.whatsapp_number
                }
                const result = await admin_users_collection.insertOne(admin_user_data)

                if (result.acknowledged) {
                    res.status(201).json({ message: 'Admin  user created successfully', status: "success" });
                } else {
                    res.status(500).json({ message: 'Failed to create admin  user' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        })


        // admin login
        router.post('/admin_user_login', async (req, res) => {
            try {
                const admin_email = req.body.admin_email
                const admin_password = req.body.admin_password
                const data = await admin_users_collection.findOne({ email: admin_email })

                if (data) {
                    const isValidPassword = await bcrypt.compare(admin_password, data.password)
                    if (isValidPassword) {
                        const token = jwt.sign({
                            role: data.role,
                            id: data.admin_id,
                            email: data.email
                        }, process.env.JWT_SECRET, { expiresIn: '2d' })

                        res.status(200).json({ data: data, token: token });

                    } else {
                        res.status(401).json({ message: "authentication failed" })
                    }
                } else {
                    res.status(500).json({ message: 'authentication failed' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        })


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });

    }
}
run()
module.exports = router;

