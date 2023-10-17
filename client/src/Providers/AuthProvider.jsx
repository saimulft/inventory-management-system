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
        axios.get('/api/v1/admin_api/get_admin_user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                // console.log('inside authProvider:', res)
                setLoading(false)
                if (res.status === 200) {
                    setUser(res.data.data)

                    const role = res.data.data.role;
                    axios.get()
                }
            }).catch((err) => {
                if (err.response.status === 404 || err.response.status === 403) {
                    Cookies.remove('loginToken')
                }
                setLoading(false)
            })

    }, [token])

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;