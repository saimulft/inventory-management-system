import { AiOutlineSearch } from "react-icons/ai";
import { FaAmazon } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProfitTrackerPage() {
  const shadowStyle = {
    boxShadow: "0px 0px 15px -8px rgba(0,0,0,0.75)",
  };
  const allStoreData = [
    { storeName: "Amazon", Icon: FaAmazon, userRole: "Store Manager" },
    { storeName: "Amazon", Icon: FaAmazon, userRole: "Store Manager" },
    { storeName: "Amazon", Icon: FaAmazon, userRole: "Store Manager" },
    { storeName: "Amazon", Icon: FaAmazon, userRole: "Store Manager" },
    { storeName: "Amazon", Icon: FaAmazon, userRole: "Store Manager" },
    { storeName: "Amazon", Icon: FaAmazon, userRole: "Store Manager" },
    { storeName: "Amazon", Icon: FaAmazon, userRole: "Store Manager" },
    { storeName: "Amazon", Icon: FaAmazon, userRole: "Store Manager" },
  ];

  return (
    <div className="w-[90%] mx-auto my-14">
      <div className="bg-white shadow-lg p-10 rounded-lg">
        <h1 className="text-center text-2xl font-medium mb-8">All Stores</h1>
        <div>
          <div className=" gap-4 flex justify-between">
            <select className="border bg-white shadow-md border-[#8633FF] outline-none cursor-pointer w-1/4 py-2 rounded-md px-2 text-sm">
              <option value="Null">Demo</option>
              <option value="Brooklyn">Test 1</option>
              <option value="Manhattan">test 2</option>
              <option value="Queens">test 3</option>
            </select>

            <div className="relative  w-1/4 ">
              <input
                className="border bg-white shadow-md border-[#8633FF] outline-none w-full cursor-pointer  py-2 rounded-md px-2 text-sm"
                placeholder="Search Here"
                type="text"
              />
              <div className="absolute bottom-[6px] cursor-pointer p-[2px] rounded right-[6px] bg-[#8633FF]  text-white ">
                <AiOutlineSearch size={20} />
              </div>
            </div>
          </div>
        </div>
        {/* store info  */}
        <div className="grid grid-cols-4 gap-6 mb-8 mt-8">
          {allStoreData.map((singleStore, index) => {
            return (
              <Link style={shadowStyle} key={index} to="/dashboard/home">
                <div className="flex items-center px-4 py-8 cursor-pointer gap-4 border-2 border-[#8633FF] rounded-lg">
                  <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
                    <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
                      <singleStore.Icon size={24} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl">{singleStore.storeName}</p>
                    <p className="text-slate-500">{singleStore.userRole}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
