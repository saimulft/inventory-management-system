const express = require("express")

const router = express.Router()

const connectDatabase = require('../config/connectDatabase')

const run = async () => {
    const db = await connectDatabase()
    const collection = db.collection("practice")

    try {
        router.get('/user_post', async (req, res) => {
            const data = await collection.find().toArray()
            res.send(data)
        })

    } catch (error) {
        console.log(error)

    }
}
run()
module.exports = router