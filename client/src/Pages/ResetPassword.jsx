import axios from "axios";
import { useState } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";


const ResetPassword = () => {

    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [loginError, setLoginError] = useState('')

    const handleForgotPassword = () => {

        if (!email) {
            setSuccessMessage("")
            setLoginError('You must provide your email to reset your password.')
            return;
        }

        try {
            setIsLoading(true)
            axios.get(`/api/v1/authentication_api/send_reset_password_email?email=${email}`)
                .then(res => {
                    if (res.status === 200) {
                        setEmail("")
                        setIsLoading(false)
                        setLoginError("")
                        setSuccessMessage(`We sent a password reset link to ${email}, please check your inbox or spam folder in order to reset your password.`)
                    }
                    if (res.status === 203) {
                        setIsLoading(false)
                        setLoginError('User account not found by this email!')
                        setSuccessMessage('')
                        setIsLoading(false)
                    }

                })
        } catch (error) {

            setLoginError('User account not found by this email!')
            setSuccessMessage('')
            setIsLoading(false)

        }
    }

    return (
        <div className="bg-white py-20 rounded-lg w-full min-h-screen max-h-full flex items-center">
            <div className="border border-[#8633FF] h-fit w-fit m-auto rounded-xl">
                <div className="lg:py-20 lg:px-28 p-10 max-w-[700px] w-[600px]">
                    <h4 className="text-xl font-bold">Enter your email to reset your password</h4>
                    <p className="text-slate-400">
                        For the purpose of industry regulation, your <br /> details are required.
                    </p>
                    <hr className="mt-5 mb-7" />
                    <div className="flex flex-col mt-4">
                        <label className="text-slate-500">Email<span className="font-bold text-rose-500">*</span></label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            className="input input-bordered input-primary w-full mt-2"
                            id="email"
                            name="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />

                        <div>
                            {successMessage && <p className="w-full flex gap-2 items-center justify-center text-center text-sm mt-5 font-medium text-green-600 bg-green-100 border py-2 px-4 rounded">
                            <BsCheck2Circle size={50} /> {successMessage}</p>}
                            {loginError && <p className="flex gap-2 justify-center items-center mt-3 text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={24} /> {loginError}</p>}
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-8 bg-[#8633FF] rounded-lg">
                        <button onClick={handleForgotPassword} disabled={isLoading} className="flex gap-2 py-3 justify-center items-center text-white w-full capitalize ">
                            {isLoading && <FaSpinner size={20} className="animate-spin" />}
                            Reset Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;