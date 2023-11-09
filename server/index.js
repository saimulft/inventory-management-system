const express = require("express")
require("dotenv").config()
const PORT = process.env.PORT || 5000
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}))


const global_api = require("./src/routes/global_api")
const authentication_api = require("./src/routes/authentication_api")
const admin_users_api = require("./src/routes/admin_users_api")
const admin_va_users_api = require("./src/routes/admin_va_users_api")
const store_owner_users_api = require("./src/routes/store_owner_users_api")
const store_manager_admin_users_api = require("./src/routes/store_manager_admin_users_api")
const store_manager_va_users_api = require("./src/routes/store_manager_va_users_api")
const warehouse_admin_users_api = require("./src/routes/warehouse_admin_users_api")
const warehouse_manager_va_users_api = require("./src/routes/warehouse_manager_va_users_api")
const store_api = require("./src/routes/store_api")
const asin_upc_api = require("./src/routes/asin_upc_api")
const pending_arrival_api = require("./src/routes/pending_arrival_api")
const dropdown_data_api = require("./src/routes/dropdown_data_api")
const preparing_form_api = require("./src/routes/preparing_form_api")
const all_stock_api = require("./src/routes/all_stock_api")
const ready_to_ship_api = require("./src/routes/ready_to_ship_api")
const missing_arrival_api = require("./src/routes/missing_arrival_api")
const out_of_stock_api = require("./src/routes/out_of_stock_api")
const shipped_api = require("./src/routes/shipped_data")
const warehouse_api = require("./src/routes/warehouse_api")
const profit_tracker_api = require("./src/routes/profit_tracker_api")
const conversations_api = require("./src/routes/conversation_api")


app.use('/api/v1/conversations_api', conversations_api)
app.use('/api/v1/global_api', global_api)
app.use('/api/v1/authentication_api', authentication_api)
app.use('/api/v1/admin_api', admin_users_api)
app.use('/api/v1/admin_va_api', admin_va_users_api)
app.use('/api/v1/store_owner_api', store_owner_users_api)
app.use('/api/v1/store_manager_admin_api', store_manager_admin_users_api)
app.use('/api/v1/store_manager_va_api', store_manager_va_users_api)
app.use('/api/v1/warehouse_admin_api', warehouse_admin_users_api)
app.use('/api/v1/warehouse_manager_va_api', warehouse_manager_va_users_api)
app.use('/api/v1/store_api', store_api)
app.use('/api/v1/asin_upc_api', asin_upc_api)
app.use('/api/v1/pending_arrival_api', pending_arrival_api)
app.use('/api/v1/dropdown_data_api', dropdown_data_api)
app.use('/api/v1/preparing_form_api', preparing_form_api)
app.use('/api/v1/all_stock_api', all_stock_api)
app.use('/api/v1/ready_to_ship_api', ready_to_ship_api)
app.use('/api/v1/missing_arrival_api', missing_arrival_api)
app.use('/api/v1/out_of_stock_api', out_of_stock_api)
app.use('/api/v1/shipped_api', shipped_api)
app.use('/api/v1/warehouse_api', warehouse_api)
app.use('/api/v1/profit_tracker_api', profit_tracker_api)



app.get('/', (req, res) => {

    res.send('inventory Server running')
})

app.listen(PORT, console.log(`Server is running on port: ${PORT}`))