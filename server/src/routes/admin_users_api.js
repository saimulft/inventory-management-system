const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const connectDatabase = require('../config/connectDatabase')
const bcrypt = require("bcrypt")
const verifyJWT = require("../middlewares/verifyJWT")
const nodemailer = require("nodemailer")
const run = async () => {
const db = await connectDatabase()
const admin_users_collection = db.collection("admin_users")


    // verify user email 
    const verifyEmail = async (name, email, id) => {
        try {
            const transporter =
                nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: "toriqulislam142@gmail.com",
                        pass: 'nqle nukt eqfy kcko'
                    }
                })

            const mailOption = {
                from: "toriqulislam142@gamil.com",
                to: email,
                subject: "Verify your email",
                html: `<p>Hi, ${name}, Please verify your email by <a href="http://localhost:5173/verify_email?id=${id}">Click here</a></p>`
            }

            transporter.sendMail(mailOption)

        }
        catch (error) {
            console.log(error)
        }
    }

    // create a new admin
    router.post('/admin_signup', async (req, res) => {
        try {

            const inputEmail = req.body.email
            const isExist = await admin_users_collection.findOne({ email: inputEmail })
            if (isExist) {
                return res.status(200).json({ message: "Email already exist" })
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
                whatsapp_number: req.body.whatsapp_number,
                email_verified: false
            }
            const result = await admin_users_collection.insertOne(admin_user_data)

            if (result.acknowledged) {
                res.status(201).json({ message: 'Admin  user created successfully', status: "success" });
                verifyEmail(req.body.full_name, req.body.email, req.body.admin_id);

            } else {
                res.status(500).json({ message: 'Failed to create admin  user' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // verify user email and update email status
    router.get('/verify_email', async (req, res) => {
        const id = req.query.id
        console.log(id)
        const update = {
            $set: {
                email_verified: true,
            },
        };
        try {
            const result = await admin_users_collection.findOne({ admin_id: id })
            if (result) {
                console.log(result)
            if(result.email_verified === true){
                console.log("alread")
                return res.status(200).json({ message: "Email verified successfully " })
                
            }
                const updateEmailStatus = await admin_users_collection.updateOne(
                    { admin_id: id },
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

    // admin login
    router.post('/admin_user_login', async (req, res) => {
        try {
            const admin_email = req.body.admin_email
            const admin_password = req.body.admin_password
            const data = await admin_users_collection.findOne({ email: admin_email })
            if (data) {
                const isValidPassword = await bcrypt.compare(admin_password, data.password)
                if (isValidPassword) {
                    if (data.email_verified) {
                        const token = jwt.sign({
                            role: data.role,
                            id: data.admin_id,
                            email: data.email
                        }, process.env.JWT_SECRET, { expiresIn: '2d' })
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

    // get user 
    router.get('/get_admin_user', verifyJWT, async (req, res) => {

        try {
            const user_email = req.email
            const user = await admin_users_collection.findOne({ email: user_email })
            if (user) {
                res.status(200).json({ data: user })
            }
            else {
                res.status(500).json({ message: "Failed to find user by email" })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    })

    // update profile information by email
    router.put('/update_admin_user', async (req, res) => {
        try {
            const current_email = req.body.current_email;
            const current_password = req.body.current_password;

            const data = await admin_users_collection.findOne({ email: current_email })

            if (data) {
                if (current_password) {
                    const isValidPassword = await bcrypt.compare(current_password, data.password)
                    const hashed_password = await bcrypt.hash(req.body.new_password, 10)
                    if (isValidPassword) {
                        const updatedData = {
                            full_name: req.body.full_name,
                            email: req.body.new_email,
                            password: hashed_password,
                            phone: req.body.phone,
                            address: req.body.address,
                            city: req.body.city,
                            state: req.body.state,
                            zip: req.body.zip,
                            country: req.body.country,
                            whatsapp_number: req.body.whatsapp_number
                        }
                        const result = await admin_users_collection.findOneAndUpdate(
                            { email: current_email },
                            { $set: updatedData },
                            { returnDocument: "after" }
                        );
                        return res.status(200).json(result);
                    }
                    else {
                        res.status(401).json({ message: "Invalid current password" })
                    }
                }

                else {
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
                    const result = await admin_users_collection.findOneAndUpdate(
                        { email: current_email },
                        { $set: updatedData },
                        { returnDocument: "after" }
                    );
                    return res.status(200).json(result);
                }
            }
            else {
                return res.status(404).json({ message: 'Document not found' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    });

}
run()
module.exports = router;

