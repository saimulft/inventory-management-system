const express = require("express")

const router = express.Router()

const connectDatabase = require('../config/connectDatabase')

const run = async () => {
    const db = await connectDatabase()
    const admin_users_collection = db.collection("admin_users")

    try {
        
        router.get('/admin_users',async(req,res)=>{
            const result = await admin_users_collection.find({}).toArray()
            res.send(result)
        })
        

    } catch (error) {
        console.log(error)

    }
}
run()
module.exports = router

