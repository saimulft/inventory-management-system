import { AiOutlineMessage, AiOutlineSearch } from "react-icons/ai";
import { BsBell } from "react-icons/bs";
import { AiOutlinePieChart, AiOutlineSetting } from "react-icons/ai";
import { PiWarehouseDuotone } from "react-icons/pi";
import { GiProgression } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";
import { BiSupport } from "react-icons/bi";
import { RxExit } from "react-icons/rx";
import { RiMenuFoldFill } from "react-icons/ri";
import { BsHouseCheck, BsPlusCircle } from "react-icons/bs";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex items-center md:px-8 ps-3 pe-3 bg-[#2e2e30] text-white shadow-sm py-3">
      <div className="flex items-center gap-2 z-50">
        <div className="drawer md:hidden">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer"
              className={`transition-all duration-500 rotate-180 flex justify-end cursor-pointer`}
            >
              <div
                className={`bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md`}
              >
                <RiMenuFoldFill size={25} />
              </div>
            </label>
          </div>
          <div className="drawer-side z-50">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu pt-5 bg-[#2e2e30] text-base-content z-50">
              <div className="flex flex-col justify-between px-3 h-screen z-50">
                <div className={`space-y-2 z-50`}>
                  <div className="drawer-content">
                    {/* Page content here */}
                    <label
                      htmlFor="my-drawer"
                      className={`transition-all duration-500 rotate-0 flex justify-start cursor-pointer mb-5`}
                    >
                      <div
                        className={`bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md`}
                      >
                        <RiMenuFoldFill size={25} />
                      </div>
                    </label>
                  </div>
                  <div className="w-full relative">
                    <div className="form-control w-full">
                      <div className="input-group w-full">
                        <input
                          type="text"
                          placeholder="Search…"
                          className="input input-bordered w-full"
                        />
                        <button className="btn btn-square">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <NavLink
                    to="/dashboard/home"
                    className={({ isActive }) =>
                      isActive
                        ? `bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2`
                        : `bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2`
                    }
                  >
                    <AiOutlinePieChart size={20} />
                    <p>Dashboard</p>
                  </NavLink>

                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                        : "bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                    }
                  >
                    <PiWarehouseDuotone size={20} />
                    <p>Management</p>
                  </NavLink>

                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                        : "bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                    }
                  >
                    <BsHouseCheck size={20} />
                    <p>All stores</p>
                  </NavLink>

                  <NavLink
                    to="/dashboard/add-store"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                        : "bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                    }
                  >
                    <BsPlusCircle size={20} />
                    <p>Add store</p>
                  </NavLink>

                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                        : "bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                    }
                  >
                    <GiProgression size={20} />
                    <p>Profit tracker</p>
                  </NavLink>

                  <NavLink
                    to="/dashboard/pending-arrival-from"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                        : "bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                    }
                  >
                    <GoChecklist size={20} />
                    <p className="whitespace-nowrap">Pending Arrival Form </p>
                  </NavLink>

                  <NavLink
                    to="/dashboard/preparing-request-from"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                        : "bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                    }
                  >
                    <GoChecklist size={20} />
                    <p className="whitespace-nowrap">Pending Request Form </p>
                  </NavLink>

                  <NavLink
                    to="/dashboard/add-ASIN-UPC-from"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                        : "bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                    }
                  >
                    <GoChecklist size={20} />
                    <p className="whitespace-nowrap">Add ASIN/UPC Form </p>
                  </NavLink>
                </div>

                {/* bottom part of the slider  */}
                <div className="bottom-0 mb-5 w-full">
                  <div className={`space-y-2 bottom-0`}>
                    <NavLink
                      className={`bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2`}
                    >
                      <BiSupport size={20} />
                      <p className="whitespace-nowrap">Support</p>
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                          : "bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                      }
                    >
                      <AiOutlineSetting size={20} />
                      <p className="whitespace-nowrap">Settings</p>
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                          : "bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2"
                      }
                    >
                      <RxExit size={20} />
                      <p className="whitespace-nowrap">Sign Out</p>
                    </NavLink>
                  </div>
                </div>
              </div>
            </ul>
          </div>
        </div>
        <div className="text-lg font-medium w-full md:hidden">Dashboard</div>
      </div>
      <div className="text-lg font-medium w-full hidden md:block">
        Dashboard
      </div>
      <div className="w-full px-8 relative lg:block hidden">
        <div className="form-control w-full">
          <div className="input-group w-full">
            <input
              type="text"
              placeholder="Search…"
              className="input input-bordered w-full"
            />
            <button className="btn btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end items-center md:gap-4 gap-2 z-[1]">
        <div className="bg-[#454547] p-3 rounded relative hidden">
          <AiOutlineSearch size={20} />
        </div>
        <div className="bg-[#454547] p-3 rounded relative">
          <BsBell size={20} />
          <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
          <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span>
        </div>
        <div className="bg-[#454547] p-3 rounded relative">
          <AiOutlineMessage size={20} />
          <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
          <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span>
        </div>
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar w-12 border-2 border-[#8633FF]"
          >
            <div className="w-10 rounded-full">
              <img src="https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.webp?b=1&s=170667a&w=0&k=20&c=ahypUC_KTc95VOsBkzLFZiCQ0VJwewfrSV43BOrLETM=" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
