import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import lottieData from "../../public/animation.json";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function SignUPPage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1)",
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        style={boxShadowStyle}
        className="flex items-center w-1/2 rounded-xl"
      >
        <Lottie animationData={lottieData} loop={true} />
        <div className="bg-white  w-[500px] text-center px-8 py-10 rounded-xl">
          <h3 className="text-3xl font-medium mb-8">Sign Up</h3>
          <form>
            <div className="flex flex-col mt-4">
              <label htmlFor="" className="text-start mb-2 text-gray-500">
                Email
              </label>
              <input
                type="text"
                placeholder="Enter your email"
                className="input input-bordered input-primary w-full max-w-full"
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="" className="text-start mb-2 text-gray-500">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered input-primary w-full max-w-full"
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="" className="text-start mb-2 text-gray-500">
                Confirm password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered input-primary w-full max-w-full"
              />
            </div>

            <button className="bg-[#8633FF] flex py-3 justify-center items-center text-white  rounded-lg w-full mt-8 ">
              Sign up
            </button>
            <p className="mt-4 text-start">
              Already have an account?
              <Link to="/login">
                <span className="cursor-pointer text-[#8633FF] ml-2">
                  Login
                </span>
              </Link>
            </p>
            <div className="divider">OR</div>
            <div className="flex gap-3 justify-center items-center">
              <FcGoogle className="cursor-pointer" size={25} />
              <FaFacebook className="text-blue-500 cursor-pointer" size={25} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
