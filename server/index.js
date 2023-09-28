import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@nabil-database-test-k132-481a4602.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=nabil-database-test-k132&tls=true`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log('listen to port, ', port);
})