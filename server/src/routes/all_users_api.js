const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')

const run = async () => {
    const db = await connectDatabase()
    const all_users_collection = db.collection("all_users")

    // get all all users
    router.get('/all_users', async (req, res) => {
        
        try {
            const result = await all_users_collection.find({}).toArray()
            if (result.length) {
                res.status(200).json(result);
            }
            else {
                res.status(500).json({ message: 'Failed to get all users' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}
run()
module.exports = router;

