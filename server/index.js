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


const authentication_api = require("./src/routes/authentication_api")
const admin_users_api = require("./src/routes/admin_users_api")
const admin_va_users_api = require("./src/routes/admin_va_users_api")
const store_owner_users_api = require("./src/routes/store_owner_users_api")
const store_manager_admin_users_api = require("./src/routes/store_manager_admin_users_api")
const store_manager_va_users_api = require("./src/routes/store_manager_va_users_api")
const warehouse_admin_users_api = require("./src/routes/warehouse_admin_users_api")
const warehouse_manager_va_users_api = require("./src/routes/warehouse_manager_va_users_api")
const asin_upc_api = require("./src/routes/asin_upc_api")
const pending_arrival_api = require("./src/routes/pending_arrival_api")
const dropdown_data_api = require("./src/routes/dropdown_data_api")
const preparing_form_api = require("./src/routes/preparing_form_api")
const all_stock_api = require("./src/routes/all_stock_api")

app.use('/api/v1/authentication_api',authentication_api)
app.use('/api/v1/admin_api',admin_users_api)
app.use('/api/v1/admin_va_api',admin_va_users_api)
app.use('/api/v1/store_owner_api',store_owner_users_api)
app.use('/api/v1/store_manager_admin_api',store_manager_admin_users_api)
app.use('/api/v1/store_manager_va_api',store_manager_va_users_api)
app.use('/api/v1/warehouse_admin_api',warehouse_admin_users_api)
app.use('/api/v1/warehouse_manager_va_api',warehouse_manager_va_users_api)
app.use('/api/v1/asin_upc_api',asin_upc_api)
app.use('/api/v1/pending_arrival_api',pending_arrival_api)
app.use('/api/v1/dropdown_data_api',dropdown_data_api)
app.use('/api/v1/preparing_form_api',preparing_form_api)
app.use('/api/v1/all_stock_api',all_stock_api)


app.get('/', (req, res) => {

    res.send('inventory Server running')
})

app.listen(PORT, console.log(`Server is running on port: ${PORT}`))