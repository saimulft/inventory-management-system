import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({children}) => {
    const { user } = useAuth();

    if (user.role === 'Admin' || user.role === 'Admin VA') {
       return children;
    }

    return <Navigate to="/dashboard/management" replace={true} />
};

export default AdminRoute;