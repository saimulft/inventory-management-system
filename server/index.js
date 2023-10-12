const express = require("express")
require("dotenv").config()
const PORT = process.env.PORT || 5000
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}))


const admin_users_api = require("./src/routes/admin_users__api")

app.use('/admin_users',admin_users_api)


app.get('/', (req, res) => {
    
    res.send('inventory Server running')
})

app.listen(PORT, console.log(`Server is running on port: ${PORT}`))