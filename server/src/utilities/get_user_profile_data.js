const connectDatabase = require("../config/connectDatabase")

const getUserProfileData = async (role, email) => {
    const db = await connectDatabase()
    const admin_users_collection = db?.collection("admin_users")
    const admin_va_users_collection = db?.collection("admin_va_users")
    const store_owner_users_collection = db?.collection("store_owner_users")
    const store_manager_admin_users_collection = db?.collection("store_manager_admin_users")
    const warehouse_admin_users_collection = db?.collection("warehouse_admin_users")
    const store_manager_va_users_collection = db?.collection("store_manager_va_users")
    const warehouse_manager_va_users_collection = db?.collection("warehouse_manager_va_users")

    if (role === 'Admin') {
        const result = await admin_users_collection.findOne({ email: email })
        return result;
    }
    else if (role === 'Admin VA') {
        const result = await admin_va_users_collection.findOne({ email: email })
        return result;
    }
    else if (role === 'Store Owner') {
        const result = await store_owner_users_collection.findOne({ email: email })
        return result;
    }
    else if (role === 'Store Manager Admin') {
        const result = await store_manager_admin_users_collection.findOne({ email: email })
        return result;
    }
    else if (role === 'Warehouse Admin') {
        const result = await warehouse_admin_users_collection.findOne({ email: email })
        return result;
    }
    else if (role === 'Store Manager VA') {
        const result = await store_manager_va_users_collection.findOne({ email: email })
        return result;
    }
    else if (role === 'Warehouse Manager VA') {
        const result = await warehouse_manager_va_users_collection.findOne({ email: email })
        return result;
    }
}
module.exports = getUserProfileData;