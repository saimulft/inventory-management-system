const express = require("express")
require("dotenv").config()
const PORT = process.env.PORT || 5000
const app = express()
const cors = require("cors")


app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true,limit:'5mb'}))

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}))


const admin_users_api = require("./src/routes/admin_users_api")
const admin_va_users_api = require("./src/routes/admin_va_users_api")
const asin_upc_api = require("./src/routes/asin_upc_api")

app.use('/admin_api',admin_users_api)
app.use('/admin_va_api',admin_va_users_api)
app.use('/asin_upc_api',asin_upc_api)


app.get('/', (req, res) => {

    res.send('inventory Server running')
})

app.listen(PORT, console.log(`Server is running on port: ${PORT}`))