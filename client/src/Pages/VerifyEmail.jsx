import axios from "axios";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { MdErrorOutline } from 'react-icons/md';

const VerifyEmail = () => {
    const location = useLocation();
    const [message, setMessage] = useState('')
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [verificationError, setVerificationError] = useState('')

    const handleEmailVerification = () => {
        try {
            setLoading(true)
            axios.get(`/api/v1/authentication_api/verify_email?id=${id}`)
                .then(res => {
                    setLoading(false)
                    if (res.status === 200) {
                        setMessage("Email verification completed! ")
                        setTimeout(() => {
                            navigate('/login')
                        }, 2000)
                    }
                    if (res.status === 203) {
                        setMessage("Email already verified")
                        setTimeout(() => {
                            navigate('/login')
                        }, 2000)
                    }
                })
        } catch (error) {
            setLoading(false)
            setVerificationError('Verification failed!')
            console.log(error)
        }
    }

    return (
        <div className="bg-white py-20 rounded-lg w-full min-h-screen max-h-full flex items-center">
            <div className="border border-[#8633FF] h-fit w-fit m-auto rounded-xl">
                <div className="relative">{verificationError && <p className="absolute left-1/2 transform -translate-x-1/2 w-[calc(100%-26px)] flex gap-1 items-center justify-center text-center mt-3 text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {verificationError}</p>}</div>

                <div className="lg:py-20 lg:px-28 p-10">
                    <h1 className="text-center text-3xl mb-6">Please verify your email</h1>
                    {message && <p className="text-center text-xl font-medium text-green-500 mb-5">{message}</p>}
                    {message && <p className="text-center text-xl font-medium text-green-500 mb-5">Redirecting..</p>}
                    {message ? '' : <button disabled={loading} onClick={handleEmailVerification} className="bg-[#8633FF] flex gap-2 justify-center items-center py-2 text-white capitalize rounded-lg px-5">
                        {loading && <FaSpinner size={20} className="animate-spin" />}
                        Verify Email
                    </button>}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;