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
        axios.get('/api/v1/authentication_api/get_user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    const email = res.data.data.email;
                    const role = res.data.data.role;

                    axios.get(`/api/v1/authentication_api/get_user_profile_data?email=${email}&role=${role}`)
                        .then(res => {
                            setUser(res.data.data)
                            setLoading(false)
                        })
                }
                else if (res.data.status === 'failed') {
                    setLoading(false)
                    setUser(null)
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