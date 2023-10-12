const express = require("express")
const router = express.Router()

const connectDatabase = require('../config/connectDatabase')
const bcrypt = require("bcrypt")

const run = async () => {
    const db = await connectDatabase()
    const admin_va_users_collection = db.collection("admin_va_users")


    router.post('/create_admin_va', async (req, res) => {

        try {
            const hashed_password = await bcrypt.hash(req.body.password, 10)

            const admin_va_user_data = {
                admin_id: req.body.admin_id,
                admin_va_id:req.body.admin_va_id,
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


}
run()
module.exports = router;

