const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const bcrypt = require("bcrypt")
const sendEmail = require("../utilities/send_email")

const run = async () => {
    const db = await connectDatabase()
    const store_manager_va_users_collection = db.collection("store_manager_va_users")
    const all_users_collection = db.collection("all_users")

    // create new admin va 
    router.post('/create_store_manager_va', async (req, res) => {
        try {
            const inputEmail = req.body.email
            const isExist = await all_users_collection.findOne({ email: inputEmail })
            if (isExist) {
                return res.status(200).json({ message: "Email already exist" })
            }
            
            const hashed_password = await bcrypt.hash(req.body.password, 10)

            const store_manager_va_user_data = {
                admin_id: req.body.admin_id,
                store_manager_va_id: req.body.store_manager_va_id,
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
            const login_data = {
                id: req.body.store_manager_va_id,
                email: req.body.email,
                password: hashed_password,
                role: req.body.role,
                email_verified: false,
            }
            const result = await store_manager_va_users_collection.insertOne(store_manager_va_user_data)

            if (result.acknowledged) {
                const response = await all_users_collection.insertOne(login_data)
                if (response.acknowledged) {
                    const send_email_data = {
                        email: req.body.email,
                        subject: "Verify your email",
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
                            <p>To verify your email <a href="http://localhost:5173/verify_email?id=${req.body.store_manager_va_id}">Click here</a></p>
                        </div>`
                    }

                    sendEmail(send_email_data);
                    res.status(201).json({ message: 'Store manager va user created successfully', status: "success" });
                }
            } else {
                res.status(500).json({ message: 'Failed to create store manager va user' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}
run()
module.exports = router;