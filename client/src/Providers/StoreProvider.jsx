import { createContext, useState } from "react";

export const StoreContext = createContext(null)

const StoreProvider = ({children}) => {
    const [storeDetails, setStoreDetails] = useState(null)

    const storeInfo = {
        storeDetails,
        setStoreDetails
    }

    console.log(storeDetails)

    return (
        <StoreContext.Provider value={storeInfo}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreProvider;