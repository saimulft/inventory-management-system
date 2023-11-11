import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";

const useAuth = () => {
    const authInfo = useContext(AuthContext)
    return authInfo;
};

export default useAuth;