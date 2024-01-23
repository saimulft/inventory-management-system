import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FaSpinner } from 'react-icons/fa';
import { BsCheck2Circle } from 'react-icons/bs';
import { MdErrorOutline } from 'react-icons/md';

export default function SignUPPage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1)",
  };
  const [showPassword, setShowPassword] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newAdmin) => {
      return axios.post('/api/v1/admin_api/admin_signup', newAdmin)
    },
  })
  const handleRegister = async (event) => {
    event.preventDefault()

    const form = event.target;
    const fullName = form.fullName.value;
    const email = form.email.value;
    const password = form.password.value;
    const phone = form.phoneNumber.value;

    const newAdmin = { full_name: fullName, email, phone, password, role: 'Admin' }

    if (password.length < 6) {
      setSuccessMessage('')
      return setRegisterError("Password must be at least 6 characters or longer")
    }

    try {
      const { status } = await mutateAsync(newAdmin)
      if (status === 201) {
        form.reset()
        setRegisterError('')
        setSuccessMessage('We sent a verification link to your email, please check your inbox or spam folder in order to login to your account.')
      }
      else if (status === 200) {
        setSuccessMessage('')
        setRegisterError('Email already exist!')
      }
    } catch (error) {
      setSuccessMessage('')
      setRegisterError('Registration failed!')
      console.log(error)
    }
  }

  return (
    <div className="bg-white py-20 rounded-lg w-full">
      <div style={boxShadowStyle} className="border border-[#8633FF] h-fit w-fit m-auto rounded-xl">

        <div className="relative">{registerError && <p className="absolute left-1/2 transform -translate-x-1/2 w-[calc(100%-26px)] flex gap-1 items-center justify-center text-center mt-3 text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {registerError}</p>}</div>

        <div className="lg:py-20 lg:px-28 p-10 max-w-[700px] w-[600px]">
          <div className="text-left w-full">
            <p className="text-2xl font-bold">Register Your Account!</p>
            <p className="text-slate-500">For the purpose of industry regulation, your details are required.</p>
          </div>
          <hr className="mt-5 mb-7" />
          <form onSubmit={handleRegister}>
            <div className="w-full">
              <div>
                <label className="text-slate-500">Your full name<span className="font-bold text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="fullName"
                  name="fullName"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="text-slate-500">Email Address<span className="font-bold text-rose-500">*</span></label>
                <input
                  type="email"
                  placeholder="jhon@gmail.com"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="email"
                  name="email"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="text-slate-500">Phone Number<span className="font-bold text-rose-500">*</span></label>
                <input
                  type="number"
                  placeholder="+123456789"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                />
              </div>

              <div className="mt-4 relative">
                <label className="text-slate-500">Create Password<span className="font-bold text-rose-500">*</span></label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="password"
                  name="password"
                  required
                />

                <div onClick={() => setShowPassword(!showPassword)} className="absolute top-[45px] right-4 text-sm font-medium cursor-pointer">{showPassword ? 'Hide' : 'Show'}</div>
              </div>
            </div>

            {successMessage && <div className="w-full flex gap-2 items-center justify-center text-center text-sm mt-5 font-medium text-green-600 bg-green-100 border py-2 px-4 rounded">
              <p><BsCheck2Circle size={20} /></p>
              <p className="w-[90%]">{successMessage}</p>
            </div>}

            <div className="w-full mx-auto mt-10">
              <div className="flex items-center gap-3 mb-4">
                <input type="checkbox" defaultChecked={true} className="w-4 h-4 bg-[#8633FF] border-gray-300 rounded-xl" />
                <span className="label-text">I agree to terms & conditions</span>
              </div>
              <button type="submit" disabled={isLoading} className="bg-[#8633FF] flex gap-2 py-3 justify-center items-center text-white rounded-lg w-full">
                {isLoading && <FaSpinner size={20} className="animate-spin" />}
                Register Account
              </button>
              <p className="mt-4 text-start">
                Already have an account?
                <Link to="/login">
                  <span className="cursor-pointer hover:underline text-[#8633FF] ml-2">
                    Login
                  </span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
