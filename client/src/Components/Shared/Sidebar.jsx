import { AiOutlinePieChart, AiOutlineSetting } from "react-icons/ai";
import { PiWarehouseDuotone } from "react-icons/pi";
import { GiProgression } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";
import { BiSupport } from "react-icons/bi";
import { RxExit } from "react-icons/rx";
import { MdOutlineExpandLess } from "react-icons/md";
import { BsHouseCheck, BsPlusCircle } from "react-icons/bs";
import { useContext } from "react";
import { GlobalContext } from "../../Providers/GlobalProviders";

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(GlobalContext);
  return (
    <div
      className={`sticky bottom-0 top-0 pt-8 ${isSidebarOpen ? "pl-4" : ""
        }  bg-white h-screen`}
    >
      <div>
        <div
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            boxShadow: "0px 0px 10px -1px rgba(0, 0, 0, 0.1)",
          }}
          className={`border  w-8 h-8 rounded-full ${isSidebarOpen ? "-rotate-90" : "rotate-90"
            }  flex justify-center items-center absolute top-5 right-1 bg-white shadow-lg translate-x-1/2 cursor-pointer hover:shadow-none border hover:border-[#8633FF]`}
        >
          <MdOutlineExpandLess size={24} />
        </div>
        <div className=" flex flex-col justify-between w-full h-[600px] mx-auto items-center mt-20">
          {/* top part of the slider  */}
          <div className="space-y-2">
            <div
              className={`bg-[#8633FF] text-white ${isSidebarOpen ? "ps-2 pe-4 py-[6px]" : "px-3 py-2"
                }   rounded-md flex items-center gap-2`}
            >
              <AiOutlinePieChart size={20} />
              {isSidebarOpen && <p>Dashboard</p>}
            </div>
            <div
              className={`bg-[#8633FF] text-white ${isSidebarOpen ? "ps-2 pe-4 py-[6px]" : "px-3 py-2"
                }   rounded-md flex items-center gap-2`}
            >
              <PiWarehouseDuotone size={20} />
              {isSidebarOpen && <p>Management</p>}
            </div>
            <div
              className={`bg-[#8633FF] text-white ${isSidebarOpen ? "ps-2 pe-4 py-[6px]" : "px-3 py-2"
                }   rounded-md flex items-center gap-2`}
            >
              <BsHouseCheck size={20} />
              {isSidebarOpen && <p>All stores</p>}
            </div>
            <div
              className={`bg-[#8633FF] text-white ${isSidebarOpen ? "ps-2 pe-4 py-[6px]" : "px-3 py-2"
                }   rounded-md flex items-center gap-2`}
            >
              <BsPlusCircle size={16} />
              {isSidebarOpen && <p>Add store</p>}
            </div>
            <div
              className={`bg-[#8633FF] text-white ${isSidebarOpen ? "ps-2 pe-4 py-[6px]" : "px-3 py-2"
                }   rounded-md flex items-center gap-2`}
            >
              <GiProgression />
              {isSidebarOpen && <p>Profit tracker</p>}
            </div>
            <div
              className={`bg-[#8633FF] text-white ${isSidebarOpen ? "ps-2 pe-4 py-[6px]" : "px-3 py-2"
                }   rounded-md flex items-center gap-2`}
            >
              <GoChecklist size={20} />
              {isSidebarOpen && <p>Pending Arrival Form </p>}
            </div>
            <div
              className={`bg-[#8633FF] text-white ${isSidebarOpen ? "ps-2 pe-4 py-[6px]" : "px-3 py-2"
                }   rounded-md flex items-center gap-2`}
            >
              <GoChecklist size={20} />
              {isSidebarOpen && <p>Pending Request Form </p>}
            </div>
            <div
              className={`bg-[#8633FF] text-white ${isSidebarOpen ? "ps-2 pe-4 py-[6px]" : "px-3 py-2"
                }   rounded-md flex items-center gap-2`}
            >
              <GoChecklist size={20} />
              {isSidebarOpen && <p>Add ASIN/UPC Form </p>}
            </div>
          </div>
          {/* bottom part of the slider  */}
          <div className="space-y-2">
            <div
              className={`bg-[#8633FF] text-white ps-2 ${isSidebarOpen
                  ? "pe-[119px] py-[6px]"
                  : "px-3 py-2 flex justify-center items-center"
                }  rounded-md flex items-center gap-2`}
            >
              <BiSupport size={20} />
              {isSidebarOpen && <p>Support</p>}
            </div>
            <div
              className={`bg-[#8633FF] text-white ${isSidebarOpen ? "ps-2 pe-4 py-[6px]" : "px-3 py-2"
                }   rounded-md flex items-center gap-2`}
            >
              <AiOutlineSetting size={18} />
              {isSidebarOpen && <p>Settings</p>}
            </div>
            <div
              className={`bg-[#8633FF] text-white ${isSidebarOpen ? "ps-2 pe-4 py-[6px]" : "px-3 py-2"
                }   rounded-md flex items-center gap-2`}
            >
              <RxExit />
              {isSidebarOpen && <p>Sign Out</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
