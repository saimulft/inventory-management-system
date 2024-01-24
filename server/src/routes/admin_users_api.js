const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const bcrypt = require("bcrypt")
const sendEmail = require("../utilities/send_email")
const { ObjectId } = require("mongodb")
const verifyJWT = require("../middlewares/verifyJWT")
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
    const all_store_collection = db.collection("all_stores")

    // create a new admin
    router.post('/admin_signup', async (req, res) => {
        try {
            const isExist = await all_users_collection.findOne({ email: req.body.email })
            if (isExist) {
                return res.status(200).json({ message: "Email already exist" })
            }
            const hashed_password = await bcrypt.hash(req.body.password, 10)

            const login_data = {
                full_name: req.body.full_name,
                email: req.body.email,
                role: req.body.role,
                password: hashed_password,
                email_verified: false
            }
            const result = await all_users_collection.insertOne(login_data)

            if (result.acknowledged) {
                const admin_user_data = {
                    admin_id: result.insertedId.toString(),
                    full_name: req.body.full_name,
                    email: req.body.email,
                    role: req.body.role,
                    phone: req.body.phone,
                    address: null,
                    city: null,
                    state: null,
                    zip: null,
                    country: null,
                    whatsapp_number: null,
                }
                const response = await admin_users_collection.insertOne(admin_user_data)

                if (response.acknowledged) {
                    const send_email_data = {
                        email: req.body.email,
                        subject: `Hi ${req.body.full_name}, Verify your email`,
                        html: `
                        <div class="container">
                            <h2>Please verify your email before login to your account</h2>
                            <p>To verify your email <a href="http://localhost:5173/verify_email?id=${result.insertedId.toString()}">Click here</a></p>
                        </div>`
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

            const result = await admin_users_collection.deleteOne({ admin_id: req.body.admin_id })
            if (result.deletedCount) {
                const response = await all_users_collection.deleteOne({ id: req.body.admin_id })
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


    router.post('/get_all_users_list', verifyJWT, async (req, res) => {
        try {
            const role = req.role;
            let query;

            if (role === 'Admin' || 'Admin VA') {
                query = { admin_id: req.body.user.admin_id }
            }

            if (role === 'Store Manager Admin' || role === 'Warehouse Admin') {
                query = { creator_email: req.body.user.email };
            }

            const result = await all_users_collection.find(query, {projection: {password: 0}}).toArray()

            if (result.length) {
                res.status(200).json(result);
            }
            else {
                res.status(204).json({ message: 'No user found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    router.post('/delete_user', async (req, res) => {
        try {
            const user = req.body.user
            const role = user.role

            if (role === 'Admin VA') {
                const deleteResult = await all_users_collection.deleteOne({ _id: new ObjectId(user._id) })
                if (deleteResult.deletedCount) {

                    const result = await admin_va_users_collection.deleteOne({ email: user.email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else {
                    return res.status(204).json({ data: result, status: 'user not found' })
                }
            }
            if (role === 'Store Owner') {
                const deleteResult = await all_users_collection.deleteOne({ _id: new ObjectId(user._id) })
                if (deleteResult.deletedCount) {

                    const result = await store_owner_users_collection.deleteOne({ email: user.email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else {
                    return res.status(204).json({ data: result, status: 'user not found' })
                }
            }
            if (role === 'Store Manager Admin') {
                const deleteResult = await all_users_collection.deleteOne({ _id: new ObjectId(user._id) })
                if (deleteResult.deletedCount) {

                    const result = await store_manager_admin_users_collection.deleteOne({ email: user.email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else {
                    return res.status(204).json({ data: result, status: 'user not found' })
                }
            }
            if (role === 'Warehouse Admin') {
                const deleteResult = await all_users_collection.deleteOne({ _id: new ObjectId(user._id) })
                if (deleteResult.deletedCount) {

                    const result = await warehouse_admin_users_collection.deleteOne({ email: user.email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else {
                    return res.status(204).json({ data: result, status: 'user not found' })
                }
            }
            if (role === 'Store Manager VA') {
                const deleteResult = await all_users_collection.deleteOne({ _id: new ObjectId(user._id) })
                if (deleteResult.deletedCount) {

                    const result = await store_manager_va_users_collection.deleteOne({ email: user.email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else {
                    return res.status(204).json({ data: result, status: 'user not found' })
                }
            }
            if (role === 'Warehouse Manager VA') {
                const deleteResult = await all_users_collection.deleteOne({ _id: new ObjectId(user._id) })
                if (deleteResult.deletedCount) {

                    const result = await warehouse_manager_va_users_collection.deleteOne({ email: user.email })
                    return res.status(200).json({ data: result, status: 'success' })
                }
                else {
                    return res.status(204).json({ data: result, status: 'user not found' })
                }
            }

        } catch (error) {
            res.status(500).json({ message: "internal server error" })
        }


    })

    router.get('/get_all_stores', verifyJWT, async (req, res) => {
        try {
            const admin_id = req.query.admin_id
            const role = req.query.role
            const email = req.query.email
            if (role === "Store Manager Admin") {
                const user = await store_manager_admin_users_collection.findOne({email:email})
                const access_ids = user.store_access_ids.map(id => new ObjectId(id))
                const stores = await all_store_collection.find({_id:{$in:access_ids}},{ projection: { _id: 1, store_name: 1, } }).toArray()
                return res.status(200).json({ stores: stores })
            }   
            const result = await all_store_collection.find({ admin_id: admin_id }, { projection: { _id: 1, store_name: 1 } }).toArray()
            if (result.length) {
                return res.status(200).json({ stores: result })
            }
            else {
                return res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            res.status(500).json({ message: "internal server error" })
        }
    })

    router.get('/get_user_access_data', verifyJWT, async (req, res) => {

        try {

            const email = req.query.email
            const role = req.query.role

            let collection;
            if (role === 'Store Manager Admin') {
                collection = store_manager_admin_users_collection
            }
            if (role === 'Store Owner') {
                collection = store_owner_users_collection
            }
            if (role === 'Store Manager VA') {
                collection = store_manager_va_users_collection
            }
            const result = await collection.findOne({ email: email })
            const ids = result.store_access_ids.map(id => new ObjectId(id))

            const storeData = await all_store_collection.find({ _id: { $in: ids } }, { projection: { _id: 1, store_name: 1, } }).toArray()
            if (storeData.length) {
                return res.status(200).json({ storeData })
            }
            else {
                return res.status(204).json({ message: "No Content" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" })
        }

    })

    router.post('/update_user_access_data', verifyJWT, async (req, res) => {
        try {

            const email = req.query.email
            const role = req.query.role
            let collection;
            if (role === 'Store Manager Admin') {
                collection = store_manager_admin_users_collection
            }
            if (role === 'Store Owner') {
                collection = store_owner_users_collection
            }
            if (role === 'Store Manager VA') {
                collection = store_manager_va_users_collection
            }
            const result = await collection.updateOne({ email: email }, {
                $set: { 'store_access_ids': req.body.updatedIds }
            })
            if (result.modifiedCount) {
                return res.status(200).json({ message: "Data updated" })
            }
            else {
                res.status(204).json({ message: "No content" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" })
        }

    })
}
run()
module.exports = router;

