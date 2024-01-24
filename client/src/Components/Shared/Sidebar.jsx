import { AiOutlinePieChart } from "react-icons/ai";
import { PiWarehouseDuotone } from "react-icons/pi";
import { GiProgression } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";
import { RiMenuFoldFill } from "react-icons/ri";
import { BsHouseCheck, BsPlusCircle } from "react-icons/bs";
import { useContext } from "react";
import { GlobalContext } from "../../Providers/GlobalProviders";
import { NavLink, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Cookies from "js-cookie";
import useStore from "../../hooks/useStore";

export default function Sidebar() {
  const { setStoreDetails } = useStore()
  const { user, setUser } = useAuth()  
  const { isSidebarOpen, setIsSidebarOpen } = useContext(GlobalContext);
  const {pathname} = useLocation();

  const handleLogout = () => {
    Cookies.remove('imstoken')
    setUser(null)
  }

  return (
    <div className={`sticky bottom-0 top-0 pt-5 bg-[#2e2e30] h-screen `}>
      <div className="flex flex-col w-full lg:h-[calc(100vh-6%)] md:h-[calc(100vh-5%)] items-center relative px-8">
        {/* top part of the slider  */}
        <div>
          <div className="mb-10 w-fit">
            <div
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
              }}
              className={`transition-all duration-500 ${isSidebarOpen ? "rotate-0" : "rotate-180 "
                } flex justify-center items-center cursor-pointer rounded bg-[#3f3f41] `}
            >
              <div
                className={`${isSidebarOpen ? "bg-[#8633FF]" : "text-gray-400"
                  } text-white ps-3 pe-3 py-[10px] border-b border-[#38383c] rounded`}
              >
                <RiMenuFoldFill size={24} />
              </div>
            </div>
          </div>

          {
            user?.role === 'Admin' || user?.role === 'Admin VA' ?
              <>
                <NavLink
                  to="/dashboard/home"
                  className={({ isActive }) =>
                    isActive
                      ? `bg-[#8633FF] text-white rounded ps-3 pe-3 my-2 ${isSidebarOpen ? "w-56" : ""
                      } py-[10px] border-b border-[#3e3e41] flex items-center gap-2 text-sm rounded-t`
                      : `text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 ps-3 ${isSidebarOpen ? "w-56" : ""
                      } pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm rounded-t`
                  }
                >
                  <AiOutlinePieChart size={24} />
                  {isSidebarOpen && <p>Dashboard</p>}
                </NavLink>

                <NavLink
                  to="/dashboard/management"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] my-2 border-b border-[#38383c] flex items-center gap-2 text-sm"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
                  }
                >
                  <PiWarehouseDuotone size={24} />
                  {isSidebarOpen && <p>Management</p>}
                </NavLink>

                <NavLink
                  to="/dashboard/all-stores"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
                  }
                >
                  <BsHouseCheck size={24} />
                  {isSidebarOpen && <p>All Stores</p>}
                </NavLink>

                <NavLink
                  to="/dashboard/add-store"
                  onClick={() => setStoreDetails(null)}
                  className={({ isActive }) =>
                    isActive
                      ? `${isSidebarOpen ? 'ml-[20px]' : ''} bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm`
                      : `${isSidebarOpen ? 'ml-[20px]' : ''} text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm`
                  }
                >
                  <BsPlusCircle size={22} />
                  {isSidebarOpen && <p>Add Store</p>}
                </NavLink>

                <NavLink
                  to="/dashboard/profit-tracker"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
                  }
                >
                  <GiProgression size={24} />
                  {isSidebarOpen && <p>Profit Tracker</p>}
                </NavLink>

                <NavLink
                  to="/dashboard/pending-arrival-from"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
                  }
                >
                  <GoChecklist size={24} />
                  {isSidebarOpen && (
                    <p className="whitespace-nowrap">Pending Arrival Form </p>
                  )}
                </NavLink>

                <NavLink
                  to="/dashboard/sales-form"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm rounded-b"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm  rounded-b"
                  }
                >
                  <GoChecklist size={24} />
                  {isSidebarOpen && (
                    <p className="whitespace-nowrap">Sales Form</p>
                  )}
                </NavLink>

                <NavLink
                  to="/dashboard/preparing-request-from"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
                  }
                >
                  <GoChecklist size={24} />
                  {isSidebarOpen && (
                    <p className="whitespace-nowrap">Preparing Request Form </p>
                  )}
                </NavLink>

                <NavLink
                  to="/dashboard/add-ASIN-UPC-from"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm rounded-b"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm  rounded-b"
                  }
                >
                  <GoChecklist size={24} />
                  {isSidebarOpen && (
                    <p className="whitespace-nowrap">Add ASIN/UPC Form </p>
                  )}
                </NavLink>

              </> : ''
          }

          {
            user?.role === 'Store Owner' &&
            <NavLink
              to="/dashboard/profit-tracker"
              className={({ isActive }) =>
                isActive
                  ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm"
                  : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
              }
            >
              <GiProgression size={24} />
              {isSidebarOpen && <p>Profit tracker</p>}
            </NavLink>
          }

          {
            user?.role === 'Store Manager Admin' || user?.role === 'Store Manager VA' ?
              <>
                <NavLink
                  to="/dashboard/management"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
                  }
                >
                  <PiWarehouseDuotone size={24} />
                  {isSidebarOpen && <p>Management</p>}
                </NavLink>

                <NavLink
                  to="/dashboard/profit-tracker"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
                  }
                >
                  <GiProgression size={24} />
                  {isSidebarOpen && <p>Profit tracker</p>}
                </NavLink>

                <NavLink
                  to="/dashboard/pending-arrival-from"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
                  }
                >
                  <GoChecklist size={24} />
                  {isSidebarOpen && (
                    <p className="whitespace-nowrap">Pending Arrival Form </p>
                  )}
                </NavLink>

                <NavLink
                  to="/dashboard/sales-form"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm rounded-b"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm  rounded-b"
                  }
                >
                  <GoChecklist size={24} />
                  {isSidebarOpen && (
                    <p className="whitespace-nowrap">Sales Form</p>
                  )}
                </NavLink>

                <NavLink
                  to="/dashboard/preparing-request-from"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
                  }
                >
                  <GoChecklist size={24} />
                  {isSidebarOpen && (
                    <p className="whitespace-nowrap">Preparing Request Form </p>
                  )}
                </NavLink>

                <NavLink
                  to="/dashboard/add-ASIN-UPC-from"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm rounded-b"
                      : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm  rounded-b"
                  }
                >
                  <GoChecklist size={24} />
                  {isSidebarOpen && (
                    <p className="whitespace-nowrap">Add ASIN/UPC Form </p>
                  )}
                </NavLink>
              </> : ''
          }

          {
            user?.role === 'Warehouse Admin' || user?.role === 'Warehouse Manager VA' ?
              <NavLink
                to="/dashboard/management"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm"
                    : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
                }
              >
                <PiWarehouseDuotone size={24} />
                {isSidebarOpen && <p>Management</p>}
              </NavLink> : ''
          }
        </div>

        {/* bottom part of the slider  */}
        {/* <div className="flex flex-col justify-between w-full h-[calc(100vh-100px)] items-center mt-10 relative">
          <div className={`absolute bottom-0`}>
            <NavLink
              to="/dashboard/support"
              className={({ isActive }) =>
                isActive
                  ? `bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm rounded-t ${isSidebarOpen ? "w-56" : ""
                  }`
                  : `text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm rounded-t ${isSidebarOpen ? "w-56" : ""
                  }`
              }
            >
              <BiSupport size={24} />
              {isSidebarOpen && <p className="whitespace-nowrap">Support</p>}
            </NavLink>
            <NavLink
              to="/dashboard/settings/profile"
              className={`${pathname?.includes("settings")
                ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm"
                : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm"
                }`}
            >
              <AiOutlineSetting size={24} />
              {isSidebarOpen && <p className="whitespace-nowrap">Settings</p>}
            </NavLink>

            {user ? <div onClick={handleLogout} className="text-gray-400 cursor-pointer hover:bg-[#3f3f41] transition-all duration-100 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm rounded-b">
              <BiLogOut size={24} />
              {isSidebarOpen && <p className="whitespace-nowrap">Logout</p>}</div>
              : <NavLink to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#8633FF] text-white rounded ps-3 pe-3 py-[10px] border-b my-2 border-[#38383c] flex items-center gap-2 text-sm rounded-b"
                    : "text-gray-400 hover:bg-[#3f3f41] transition-all duration-100 my-2 hover:text-gray-100 ps-3 pe-3 py-[10px] border-b border-[#38383c] flex items-center gap-2 text-sm rounded-b"
                }
              >
                <BiLogIn size={24} />
                {isSidebarOpen && <p className="whitespace-nowrap">Login</p>}
              </NavLink>}
          </div>
        </div> */}
      </div>
    </div>
  );
}
