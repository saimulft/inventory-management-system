const mongodb = require("mongodb");

const uri = `${process.env.MONGO_URI}`
const mongoClient = mongodb.MongoClient

async function connectDatabase() {
    try {
        const client = await mongoClient.connect(uri)
        return client.db("inventory_management_system");
    }
    catch (error) {
<<<<<<< HEAD
        
=======

>>>>>>> 2e9db3508a05cd7365c8a78178db439779237df8
        console.log(error)
    }
}
connectDatabase()

module.exports = connectDatabase
