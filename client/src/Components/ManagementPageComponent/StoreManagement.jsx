import { SlSocialDropbox } from "react-icons/Sl";
import { AiOutlineSetting, AiOutlineShoppingCart } from "react-icons/ai";
import { MdOutlineDiscount, MdPendingActions } from "react-icons/md";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BiLogoDropbox } from "react-icons/bi";
import { RiFileCloseLine } from "react-icons/ri";
export default function StoreManagement() {
  const StoreManagementData = [
    { quantity: "2,554", Icon: SlSocialDropbox, title: "All Stock" },
    { quantity: "2,556", Icon: MdPendingActions, title: "Pending Arrival" },
    { quantity: "2,557", Icon: AiOutlineSetting, title: "Preparing Request" },
    { quantity: "2,558", Icon: AiOutlineShoppingCart, title: "Ready To Ship" },
    { quantity: "2,559", Icon: LiaShippingFastSolid, title: "Shipped" },
    { quantity: "2,560", Icon: BiLogoDropbox, title: "Out Of Stock" },
    { quantity: "2,561", Icon: RiFileCloseLine, title: "Missing Arrival" },
    { quantity: "2,562", Icon: MdOutlineDiscount, title: "Total ASIN/UPC" },
  ];

  return (
    <div className="p-16 bg-white rounded-lg">
      <h3 className="text-center mb-12 text-3xl font-medium">
        Store Management
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {StoreManagementData.map((singleData, index) => {
          return (
            <div
              key={index}
              className="flex items-center px-2 py-6 gap-4 border-2 rounded cursor-pointer border-[#8633FF]"
            >
              <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
                <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
                  {<singleData.Icon size={24} />}
                </div>
              </div>

              <div>
                <h3 className="text-2xl">{singleData.quantity}</h3>
                <p className="text-slate-500">{singleData.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
