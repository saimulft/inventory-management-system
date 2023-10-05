import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaAmazon } from "react-icons/fa";

export default function AllStoresPage() {
  const [isActive, setIsActive] = useState(true);
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
    <div className="bg-white p-20">
      <div className="flex justify-between">
        <div className="flex text-center w-1/2 ">
          <div
            onClick={() => setIsActive(true)}
            className={`px-3 rounded-s-md py-2 cursor-pointer ${
              isActive
                ? "bg-[#8633FF] text-white"
                : "border-2 border-[#8633FF] text-[#8633FF]"
            }  `}
          >
            Active
          </div>
          <div
            onClick={() => setIsActive(false)}
            className={`px-3 rounded-e-md py-2 cursor-pointer ${
              !isActive
                ? "bg-[#8633FF] text-white"
                : "border-2 border-[#8633FF] text-[#8633FF]"
            }  `}
          >
            Inactive
          </div>
        </div>
        <div className="w-1/2 gap-4 flex items-center">
          <div className="w-full flex gap-4 ">
            <select className="border bg-white shadow-md border-[#8633FF] outline-none cursor-pointer w-1/2 py-2 rounded-md px-2 text-sm">
              <option value="Null">Favorite Fruit</option>
              <option value="Brooklyn">Apples</option>
              <option value="Manhattan">Plums</option>
              <option value="Queens">Oranges</option>
            </select>

            <div className="relative  w-1/2 ">
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
      </div>

      {/* store info  */}
      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 mt-8">
        {allStoreData.map((singleStore, index) => {
          return (
            <div
              key={index}
              className="flex items-center px-2 py-6 cursor-pointer gap-4 border-2 border-[#8633FF] rounded-md"
            >
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
          );
        })}
      </div>
    </div>
  );
}
