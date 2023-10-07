import { SlSocialDropbox } from "react-icons/Sl";
import { AiOutlineSetting, AiOutlineShoppingCart } from "react-icons/ai";
import { MdOutlineDiscount, MdPendingActions } from "react-icons/md";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BiLogoDropbox } from "react-icons/bi";
import { RiFileCloseLine } from "react-icons/ri";
import { Link } from "react-router-dom";
export default function storeManagement() {
  const storeManagementData = [
    {
      quantity: "2,554",
      Icon: SlSocialDropbox,
      title: "All Stock",
      tablePath: "all-stock",
    },
    {
      quantity: "584",
      Icon: MdPendingActions,
      title: "Pending Arrival",
      tablePath: "pending-arrival",
    },
    {
      quantity: "343",
      Icon: AiOutlineSetting,
      title: "Preparing Request",
      tablePath: "preparing-request",
    },
    {
      quantity: "3,452",
      Icon: AiOutlineShoppingCart,
      title: "Ready To Ship",
      tablePath: "ready-to-ship",
    },
    {
      quantity: "16,245",
      Icon: LiaShippingFastSolid,
      title: "Shipped",
      tablePath: "shipped",
    },
    {
      quantity: "46",
      Icon: BiLogoDropbox,
      title: "Out Of Stock",
      tablePath: "out-of-stock",
    },
    {
      quantity: "149",
      Icon: RiFileCloseLine,
      title: "Missing Arrival",
      tablePath: "missing-arrival",
    },
    {
      quantity: "8,451",
      Icon: MdOutlineDiscount,
      title: "Total ASIN/UPC",
      tablePath: "total-asin",
    },
  ];

  return (
    <div>
      <h3 className="text-center mb-12 text-3xl font-medium">
        Store Management
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {storeManagementData.map((singleData, index) => {
          return (
            <div key={index}>
              <Link to={`/dashboard/management/${singleData.tablePath}`}>
                <div className="flex items-center px-2 py-6 gap-4 border-2 rounded cursor-pointer border-[#8633FF]">
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
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
