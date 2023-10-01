import { AiOutlinePieChart, AiOutlineSetting } from "react-icons/ai";
import { PiWarehouseDuotone } from "react-icons/pi";
import { GiProgression } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";
import { BiSupport } from "react-icons/bi";
import { RxExit } from "react-icons/rx";
import { RiMenuFoldFill } from "react-icons/ri";
import { BsHouseCheck, BsPlusCircle } from "react-icons/bs";
import { useContext } from "react";
import { GlobalContext } from "../../Providers/GlobalProviders";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(GlobalContext);

  return (
    <div className={`sticky bottom-0 top-0 pt-5 bg-[#2e2e30] h-screen hidden md:block`}>
      <div className="flex flex-col w-full lg:h-[calc(100vh-6%)] md:h-[calc(100vh-5%)] items-center relative px-8">
        {/* top part of the slider  */}
        <div className={`space-y-2`}>
          <div className="mb-10 w-fit">
            <div onClick={() => { setIsSidebarOpen(!isSidebarOpen); }} className={`transition-all duration-500 ${isSidebarOpen ? "rotate-0" : "rotate-180"} flex justify-center items-center cursor-pointer`}>
              <div className={`${isSidebarOpen ? 'bg-[#8633FF]' : 'bg-[#454547]'} text-white ps-3 pe-3 py-[10px] rounded-md`} >
                <RiMenuFoldFill size={25} />
              </div>
            </div>
          </div>

          <NavLink to='/dashboard/home' className={({ isActive }) => isActive ? `bg-[#8633FF] text-white ps-3 pe-3 ${isSidebarOpen ? "w-56" : ""} py-[10px] rounded-md flex items-center gap-2` : `bg-[#454547] text-white ps-3 ${isSidebarOpen ? "w-56" : ""} pe-3 py-[10px] rounded-md flex items-center gap-2`}>
            <AiOutlinePieChart size={25} />
            {isSidebarOpen && <p>Dashboard</p>}
          </NavLink>

          <NavLink className={({ isActive }) => isActive ? 'bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2' : 'bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2'}>
            <PiWarehouseDuotone size={25} />
            {isSidebarOpen && <p>Management</p>}
          </NavLink>

          <NavLink className={({ isActive }) => isActive ? 'bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2' : 'bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2'}>
            <BsHouseCheck size={25} />
            {isSidebarOpen && <p>All stores</p>}
          </NavLink>

          <NavLink to='/dashboard/add-store' className={({ isActive }) => isActive ? 'bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2' : 'bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2'}>
            <BsPlusCircle size={25} />
            {isSidebarOpen && <p>Add store</p>}
          </NavLink>

          <NavLink className={({ isActive }) => isActive ? 'bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2' : 'bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2'}>
            <GiProgression size={25} />
            {isSidebarOpen && <p>Profit tracker</p>}
          </NavLink>

          <NavLink to='/dashboard/pending-arrival-from' className={({ isActive }) => isActive ? 'bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2' : 'bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2'}>
            <GoChecklist size={25} />
            {isSidebarOpen && <p className="whitespace-nowrap">Pending Arrival Form </p>}
          </NavLink>

          <NavLink to='/dashboard/preparing-request-from' className={({ isActive }) => isActive ? 'bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2' : 'bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2'}>
            <GoChecklist size={25} />
            {isSidebarOpen && <p className="whitespace-nowrap">Pending Request Form </p>}
          </NavLink>

          <NavLink to='/dashboard/add-ASIN-UPC-from' className={({ isActive }) => isActive ? 'bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2' : 'bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2'}>
            <GoChecklist size={25} />
            {isSidebarOpen && <p className="whitespace-nowrap">Add ASIN/UPC Form </p>}
          </NavLink>
        </div>

        {/* bottom part of the slider  */}
        <div className="flex flex-col justify-between w-full h-[calc(100vh-100px)] items-center mt-10 relative">
          <div className={`space-y-2 absolute bottom-0`}>
            <NavLink className={`bg-[#8633FF] text-white ps-3 pe-3  ${isSidebarOpen ? "w-56" : ""} py-[10px] rounded-md flex items-center gap-2`}>
              <BiSupport size={25} />
              {isSidebarOpen && <p className="whitespace-nowrap">Support</p>}
            </NavLink>
            <NavLink className={({ isActive }) => isActive ? 'bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2' : 'bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2'}>
              <AiOutlineSetting size={25} />
              {isSidebarOpen && <p className="whitespace-nowrap">Settings</p>}
            </NavLink>
            <NavLink className={({ isActive }) => isActive ? 'bg-[#8633FF] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2' : 'bg-[#454547] text-white ps-3 pe-3 py-[10px] rounded-md flex items-center gap-2'}>
              <RxExit size={25} />
              {isSidebarOpen && <p className="whitespace-nowrap">Sign Out</p>}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
