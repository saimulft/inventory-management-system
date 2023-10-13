import { FaDropbox } from "react-icons/fa";
import { AiOutlineSetting, AiOutlineShoppingCart } from "react-icons/ai";
import { MdOutlineDiscount, MdPendingActions } from "react-icons/md";
import { LiaShippingFastSolid } from "react-icons/lia";
import { RiCalendarCloseFill, RiFileCloseLine } from "react-icons/ri";
import { Link } from "react-router-dom";
export default function inventoryManagementData() {
  const shadowStyle = {
    boxShadow: "0px 0px 15px -8px rgba(0,0,0,0.75)",
  };
  const inventoryManagementData = [
    {
      quantity: "2,554",
      Icon: FaDropbox,
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
      Icon: RiCalendarCloseFill,
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
        Inventory Management
      </h3>
      <div className="grid  grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {inventoryManagementData.map((singleData, index) => {
          return (
            <div style={shadowStyle} key={index}>
              <Link
                to={`/dashboard/management/inventory/${singleData.tablePath}`}
              >
                <div className="flex items-center px-4 py-8 gap-4 border-2 rounded-lg cursor-pointer border-[#8633FF]">
                  <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
                    <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
                      {<singleData.Icon size={24} />}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl">{singleData.quantity}</h3>
                    <p className="text-slate-500 text-sm">{singleData.title}</p>
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
