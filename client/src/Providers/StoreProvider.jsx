import { createContext, useState } from "react";

export const StoreContext = createContext(null)

const StoreProvider = ({ children }) => {
    const [storeDetails, setStoreDetails] = useState(null)
    const [paymentLink, setPaymentLink] = useState(null)
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
            country: ""
        }
    ]);

    const storeInfo = {
        storeDetails,
        setStoreDetails,
        supplierInfoInputList,
        setSupplierInfoInputList,
        additionalPaymentInputList,
        setAdditionalPaymentInputList,
        paymentLink, setPaymentLink
    }

    return (
        <StoreContext.Provider value={storeInfo}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreProvider;