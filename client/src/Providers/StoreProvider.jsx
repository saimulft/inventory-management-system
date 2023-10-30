import { createContext, useState } from "react";

export const StoreContext = createContext(null)

const StoreProvider = ({ children }) => {
    const [storeDetails, setStoreDetails] = useState(null)
    const [supplierInfoInputList, setSupplierInfoInputList] = useState([{ supplierName: "", userId: "", password: "" }]);
    const [additionalPaymentInputList, setAdditionalPaymentInputList] = useState([
        {
            email: "",
            cardName: "",
            cardInfo: "",
            date: "",
            cvc: "",
            billingAddress: "",
            city: "",
            state: "",
            zipCode: "",
        },
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