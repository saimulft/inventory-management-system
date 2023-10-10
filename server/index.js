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

const user_api = require("./src/routes/user_api")

app.use('/user', user_api)


app.get('/', (req, res) => {
    res.send('Server running')
})

app.listen(PORT, console.log(`Server is running on port: ${PORT}`))