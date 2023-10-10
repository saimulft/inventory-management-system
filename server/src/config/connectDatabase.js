const mongodb = require("mongodb");

const uri = ``
const mongoClient = mongodb.MongoClient

async function connectDatabase() {
    try {
        const client = await mongoClient.connect(uri)
        return client.db("practice");
    }
    catch (error) {
        
        console.log(error)
    }
}
connectDatabase()

module.exports = connectDatabase
