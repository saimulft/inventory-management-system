import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if(loading){
        return <div className='h-screen w-full flex items-center justify-center'>Loading..</div>
    }

    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;