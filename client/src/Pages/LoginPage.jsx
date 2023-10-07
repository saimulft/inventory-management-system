import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import lottieData from "../../public/animation.json";

export default function LoginPage() {
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
          <h3 className="text-3xl font-medium mb-10">Login</h3>
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

            <button className="bg-[#8633FF] flex py-3 justify-center items-center text-white  rounded-lg w-full mt-8 ">
              Login
            </button>
            <p className="mt-4 text-start">
              Don't have an account?
              <Link to="/signup">
                <span className="cursor-pointer text-[#8633FF] ml-2">
                  Signup
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
