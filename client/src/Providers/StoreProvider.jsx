import { createContext, useState } from "react";

export const StoreContext = createContext(null)

const StoreProvider = ({ children }) => {
    const [storeDetails, setStoreDetails] = useState(null)
    const [supplierInfoInputList, setSupplierInfoInputList] = useState([{ supplier_name: "", username: "", password: "" }]);
    const [additionalPaymentInputList, setAdditionalPaymentInputList] = useState([
        {
            email: "",
            card_name: "",
            card_info: "",
            date: "",
            cvc: "",
            billing_address: "",
            city: "",
            state: "",
            zip_code: "",
        }
    ]);

    const storeInfo = {
        storeDetails,
        setStoreDetails,
        supplierInfoInputList,
        setSupplierInfoInputList,
        additionalPaymentInputList,
        setAdditionalPaymentInputList
    }

    // console.log(storeDetails)

    return (
        <StoreContext.Provider value={storeInfo}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreProvider;