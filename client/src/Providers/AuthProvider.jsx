import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const authInfo = { user, setUser, loading }
    const token = Cookies.get('loginToken')

    useEffect(() => {
        try {
            axios.get('/admin_api/get_admin_user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    setLoading(false)
                    if (res.status === 200) {
                        setUser(res.data.data)
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }, [token])

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;