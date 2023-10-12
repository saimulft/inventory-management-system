const express = require("express")
const router = express.Router()

const connectDatabase = require('../config/connectDatabase')
const bcrypt = require("bcrypt")

const run = async () => {
    const db = await connectDatabase()
    const admin_users_collection = db.collection("admin_users")

    try {

        // create a new admin
        router.post('/admin_signup', async (req, res) => {

            const hashed_password = await bcrypt.hash(req.body.password, 10)

            const admin_user_data = {
                admin_id: req.body.admin_id,
                full_name: req.body.full_name,
                email: req.body.email,
                password: hashed_password,
                role: req.body.role,
                phone: req.body.phone,
                adress: req.body.adress,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                country: req.body.country,
                whatsapp_number: req.body.whatsapp_number
            }
            const result = await admin_users_collection.insertOne(admin_user_data)

            if (result.acknowledged) {
                res.status(201).json({ message: 'Admin user created successfully', status: "success" });
            } else {
                res.status(500).json({ message: 'Failed to create admin user' });
            }
        })

        // get admin by id
        router.post('/get_admin_user', async (req, res) => {
            const admin_id = req.body.admin_id
            const result = await admin_users_collection.findOne({ admin_id: admin_id })
            console.log(result)
            if (result) {
                res.status(201).json(result);
            } else {
                res.status(500).json({ message: 'Failed to get admin user' });
            }
        })


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });

    }
}
run()
module.exports = router;

