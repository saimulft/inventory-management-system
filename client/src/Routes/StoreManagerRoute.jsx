import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const StoreManagerRoute = ({children}) => {
    const { user } = useAuth();

    if (user.role === 'Admin' || user.role === 'Admin VA' || user.role === 'Store Manager Admin' || user.role === 'Store Manager VA') {
       return children;
    }

    return <Navigate to="/dashboard/management" replace={true} />
};

export default StoreManagerRoute;