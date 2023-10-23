import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { GlobalContext } from "../Providers/GlobalProviders";
import useAuth from "../hooks/useAuth";

export default function SettingsPage() {
  const { setIsActiveSetting, isActiveSetting } = useContext(GlobalContext);
  const { user } = useAuth()
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };

  return (
    <div
      style={boxShadowStyle}
      className="flex flex-col justify-center h-full my-16 pt-10 rounded-lg  max-w-[80%] mx-auto px-20  bg-white shadow-lg"
    >
      <div className="border-b-2 border-slate-500 w-full flex justify-center items-center">
        <div className="flex mb-6 ">
          <Link to="/dashboard/settings/profile">
            <button
              onClick={() => setIsActiveSetting("profile")}
              className={`border border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] rounded-s ${isActiveSetting == "profile" && "bg-[#8633FF] text-white"
                }`}
            >
              Profile
            </button>
          </Link>

          {
            user?.role === 'Admin' || user?.role === 'Admin VA' || user?.role === 'Store Manager Admin' || user?.role === 'Warehouse Admin' ?
              <Link to="/dashboard/settings/add-users">
                <button
                  onClick={() => setIsActiveSetting("add-users")}
                  className={`border border-l-0 border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] ${isActiveSetting == "add-users" && "bg-[#8633FF] text-white"
                    }`}
                >
                  Add Users
                </button>
              </Link> : ''
          }

          {
            user?.role === 'Admin' || user?.role === 'Admin VA' || user?.role === 'Store Manager Admin' || user?.role === 'Warehouse Admin' ?
              <Link to="/dashboard/settings/all-users">
                <button
                  onClick={() => setIsActiveSetting("all-users")}
                  className={`border border-l-0 border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] ${isActiveSetting == "all-users" && "bg-[#8633FF] text-white"
                    }`}
                >
                  All Users
                </button>
              </Link> : ''
          }

          {/* <Link to="/dashboard/settings/pending-users">
            <button
              onClick={() => setIsActiveSetting("pending-users")}
              className={`border border-r-0 border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] ${
                isActiveSetting == "pending-users" && "bg-[#8633FF] text-white"
              }`}
            >
              Pending Users
            </button>
          </Link> */}

          {
            user?.role === 'Super Admin' &&
            <Link to="/dashboard/settings/all-admin-users">
              <button
                onClick={() => setIsActiveSetting("all-admin-users")}
                className={`border border-r-0 border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] ${isActiveSetting == "all-admin-users" && "bg-[#8633FF] text-white"
                  }`}
              >
                Admin Users
              </button>
            </Link>
          }

          {
            user?.role === 'Admin' || user?.role === 'Store Owner' ?
              <Link to="/dashboard/settings/billing-subscription">
                <button
                  onClick={() => setIsActiveSetting("billing-subscription")}
                  className={`border border-l-0  border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] rounded-e ${isActiveSetting == "billing-subscription" &&
                    "bg-[#8633FF] text-white"
                    }`}
                >
                  Billing & Subscription
                </button>
              </Link> : ''
          }
        </div>
      </div>
      <Outlet />
    </div>
  );
}
