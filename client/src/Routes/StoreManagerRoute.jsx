import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const StoreManagerRoute = ({children}) => {
    const { user } = useAuth();

    if (user.role === 'Admin' || user.role === 'Admin VA' || user.role === 'Store Manager Admin' || user.role === 'Store Manager VA') {
       return children;
    }

    if(user.role === 'Store Owner'){
        return <Navigate to="/dashboard/profit-tracker" replace={true} />
    }

    return <Navigate to="/dashboard/management" replace={true} />
};

export default StoreManagerRoute;