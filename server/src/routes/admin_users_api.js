const express = require("express")
const router = express.Router()
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

    // get all admin users
    router.get('/admin_users', async (req, res) => {
        try {
            const result = await admin_users_collection.find({}).toArray()
            if (result.length) {
                res.status(200).json(result);
            }
            else {
                res.status(500).json({ message: 'Failed to get admin users' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // delete admin user by admin id
    router.delete('/admin_users', async (req, res) => {
        try {
            const admin_id = req.body.admin_id;

            const result = await admin_users_collection.deleteOne({ admin_id: admin_id })
            if (result.deletedCount) {
                const response = await all_users_collection.deleteOne({ id: admin_id })
                if (response.deletedCount) {
                    res.status(200).json({ message: 'Admin  user deleted successfully', status: "success" });
                }
            }
            else {
                res.status(500).json({ message: 'Internal server error while deleting admin user' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}
run()
module.exports = router;

