import { useContext } from "react";
import { StoreContext } from "../Providers/StoreProvider";

const useStore = () => {
    const storeInfo = useContext(StoreContext)
    return storeInfo;
};

export default useStore;