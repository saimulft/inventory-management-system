import { useContext } from "react";
import { AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { LiaGreaterThanSolid } from "react-icons/lia";
import { GlobalContext } from "../../../Providers/GlobalProviders";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import FileDownload from "../../Shared/FileDownload";

export default function InventoryShippedTable() {
  const { isSidebarOpen } = useContext(GlobalContext);

  const { data = [] } = useQuery({
    queryKey: ['ready_to_ship_data'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/v1/shipped_api/get_all_shipped_data')
        if (res.status === 200) {
          return res.data.data;
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    }
  })
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";


  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">Shipped: 16,245</h3>
      <div className="relative flex justify-between items-center mt-4">
        <div>
          <div className="flex gap-4 text-sm items-center">
            <p className="border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded">
              Today
            </p>
            <p className="border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded">
              7 Days
            </p>
            <p className="border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded">
              15 Days
            </p>
            <p className="border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded">
              1 Month
            </p>
            <p className="border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded">
              Year
            </p>
          </div>
        </div>
        <input
          className="border bg-white shadow-md border-[#8633FF] outline-none w-1/4 cursor-pointer  py-2 rounded-md px-2 text-sm"
          placeholder="Search Here"
          type="text"
        />
        <div className="absolute bottom-[6px] cursor-pointer p-[2px] rounded right-[6px] bg-[#8633FF]  text-white ">
          <AiOutlineSearch size={20} />
        </div>
      </div>

      <div className="overflow-x-auto mt-8">
        <table className="table table-xs">
          <thead>
            <tr className="bg-gray-200">
              <th>Date</th>
              <th>Store Name</th>
              <th>ASIN/UPC</th>
              <th>Code Type</th>
              <th>Product Name</th>
              <th>UPIN</th>
              <th>Quantity</th>
              <th>Courier</th>
              <th>Order ID</th>
              <th>Supplier Tracking</th>
              <th>Shipping label</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, index) => {
              return (
                <tr
                  className={`${index % 2 == 1 && "bg-gray-200"}`}
                  key={index}
                >
                 <th>{d.date && format(new Date(d.date), "y/MM/d")}</th>
                  <th className="font-normal">{d.store_name}</th>
                  <td>{d.code}</td>
                  <td>{d.code_type}</td>
                  <td>{d.product_name}</td>
                  <td>{d.upin}</td>
                  <td>{d.quantity}</td>
                  <td>{d.courier}</td>
                  <td>{d.order_id}</td>
                  <td className="text-[#8633FF]">{d.tracking_number}</td>
                  <td>{d.shipping_file && <FileDownload fileName={d.shipping_file} />}</td>
                  <td
                    onClick={() =>
                      document.getElementById("my_modal_2").showModal()
                    }
                    className="cursor-pointer"
                  >
                    <AiOutlineEye size={15} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <p>Showing 1 to 20 of 2,000 entries</p>
          <div className="flex items-center gap-2">
            <div className="rotate-180 border px-[2px] py-[3px] border-gray-400">
              <LiaGreaterThanSolid size={13} />
            </div>
            <div className="border px-1 py-[2px]  border-gray-400 text-xs">
              1
            </div>
            <div className="border px-1 py-[2px]  border-gray-400 text-xs">
              2
            </div>
            <div className="border px-1 py-[2px]  border-gray-400 text-xs">
              ...
            </div>
            <div className="border px-1 py-[2px]  border-gray-400 text-xs">
              9
            </div>
            <div className="border px-1 py-[2px]  border-gray-400 text-xs">
              10
            </div>
            <div className="border px-[2px] py-[3px] border-gray-400">
              <LiaGreaterThanSolid size={13} />
            </div>
          </div>
        </div>
      </div>
      {/* modal content  */}
      <dialog id="my_modal_2" className="modal">
        <div style={{ marginLeft }} className="modal-box py-10 px-10">
          <div className="flex">
            <div className="w-1/2">
              <div className="flex items-center mb-6 gap-2">
                <BiSolidEdit size={24} />
                <h3 className="text-2xl font-medium">Details</h3>
              </div>
              <p className="mt-2">
                <span className="font-bold">Data: </span>
                <span>2023-06-26</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Store Name: </span>
                <span>SAVE_k544.LLC</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">ASIN: </span>
                <span>BOHFK4522</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Ordered Qnt: </span>
                <span>23</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Received Qnt: </span>
                <span>23</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Missing Qnt: </span>
                <span>23</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">UPIN: </span>
                <span>USA_Quantity5245sdfds</span>
              </p>

              <p className="mt-2">
                <span className="font-bold">Product Name: </span>
                <span>demo product name</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">EDA: </span>
                <span>2023-06-26</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Shipping Tracking: </span>
                <span className="text-[#8633FF] cursor-pointer">Click</span>
              </p>
            </div>

          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
