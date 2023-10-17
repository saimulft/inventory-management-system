const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const connectDatabase = require('../config/connectDatabase')
const bcrypt = require("bcrypt")
const sendEmail = require("../utilities/send_email")
const run = async () => {
    const db = await connectDatabase()
    const admin_users_collection = db.collection("admin_users")
    const all_users_collection = db.collection("all_users")


    // create a new admin
    router.post('/admin_signup', async (req, res) => {
        try {

            const inputEmail = req.body.email
            const isExist = await all_users_collection.findOne({ email: inputEmail })
            if (isExist) {
                return res.status(200).json({ message: "Email already exist" })
            }
            const hashed_password = await bcrypt.hash(req.body.password, 10)
            const admin_user_data = {
                admin_id: req.body.admin_id,
                full_name: req.body.full_name,
                email: req.body.email,
                role: req.body.role,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                country: req.body.country,
                whatsapp_number: req.body.whatsapp_number,
            }
            const login_data = {
                id: req.body.admin_id,
                email: req.body.email,
                role: req.body.role,
                password: hashed_password,
                email_verified: false
            }
            const result = await admin_users_collection.insertOne(admin_user_data)


            if (result.acknowledged) {
                const response = await all_users_collection.insertOne(login_data)

                if (response.acknowledged) {
                    const send_email_data = {
                        email: req.body.email,
                        subject: "Verify email",
                        html: `<p>Hi, ${req.body.full_name}, Please verify your email by <a href="http://localhost:5173/verify_email?id=${req.body.admin_id}">Click here</a></p>`
                    }

                    sendEmail(send_email_data);
                    res.status(201).json({ message: 'Admin  user created successfully', status: "success" });

                }
            } else {
                res.status(500).json({ message: 'Failed to create admin  user' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // admin login
    router.post('/user_login', async (req, res) => {
        try {
            const email = req.body.email
            const password = req.body.password
            const data = await all_users_collection.findOne({ email: email })
            if (data) {
                const isValidPassword = await bcrypt.compare(password, data.password)
                if (isValidPassword) {
                    if (data.email_verified) {
                        const token = jwt.sign({
                            role: data.role,
                            email: data.email
                        }, process.env.JWT_SECRET, { expiresIn: '7d' })
                        res.status(200).json({ data: data, token: token });
                    }
                    else {
                        res.status(403).json({ message: "Please verify your email to login" })

                    }

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
}
run()
module.exports = router;

