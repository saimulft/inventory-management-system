const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const connectDatabase = require('../config/connectDatabase')
const bcrypt = require("bcrypt")
const verifyJWT = require("../middlewares/verifyJWT")
const sendEmail = require("../utilities/send_email")
const run = async () => {
    const db = await connectDatabase()
    const all_users_collection = db.collection("all_users")
    const admin_users_collection = db.collection("admin_users")
    const admin_va_users_collection = db.collection("admin_va_users")
    const store_owner_users_collection = db.collection("store_owner_users")
    const store_manager_admin_users_collection = db.collection("store_manager_admin_users")
    const warehouse_admin_users_collection = db.collection("warehouse_admin_users")


    // get user 
    router.get('/get_user', verifyJWT, async (req, res) => {

        try {
            const user_email = req.email
            const user = await all_users_collection.findOne({ email: user_email })
            if (user) {
                return res.status(200).json({ data: user, status: 'success' })
            }
            else {
                return res.status(404).json({ message: "Failed to find user by email" })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    })

    router.get('/get_user_profile_data', async (req, res) => {
        try {
            const email = req.query.email;
            const role = req.query.role;

            if (role === 'Admin') {
                const result = await admin_users_collection.findOne({ email: email })
                return res.status(200).json({ data: result })
            }
            else if (role === 'Admin VA') {
                const result = await admin_va_users_collection.findOne({ email: email })
                return res.status(200).json({ data: result })
            }
            else if (role === 'Store Owner') {
                const result = await store_owner_users_collection.findOne({ email: email })
                return res.status(200).json({ data: result })
            }
            else if (role === 'Store Manager Admin') {
                const result = await store_manager_admin_users_collection.findOne({ email: email })
                return res.status(200).json({ data: result })
            }
            else if (role === 'Warehouse Admin') {
                const result = await warehouse_admin_users_collection.findOne({ email: email })
                return res.status(200).json({ data: result })
            }
            else if (role === 'Store Manager VA') {
                ''
            }
            else if (role === 'Warehouse VA') {
                ''
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error while getting user profile info' });
        }
    })

    // send reset pass email
    router.get('/send_reset_password_email', async (req, res) => {
        try {
            const email = req.query.email;
            const data = await all_users_collection.findOne({ email: email });

            if (data) {
                const send_email_data = {
                    email: req.body.email,
                    subject: "Visit this link in order to reset your password",
                    html: `<p>Hi, ${name}, To reset your password <a href="http://localhost:5173/update_password?id=${id}">Click here</a></p>`
                }

                sendEmail(send_email_data);
                return res.status(200).json({ message: 'Email sent for resetting password' });
            }

            else {
                return res.status(203).json({ message: 'user not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // reset  password api
    router.post('/reset_password', async (req, res) => {

        try {

            const id = req.body.id
            const new_password = req.body.newPassword
            const hash_passwrod = await bcrypt.hash(new_password, 10)
            const user = await all_users_collection.findOne({ admin_id: id })

            if (user) {
                const result = await all_users_collection.updateOne(
                    { admin_id: id },
                    {
                        $set: {
                            password: hash_passwrod
                        }
                    }
                )
                if (result.modifiedCount) {
                    return res.status(200).json({ message: 'Password update successful' });
                }
            }
            else {
                return res.status(203).json({ message: 'User not found' });
            }

        } catch (error) {
            return res.status(203).json({ message: 'User not found' });
        }
    })

    // verify user email and update email status
    router.get('/verify_email', async (req, res) => {
        const id = req.query.id
        const update = {
            $set: {
                email_verified: true,
            },
        };
        try {
            const result = await all_users_collection.findOne({ id: id })
            if (result) {

                if (result.email_verified === true) {
                    console.log("alreay")
                    return res.status(203).json({ message: "Email already verified" })

                }
                const updateEmailStatus = await all_users_collection.updateOne(
                    { id: id },
                    update
                )
                if (updateEmailStatus.modifiedCount) {

                    res.status(200).json({ message: "Email verified successfully " })
                }
            }
            else {
                res.status(500).json({ message: "Error to verify email" })
            }

        } catch (error) {

            res.status(500).json({ message: "Error to verify email" })

        }
    })
}
run()
module.exports = router;

