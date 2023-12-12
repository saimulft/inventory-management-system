const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const connectDatabase = require('../config/connectDatabase')
const bcrypt = require("bcrypt")
const verifyJWT = require("../middlewares/verifyJWT")
const sendEmail = require("../utilities/send_email")
const { ObjectId } = require("mongodb")
const run = async () => {
    const db = await connectDatabase()
    const all_users_collection = db.collection("all_users")
    const admin_users_collection = db.collection("admin_users")
    const admin_va_users_collection = db.collection("admin_va_users")
    const store_owner_users_collection = db.collection("store_owner_users")
    const store_manager_admin_users_collection = db.collection("store_manager_admin_users")
    const warehouse_admin_users_collection = db.collection("warehouse_admin_users")
    const store_manager_va_users_collection = db.collection("store_manager_va_users")
    const warehouse_manager_va_users_collection = db.collection("warehouse_manager_va_users")


    // user login
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
                    res.status(401).json({ message: "Authentication failed" })
                }
            } else {
                res.status(500).json({ message: 'Authentication failed' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // get user 
    router.get('/get_user_profile_data', verifyJWT, async (req, res) => {
        try {
            const user_email = req.email
            const user = await all_users_collection.findOne({ email: user_email })

            if (user) {
                const email = user.email;
                const role = req.role;

                if (role === 'Admin') {
                    const result = await admin_users_collection.findOne({ email: email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else if (role === 'Admin VA') {
                    const result = await admin_va_users_collection.findOne({ email: email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else if (role === 'Store Owner') {
                    const result = await store_owner_users_collection.findOne({ email: email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else if (role === 'Store Manager Admin') {
                    const result = await store_manager_admin_users_collection.findOne({ email: email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else if (role === 'Warehouse Admin') {
                    const result = await warehouse_admin_users_collection.findOne({ email: email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else if (role === 'Store Manager VA') {
                    const result = await store_manager_va_users_collection.findOne({ email: email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else if (role === 'Warehouse Manager VA') {
                    const result = await warehouse_manager_va_users_collection.findOne({ email: email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
            }
            else {
                return res.status(404).json({ message: "Failed to find user by email" })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    })

    // send reset pass email
    router.get('/send_reset_password_email', async (req, res) => {
        try {
            const email = req.query.email;
            const data = await all_users_collection.findOne({ email: email });

            if (data) {
                const send_email_data = {
                    email: data.email,
                    subject: "Visit this link in order to reset your password",
                    html: `
                    <h1 style='text-align:center'>Hi, To reset your password </h1> <br/>
                    <button> <a style='color:red,text-decoration:none,' href="https://revealifydirectory.com/update_password?id=${data._id}">Click here</a></button>`
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
            const user = await all_users_collection.findOne({ _id: new ObjectId(id) })

            if (user) {
                const result = await all_users_collection.updateOne(
                    { _id: new ObjectId(id) },
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
            return res.status(500).json({ message: 'Internal server error' });
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
            const result = await all_users_collection.findOne({ _id: new ObjectId(id) })
            if (result) {
                if (result.email_verified === true) {
                    return res.status(203).json({ message: "Email already verified" })
                }

                const updateEmailStatus = await all_users_collection.updateOne(
                    { _id: new ObjectId(id) },
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

    // update profile information by email
    router.put('/update_user_profile_data', async (req, res) => {
        try {
            const current_email = req.body.current_email;
            const current_password = req.body.current_password;
            const role = req.body.role;
            const data = await all_users_collection.findOne({ email: current_email });

            if (data) {
                if (current_password) {
                    const isValidPassword = await bcrypt.compare(current_password, data.password)
                    const hashed_password = await bcrypt.hash(req.body.new_password, 10)
                    if (isValidPassword) {
                        const updatedPassword = {
                            $set: {
                                password: hashed_password
                            },
                        };
                        const passwordUpdateResult = await all_users_collection.updateOne({ email: current_email }, updatedPassword)

                        if (!passwordUpdateResult.modifiedCount) {
                            return res.status(500).json({ message: "Internal server error while updating password" })
                        }
                    }
                    else {
                        return res.status(401).json({ message: "Invalid current password" })
                    }
                }

                const updatedData = {
                    full_name: req.body.full_name,
                    email: req.body.new_email,
                    phone: req.body.phone,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    zip: req.body.zip,
                    country: req.body.country,
                    whatsapp_number: req.body.whatsapp_number
                }
                const nameUpdate = await all_users_collection.updateOne({ email: current_email }, { $set: { full_name: req.body.full_name } })
                if (role === 'Admin') {
                    const result = await admin_users_collection.findOneAndUpdate(
                        { email: current_email },
                        { $set: updatedData },
                        { returnDocument: "after" }
                    );
                    return res.status(200).json(result);
                }
                else if (role === 'Admin VA') {
                    const result = await admin_va_users_collection.findOneAndUpdate(
                        { email: current_email },
                        { $set: updatedData },
                        { returnDocument: "after" }
                    );
                    return res.status(200).json(result);
                }
                else if (role === 'Store Owner') {
                    const result = await store_owner_users_collection.findOneAndUpdate(
                        { email: current_email },
                        { $set: updatedData },
                        { returnDocument: "after" }
                    );
                    return res.status(200).json(result);
                }
                else if (role === 'Store Manager Admin') {
                    const result = await store_manager_admin_users_collection.findOneAndUpdate(
                        { email: current_email },
                        { $set: updatedData },
                        { returnDocument: "after" }
                    );
                    return res.status(200).json(result);
                }
                else if (role === 'Warehouse Admin') {
                    const result = await warehouse_admin_users_collection.findOneAndUpdate(
                        { email: current_email },
                        { $set: updatedData },
                        { returnDocument: "after" }
                    );
                    return res.status(200).json(result);
                }
                else if (role === 'Store Manager VA') {
                    const result = await store_manager_va_users_collection.findOneAndUpdate(
                        { email: current_email },
                        { $set: updatedData },
                        { returnDocument: "after" }
                    );
                    return res.status(200).json(result);
                }
                else if (role === 'Warehouse Manager VA') {
                    const result = await warehouse_manager_va_users_collection.findOneAndUpdate(
                        { email: current_email },
                        { $set: updatedData },
                        { returnDocument: "after" }
                    );

                    return res.status(200).json(result);
                }
            }

            else {
                return res.status(404).json({ message: 'User not found' });
            }

        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
}
run()
module.exports = router;

