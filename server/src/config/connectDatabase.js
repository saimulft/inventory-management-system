const mongodb = require("mongodb");

const uri = `${process.env.MONGO_URI}`;
const mongoClient = mongodb.MongoClient;
let dbPromise = null;

function connectDB() {
    if (!dbPromise) {
        console.log('Connected to db');
        dbPromise = new Promise(async (resolve, reject) => {
            try {
                const client = await mongoClient.connect(uri);
                const db = client.db("inventory_management_system");
                resolve(db);
            } catch (error) {
                reject(error);
            }
        });
    }
    return dbPromise;
}
async function connectDatabase() {
    try {
        const db = await connectDB();
        return db;
    } catch (error) {
        throw new Error("Error getting database connection: " + error.message);
    }
}
module.exports = connectDatabase;