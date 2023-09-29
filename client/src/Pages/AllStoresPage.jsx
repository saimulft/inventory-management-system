import { useState } from "react";
import { FaAmazon } from "react-icons/fa";

export default function AllStoresPage() {
  const [isActive, setIsActive] = useState(true);
  return (
    <div className="bg-white p-8">
      <div className="flex justify-between">
        <div className="flex text-center w-1/2">
          <div
            onClick={() => setIsActive(true)}
            className={`px-3 rounded-s-md py-2 ${
              isActive
                ? "bg-[#8633FF]"
                : "border-2 border-[#8633FF] text-[#8633FF]"
            }  text-white`}
          >
            Active
          </div>
          <div
            onClick={() => setIsActive(false)}
            className={`px-3 rounded-e-md py-2 ${
              !isActive
                ? "bg-[#8633FF]"
                : "border-2 border-[#8633FF] text-[#8633FF]"
            }  text-white`}
          >
            Inactive
          </div>
        </div>
        <div className="w-1/2 gap-4 flex items-center">
          <div className="w-full flex gap-4 ">
            <input
              className="border-2 border-[#8633FF] outline-none w-1/2 py-1 rounded-md px-2"
              placeholder="Store Type"
              type="text"
            />
            <input
              className="border-2 border-[#8633FF] outline-none w-1/2 py-1 rounded-md px-2"
              placeholder="Search Here"
              type="text"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 mt-8">
        <div className="flex items-center px-2 py-4 gap-4 border-2 border-[#8633FF] rounded-md">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <FaAmazon size={24} />
            </div>
          </div>
          <div>
            <p className="text-xl">Amazon Store</p>
            <p>Store Manager</p>
          </div>
        </div>
        <div className="flex items-center px-2 py-4 gap-4 border-2 border-[#8633FF] rounded-md">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <FaAmazon size={24} />
            </div>
          </div>
          <div>
            <p className="text-xl">Amazon Store</p>
            <p>Store Manager</p>
          </div>
        </div>
        <div className="flex items-center px-2 py-4 gap-4 border-2 border-[#8633FF] rounded-md">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <FaAmazon size={24} />
            </div>
          </div>
          <div>
            <p className="text-xl">Amazon Store</p>
            <p>Store Manager</p>
          </div>
        </div>
        <div className="flex items-center px-2 py-4 gap-4 border-2 border-[#8633FF] rounded-md">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <FaAmazon size={24} />
            </div>
          </div>
          <div>
            <p className="text-xl">Amazon Store</p>
            <p>Store Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}
