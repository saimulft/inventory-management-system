import { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import countries from "../Utilities/countries";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FaSpinner } from 'react-icons/fa';
import { BsCheck2Circle} from 'react-icons/bs';
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
    const address = form.address.value;
    const city = form.city.value;
    const state = form.state.value;
    const country = form.country.value;
    const zipCode = form.zipCode.value;
    const whatsappNumber = form.whatsappNumber.value;

    const newAdmin = { admin_id: uuidv4(), full_name: fullName, email, phone, password, role: 'Admin', address, state, country, city, zip: zipCode, whatsapp_number: whatsappNumber }

    if(password.length < 6){
      setSuccessMessage('')
      return setRegisterError("Password must be at least 6 character")
    }

    try {
      const { status } = await mutateAsync(newAdmin)
      if (status === 201) {
        form.reset()
        setRegisterError('')
        setSuccessMessage('We sent a verification link to your email, please check your inbox or spam folder in order to login to your account.')
      }
      else if(status === 200){
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
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] h-fit w-fit m-auto rounded-xl"
      >
        <div className="mb-3 px-3">{registerError && <p className="flex gap-1 items-center justify-center text-center mt-3 text-sm font-medium text-rose-500 bg-rose-100 py-2 px-4 rounded"><MdErrorOutline size={20} /> {registerError}</p>}</div>
        <div className="text-left mt-10 w-2/4 lg:px-10 mx-auto">
          <p className="text-2xl font-bold">Register Your Account!</p>
          <p className="text-slate-500">For the purpose of industry regulation, your details are required.</p>
        </div>
        <div className="lg:py-10 lg:px-20 w-full flex justify-center">
          <form onSubmit={handleRegister}>
            <div className="flex gap-7">
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

                <div className="mt-4">
                  <label className="text-slate-500">Address</label>
                  <input
                    type="text"
                    placeholder="Street Address, P.O.Box, apartment, suit, building, floor"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="address"
                    name="address"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">State</label>
                  <input
                    type="text"
                    placeholder="Enter state"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="state"
                    name="state"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Country</label>
                  <select
                    className="select select-primary w-full mt-2 shadow-lg"
                    name="country"
                    id="country"
                  >
                    <option disabled selected>
                      Select your country
                    </option>
                    {countries}
                  </select>
                </div>
              </div>

              <div className="w-full">
                <div>
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

                <div className="mt-4">
                  <label className="text-slate-500">City</label>
                  <input
                    type="text"
                    placeholder="Enter your city"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="city"
                    name="city"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="Enter zip code"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="zipCode"
                    name="zipCode"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">WhatsApp</label>
                  <input
                    type="number"
                    placeholder="Enter whatsapp number"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="whatsappNumber"
                    name="whatsappNumber"
                  />
                </div>
              </div>
            </div>
            <div>{successMessage && <p className="w-full flex gap-2 items-center justify-center text-center text-sm mt-5 font-medium text-green-600 bg-green-100 border py-2 px-4 rounded">
              <BsCheck2Circle size={20} /> {successMessage}</p>}</div>
            <div className="w-2/4 mx-auto mt-10">
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
