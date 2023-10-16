import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"
import useAuth from "../hooks/useAuth";
import { FaSpinner } from "react-icons/fa";
import { MdErrorOutline } from 'react-icons/md';

export default function LoginPage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1)",
  };
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (userInfo) => {
      return axios.post('/api/v1/admin_api/user_login', userInfo)
    },
  })
  const handleLogin = async (event) => {
    event.preventDefault()

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const userInfo = { email: email,password: password }

    try {
      const { data, status } = await mutateAsync(userInfo)
      if (status === 200) {
        form.reset()
        setUser(data.data)
        setLoginError('')
        const token = data.token;
        Cookies.set('loginToken', token)
        navigate('/')
      }
    } catch (error) {
      if (error.response.status === 403) {
        return setLoginError('Please verify your email in order to login!')
      }
      if (error.response.status === 401) {
        return setLoginError('Invalid email or password!')
      }
      setLoginError('Authentication failed!')
      console.log(error)
    }
  }


  return (
    <div className="bg-white py-20 rounded-lg w-full min-h-screen max-h-full flex items-center">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] h-fit w-fit m-auto rounded-xl"
      >
        <div className="relative">{loginError && <p className="absolute left-1/2 transform -translate-x-1/2 w-[calc(100%-26px)] flex gap-1 items-center justify-center text-center mt-3 text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {loginError}</p>}</div>
        <div className="lg:py-20 lg:px-28 p-10 max-w-[700px] w-[600px]">
          <form onSubmit={handleLogin}>
            <h4 className="text-xl font-bold">Login Your Account!</h4>
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
               
              />
            </div>
            <div className="flex flex-col mt-4 relative">
              <label className="text-slate-500">Password<span className="font-bold text-rose-500">*</span></label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="input input-bordered input-primary w-full mt-2"
                id="password"
                name="password"
                required
              />

              <div onClick={() => setShowPassword(!showPassword)} className="absolute top-[45px] right-4 text-sm font-medium cursor-pointer">{showPassword ? 'Hide' : 'Show'}</div>
            </div>

            <div onClick={()=>navigate('/reset_password')} className="cursor-pointer hover:underline text-[#8633FF] mt-2.5">
              Forgot your password?
            </div>



            <div className="flex items-center justify-center mt-8 bg-[#8633FF] rounded-lg">
              <button type="submit" disabled={isLoading} className="flex gap-2 py-3 justify-center items-center text-white w-full capitalize ">
                {isLoading && <FaSpinner size={20} className="animate-spin" />}
                Login
              </button>
            </div>
            <p className="mt-4 text-start">
              Don&apos;t have an account?
              <Link to="/signup">
                <span className="cursor-pointer hover:underline text-[#8633FF] ml-2">
                  Register Now
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
