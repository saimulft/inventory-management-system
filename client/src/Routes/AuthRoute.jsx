import useAuth from '../hooks/useAuth';
import LoadingPage from '../Pages/LoadingPage';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({children}) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingPage />
    }

    if (user) {
        return <Navigate to="/" />;
    }
    return children;
};

export default AuthRoute;