import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const VerifyEmail = () => {

    const location = useLocation();
    const [message, setMessage] = useState('')
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const navigate = useNavigate()


    const handleEmailVerification = () => {
        axios.get(`/admin_api/verify_email?id=${id}`)
            .then(res => {
                if (res.status === 200) {

                    return setMessage("Email verification completed!")
                }
               

            })
    }

    return (
        <div className="mt-60">
            <h1 className="text-center text-3xl mb-10">Please verify you email</h1>
            {message && <p className="text-center text-xl mb-3">{message}</p>}
            {message && <button onClick={() => navigate("/login")} className="bg-[#8633FF]  py-2 block mx-auto text-white capitalize rounded-lg px-5">Login Now</button>}
            {message ? '' : <button onClick={handleEmailVerification} className="bg-[#8633FF]  py-2 block mx-auto text-white capitalize rounded-lg px-5">Verify Email</button>}
        </div>
    );
};

export default VerifyEmail;