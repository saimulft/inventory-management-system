import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const StoreOwnerRoute = ({children}) => {
    const { user } = useAuth();

    if (user.role === 'Admin' || user.role === 'Admin VA' || user.role === 'Store Manager Admin' || user.role === 'Store Manager VA' || user.role === 'Store Owner') {
       return children;
    }

    return <Navigate to="/dashboard/management" replace={true} />
};

export default StoreOwnerRoute;