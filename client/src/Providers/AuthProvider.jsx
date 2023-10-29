import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useEffect, useRef, useState } from "react";
import {io} from 'socket.io-client'
 
export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const token = Cookies.get('loginToken')
    
    const socket = useRef()
    
    useEffect(() => {
        socket.current = io('ws://localhost:9000')
    },[])
    
    useEffect(() => {
        axios.get('/api/v1/authentication_api/get_user_profile_data', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (res.data.status === 'success') {
                setUser(res.data.data)
                setLoading(false)
            }
                else if (res.data.status === 'failed') {
                    setLoading(false)
                    setUser(null)
                }
            }).catch((err) => {
                if (err.response?.status === 404 || err.response?.status === 403) {
                    Cookies.remove('loginToken')
                }
                setLoading(false)
            })

        }, [token])
        const authInfo = { user, setUser, loading, socket }

        return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;