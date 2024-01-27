import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth()
  const boxShadowStyle = { boxShadow: "2px 2px 22px 2px rgba(0,0,0,0.2)"};
  const { pathname } = useLocation();

  return (
    <div
      style={boxShadowStyle}
      className="flex flex-col justify-center h-full my-16 pt-10 rounded-lg  max-w-[80%] mx-auto px-20  bg-white shadow-lg"
    >
      <div className="border-b-2 border-slate-500 w-full flex justify-center items-center">
        <div className="flex mb-6 rounded overflow-hidden">
          <Link to="/dashboard/settings/profile">
            <button
              className={`border border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] rounded-s ${pathname?.includes("profile") && "bg-[#8633FF] text-white"
                }`}
            >
              Profile
            </button>
          </Link>

          {
            user?.role === 'Admin' || user?.role === 'Admin VA' || user?.role === 'Store Manager Admin' || user?.role === 'Warehouse Admin' ?
              <Link to="/dashboard/settings/add-users">
                <button
                  className={`border border-l-0 border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] ${pathname?.includes("add-users") && "bg-[#8633FF] text-white"
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
                  className={`border border-l-0 border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] ${pathname?.includes("all-users") && "bg-[#8633FF] text-white"
                    }`}
                >
                  All Users
                </button>
              </Link> : ''
          }

          {/* <Link to="/dashboard/settings/pending-users">
            <button
              className={`border border-r-0 border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] ${
                pathname?.includes("pending-users") && "bg-[#8633FF] text-white"
              }`}
            >
              Pending Users
            </button>
          </Link> */}

          {
            user?.role === 'Super Admin' &&
            <Link to="/dashboard/settings/all-admin-users">
              <button
                className={`border border-r-0 border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] ${pathname?.includes("all-admin-users") && "bg-[#8633FF] text-white"
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
                  className={`border border-l-0  border-[#8633FF] px-4 py-2 font-medium text-[#8633FF] rounded-e ${pathname?.includes("billing-subscription") &&
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
