import LoadingPage from '../Pages/LoadingPage';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingPage />
    }

    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;