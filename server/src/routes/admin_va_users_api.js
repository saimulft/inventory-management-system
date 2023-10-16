const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const connectDatabase = require('../config/connectDatabase')
const bcrypt = require("bcrypt")

const run = async () => {
    const db = await connectDatabase()
    const admin_va_users_collection = db.collection("admin_va_users")

    // create new admin va 
    router.post('/create_admin_va', async (req, res) => {
        try {
            const hashed_password = await bcrypt.hash(req.body.password, 10)

            const admin_va_user_data = {
                admin_id: req.body.admin_id,
                admin_va_id: req.body.admin_va_id,
                full_name: req.body.full_name,
                email: req.body.email,
                username: req.body.username,
                password: hashed_password,
                role: req.body.role,
                phone: null,
                address: null,
                city: null,
                state: null,
                zip: null,
                country: null,
                whatsapp_number: null
            }
            const result = await admin_va_users_collection.insertOne(admin_va_user_data)

            if (result.acknowledged) {
                res.status(201).json({ message: 'Admin va user created successfully', status: "success" });
            } else {
                res.status(500).json({ message: 'Failed to create admin va user' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // admin va login
    router.post('/admin_va_login', async (req, res) => {
        try {
            const admin_va_email = req.body.admin_va_email
            const admin_va_password = req.body.admin_va_password

            const data = await admin_va_users_collection.findOne({ email: admin_va_email })

            if (data) {
                const isValidPassword = await bcrypt.compare(admin_va_password, data.password)
                console.log(isValidPassword)
                if (isValidPassword) {
                    const token = jwt.sign({
                        role: data.role,
                        id: data.admin_va_id,
                        email: data.email
                    }, process.env.JWT_SECRET, { expiresIn: '2d' })

                    res.status(200).json({ data: data, token: token });

                } else {
                    res.status(401).json({ message: "authentication failed " })
                }
            } else {
                res.status(500).json({ message: 'authentication failed' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }

    })


}
run()
module.exports = router;

