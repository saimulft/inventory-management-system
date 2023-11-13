import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js"
export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const authInfo = { user, setUser, loading }

    const decryptToken = (encryptedToken, secretKey) => {
        try {
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
            const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
            return decryptedToken;
        } catch (error) {
            return undefined;
        }
    };

    const encryptedTokenFromCookie = Cookies.get('imstoken');
    const token = decryptToken(encryptedTokenFromCookie, "e74cca3d65c871d49a7508bac94a1a4c41b843528411a5823b04d5921d2bf6e0b016164cssdf");

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
                    Cookies.remove('imstoken')
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