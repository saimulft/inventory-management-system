import { SlSocialDropbox } from "react-icons/Sl";
import { AiOutlineSetting, AiOutlineShoppingCart } from "react-icons/ai";
import { MdOutlineDiscount, MdPendingActions } from "react-icons/md";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsPlusLg } from "react-icons/bs";
import { BiLogoDropbox } from "react-icons/bi";
import { RiFileCloseLine } from "react-icons/ri";
export default function StoreManagement() {
  return (
    <div className="p-16 bg-white rounded-lg">
      <h3 className="text-center mb-12 text-3xl font-medium">
        Store Management
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center px-2 py-4 gap-4 border-2 border-[#8633FF] rounded-md">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <SlSocialDropbox size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl">2,554</h3>
            <p>All Stock</p>
          </div>
        </div>
        <div className="flex items-center px-2 py-4 gap-4 border-2 rounded border-[#8633FF]">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <MdPendingActions size={24} />
            </div>
          </div>

          <div>
            <h3 className="text-2xl">2,554</h3>
            <p>Pending Arrival</p>
          </div>
        </div>
        <div className="flex items-center px-2 py-4 gap-4 border-2 border-[#8633FF] rounded-md">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <AiOutlineSetting size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl">2,554</h3>
            <p>Pending Request</p>
          </div>
        </div>
        <div className="flex items-center px-2 py-4 gap-4 border-2 border-[#8633FF] rounded-md">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <AiOutlineShoppingCart size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl">2,554</h3>
            <p>Ready To Ship</p>
          </div>
        </div>
        <div className="flex items-center px-2 py-4 gap-4 border-2 border-[#8633FF] rounded-md">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <LiaShippingFastSolid size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl">2,554</h3>
            <p>Shipped</p>
          </div>
        </div>

        <div className="flex items-center px-2 py-4 gap-4 border-2 border-[#8633FF] rounded-md">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center relative">
              <BiLogoDropbox size={24} />
              <div className="absolute top-0 rotate-45 font-medium">
                <BsPlusLg />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl">2,554</h3>
            <p>Out Of Stock</p>
          </div>
        </div>
        <div className="flex items-center px-2 py-4 gap-4 border-2 border-[#8633FF] rounded-md">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <RiFileCloseLine size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl">2,554</h3>
            <p>Missing Arrival</p>
          </div>
        </div>

        <div className="flex items-center px-2 py-4 gap-4 border-2 border-[#8633FF] rounded-md">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <MdOutlineDiscount size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl">2,554</h3>
            <p>Total ASIN/UPC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
