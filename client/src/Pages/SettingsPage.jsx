import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function SettingsPage() {
  const [isActiveSetting, setIsActiveSetting] = useState("profile");

  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };

  return (
    <div
      style={boxShadowStyle}
      className="flex flex-col justify-center h-full md:my-16 pt-10 rounded-lg  md:max-w-[80%] mx-auto md:px-20 px-4 bg-white shadow-lg"
    >
      <div className="border-b-2 border-slate-500 w-full flex justify-center items-center">
        <div className="flex mb-6 ">
          <Link to="/dashboard/settings/profile">
            <button
              onClick={() => setIsActiveSetting("profile")}
              className={`border border-r-0 border-[#8633FF] px-2 py-2 text-[#8633FF] rounded-s ${
                isActiveSetting == "profile" && "bg-[#8633FF] text-white"
              }`}
            >
              Profile
            </button>
          </Link>

          <Link to="/dashboard/settings/add-users">
            <button
              onClick={() => setIsActiveSetting("add users")}
              className={`border border-r-0 border-[#8633FF] px-2 py-2 text-[#8633FF] ${
                isActiveSetting == "add users" && "bg-[#8633FF] text-white"
              }`}
            >
              Add Users
            </button>
          </Link>

          <Link to="/dashboard/settings/all-users">
            <button
              onClick={() => setIsActiveSetting("all users")}
              className={`border border-r-0 border-[#8633FF] px-2 py-2 text-[#8633FF] ${
                isActiveSetting == "all users" && "bg-[#8633FF] text-white"
              }`}
            >
              All Users
            </button>
          </Link>

          <Link to="/dashboard/settings/pending-users">
            <button
              onClick={() => setIsActiveSetting("pending users")}
              className={`border border-r-0 border-[#8633FF] px-2 py-2 text-[#8633FF] ${
                isActiveSetting == "pending users" && "bg-[#8633FF] text-white"
              }`}
            >
              Pending Users
            </button>
          </Link>
          <Link to="/dashboard/settings/billing-subscription">
            <button
              onClick={() => setIsActiveSetting("billing and subscription")}
              className={`border  border-[#8633FF] px-2 py-2 text-[#8633FF] rounded-e ${
                isActiveSetting == "billing and subscription" &&
                "bg-[#8633FF] text-white"
              }`}
            >
              Billing & Subscription
            </button>
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}