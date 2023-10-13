import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1)",
  };
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (event) => {
    event.preventDefault()

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const adminInfo = { email, password }
    console.log(adminInfo)
  }

  return (
    <div className="bg-white py-20 rounded-lg w-full min-h-screen max-h-full flex items-center">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] h-fit w-fit m-auto rounded-xl"
      >
        <div className="lg:py-20 lg:px-28 p-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-xl font-bold">Login Your Account!</h4>
            <p className="text-slate-400">
              For the purpose of industry regulation, your <br /> details are required.
            </p>
            <hr className="mt-5 mb-7" />
            <div className="flex flex-col mt-4">
              <label className="text-slate-500">Email*</label>
              <input
                type="text"
                placeholder="Enter email address"
                className="input input-bordered input-primary w-full max-w-xs mt-2"
                id="email"
                name="email"
              />
            </div>
            <div className="flex flex-col mt-4 relative">
              <label className="text-slate-500">Password*</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="input input-bordered input-primary w-full max-w-xs mt-2"
                id="password"
                name="password"
              />

              <div onClick={() => setShowPassword(!showPassword)} className="absolute top-[45px] right-4 text-sm font-medium cursor-pointer">{showPassword ? 'Hide' : 'Show'}</div>
            </div>

            <div className="cursor-pointer hover:underline text-[#8633FF] mt-2.5">
              Forgot your password?
            </div>

            <div className="flex items-center justify-center mt-8 bg-[#8633FF] rounded-lg">
              <button type="submit" className=" flex py-3 justify-center items-center text-white w-full capitalize ">
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
