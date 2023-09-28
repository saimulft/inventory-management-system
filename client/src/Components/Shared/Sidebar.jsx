import {
  AiOutlineMenuUnfold,
  AiOutlinePieChart,
  AiOutlineSetting,
} from "react-icons/ai";
import { PiWarehouseDuotone } from "react-icons/pi";
import { GiProgression } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";
import { BiSupport } from "react-icons/bi";
import { RxExit } from "react-icons/rx";
import { MdOutlineExpandLess } from "react-icons/md";
import { BsHouseCheck, BsPlusCircle } from "react-icons/bs";
import { useState } from "react";
export default function Sidebar() {
  const [isSliderOpen, setIsSliderOpen] = useState(true);
  console.log(isSliderOpen);

  return (
    <div className=" sticky bottom-0 top-0  pt-8 pl-4 bg-white h-screen">
      <div>
        <div
          onClick={() => setIsSliderOpen(!isSliderOpen)}
          style={{
            boxShadow: "0px 0px 10px -1px rgba(0, 0, 0, 0.1)",
          }}
          className={`border  w-8 h-8 rounded-full ${
            isSliderOpen ? "-rotate-90" : "rotate-90"
          }  flex justify-center items-center absolute top-5 right-1 bg-white shadow-lg translate-x-1/2 cursor-pointer hover:shadow-none border hover:border-[#20BEAD]`}
        >
          <MdOutlineExpandLess size={24} />
        </div>
        <div className=" flex flex-col justify-between w-full h-[600px] mx-auto items-center mt-10">
          {/* top part of the slider  */}
          <div className="space-y-2">
            <div className="bg-[#20BEAD] text-white ps-2 pe-4 py-[6px] rounded-md flex items-center gap-2">
              <AiOutlinePieChart size={20} />
              <p>Dashboard</p>
            </div>
            <div className="bg-[#20BEAD] text-white ps-2 pe-4 py-[6px] rounded-md flex items-center gap-2">
              <PiWarehouseDuotone size={20} />
              <p>Management</p>
            </div>
            <div className="bg-[#20BEAD] text-white ps-2 pe-4 py-[6px] rounded-md flex items-center gap-2">
              <BsHouseCheck size={20} />
              <p>All stores</p>
            </div>
            <div className="bg-[#20BEAD] text-white ps-2 pe-4 py-[6px] rounded-md flex items-center gap-2">
              <BsPlusCircle size={16} />
              <p>Add store</p>
            </div>
            <div className="bg-[#20BEAD] text-white ps-2 pe-4 py-[6px] rounded-md flex items-center gap-2">
              <GiProgression />
              <p>Profit tracker</p>
            </div>
            <div className="bg-[#20BEAD] text-white ps-2 pe-4 py-[6px] rounded-md flex items-center gap-2">
              <GoChecklist />
              <p>Pending Arrival Form </p>
            </div>
            <div className="bg-[#20BEAD] text-white ps-2 pe-4 py-[6px] rounded-md flex items-center gap-2">
              <GoChecklist />
              <p>Pending Request Form </p>
            </div>
            <div className="bg-[#20BEAD] text-white ps-2 pe-4 py-[6px] rounded-md flex items-center gap-2">
              <GoChecklist />
              <p>Add ASIN/UPC Form </p>
            </div>
          </div>
          {/* bottom part of the slider  */}
          <div className="space-y-2">
            <div className="bg-[#20BEAD] text-white ps-2 pe-[119px] py-[6px] rounded-md flex items-center gap-2">
              <BiSupport />
              <p>Support</p>
            </div>
            <div className="bg-[#20BEAD] text-white ps-2 pe-4 py-[6px] rounded-md flex items-center gap-2">
              <AiOutlineSetting />
              <p>Settings</p>
            </div>
            <div className="bg-[#20BEAD] text-white ps-2 pe-4 py-[6px] rounded-md flex items-center gap-2">
              <RxExit />
              <p>Sign Out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
