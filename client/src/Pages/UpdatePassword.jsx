import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";


const UpdatePassword = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');


    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: (passowrd) => {
            return axios.post('/admin_api/reset_password', passowrd)
        },
    })
    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            return setErrorMessage("Passowrd does not match")
        }
        if (newPassword.length < 6 || confirmPassword.length < 0) {
            return setErrorMessage("Password must should be 6 character or above")
        }

        try {
            const { status } = await mutateAsync({ newPassword, id })
            if (status === 200) {
                setSuccessMessage("Password reset successful")
                setErrorMessage("")
                setConfirmPassword("")
                setNewPassword("")
                setTimeout(() => {
                    navigate('/login')
                }, 2500)
            }
            if (status === 203) {
                setSuccessMessage("")
                setErrorMessage("User not found")
            }

        } catch (error) {

            console.log(error)
        }

    }
    const navigate = useNavigate()
    return (

        <div className="bg-white py-20 rounded-lg w-full min-h-screen max-h-full flex items-center">
            <div

                className="border border-[#8633FF] h-fit w-fit m-auto rounded-xl"
            >

                <div className="lg:py-20 lg:px-28 p-10 max-w-[700px] w-[600px]">

                    <h4 className="text-xl font-bold">Enter your new passowrd</h4>

                    <hr className="mt-5 mb-7" />

                    <div className="flex flex-col mt-4">
                        <label className="text-slate-500">New password<span className="font-bold text-rose-500">*</span></label>
                        <input
                            type="password"
                            placeholder="Enter email address"
                            className="input input-bordered input-primary w-full mt-2"
                            id="new_passowrd"
                            name="new_passowrd"
                            onChange={(e) => setNewPassword(e.target.value)}

                        />
                        <label className="text-slate-500 mt-4">Confirm password<span className="font-bold text-rose-500">*</span></label>
                        <input
                            type="password"
                            placeholder="Enter email address"
                            className="input input-bordered input-primary w-full  mt-2"
                            id="confirm_password"
                            name="confirm_password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div>{successMessage &&
                            <p className="w-full flex gap-2 items-center justify-center text-center text-sm mt-5 font-medium text-green-600 bg-green-100 border py-2 px-4 rounded"><BsCheck2Circle size={28} /> {successMessage}</p>}
                            {successMessage &&  <p className="text-center text-sm mt-5 font-medium text-green-600">Redirecting to login page..</p>}
                            <div className="relative">{errorMessage && <p className="   flex gap-1 items-center justify-center text-center mt-3 text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {errorMessage}</p>} </div>

                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-8 bg-[#8633FF] rounded-lg">

                        {!successMessage && <button onClick={handleUpdatePassword} disabled={isLoading} className="flex gap-2 py-3 justify-center items-center text-white w-full capitalize ">
                            {isLoading && <FaSpinner size={20} className="animate-spin" />}
                            Reset Password
                        </button>}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;