import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUPPage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1)",
  };
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="bg-white py-20 rounded-lg w-full">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] shadow-lg h-fit w-fit m-auto rounded-xl"
      >
        <div className="text-left mt-10 w-2/4 lg:px-10 mx-auto">
          <p className="text-2xl font-bold">Register Your Account!</p>
          <p className="text-slate-500">For the purpose of industry regulation, your details are required.</p>
        </div>
        <div className="lg:py-10 lg:px-20 w-full flex justify-center">
          <form>
            <div className="flex gap-7">
              <div className="w-full">
                <div>
                  <label className="text-slate-500">Your full name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="fullName"
                    name="fullName"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 23456789"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="phoneNumber"
                    name="phoneNumber"
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
                      Country
                    </option>
                    <option value="test1">Test1</option>
                    <option value="test2">Test2</option>
                  </select>
                </div>
              </div>

              <div className="w-full">
                <div>
                  <label className="text-slate-500">Email Address*</label>
                  <input
                    type="text"
                    placeholder="jhon@gmail.com"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="orderId"
                    name="orderID"
                  />
                </div>
                <div className="mt-4 relative">
                  <label className="text-slate-500">Create Password*</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="password"
                    name="password"
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
                    type="text"
                    placeholder="Enter whatsapp number"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="whatsappNumber"
                    name="whatsappNumber"
                  />
                </div>
              </div>
            </div>

            <div className="w-2/4 mx-auto mt-10">
              <div className="flex items-center gap-3 mb-4">
                <input type="checkbox" defaultChecked={true} className="w-4 h-4 bg-[#8633FF] border-gray-300 rounded-xl" />
                <span className="label-text">I agree to terms & conditions</span>
              </div>
              <button className="bg-[#8633FF] flex py-3 justify-center items-center text-white capitalize rounded-lg w-full">
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
