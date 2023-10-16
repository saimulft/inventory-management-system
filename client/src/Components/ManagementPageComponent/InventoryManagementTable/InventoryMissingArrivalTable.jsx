import { useContext, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";

import { LiaGreaterThanSolid } from "react-icons/lia";
import { GlobalContext } from "../../../Providers/GlobalProviders";

export default function InventoryMissingArrivalTable() {
  const [isActive, setIsActive] = useState(true);
  const { isSidebarOpen } = useContext(GlobalContext);
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";
  const data = [
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      product_name: "Thick Glaze Artist Spray",
      order_ID: "20000004245",
      UPIN: "SAVE973_LLC_B010S",
      expected_qnt: 23,
      receive_qnt: 23,
      missing_qnt: 23,
      supplier_tracking: "sfsad52112sdf",
      EDA: "2023-06-26",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      product_name: "Thick Glaze Artist Spray",
      order_ID: "20000004245",
      UPIN: "SAVE973_LLC_B010S",
      expected_qnt: 23,
      receive_qnt: 23,
      missing_qnt: 23,
      supplier_tracking: "sfsad52112sdf",
      EDA: "2023-06-26",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      product_name: "Thick Glaze Artist Spray",
      order_ID: "20000004245",
      UPIN: "SAVE973_LLC_B010S",
      expected_qnt: 23,
      receive_qnt: 23,
      missing_qnt: 23,
      supplier_tracking: "sfsad52112sdf",
      EDA: "2023-06-26",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      product_name: "Thick Glaze Artist Spray",
      order_ID: "20000004245",
      UPIN: "SAVE973_LLC_B010S",
      expected_qnt: 23,
      receive_qnt: 23,
      missing_qnt: 23,
      supplier_tracking: "sfsad52112sdf",
      EDA: "2023-06-26",
    },
  ];

  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">
        Missing Arrival Item: 149
      </h3>
      <div className="relative flex justify-between items-center">
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
            Solved
          </div>
        </div>
        <input
          className="border bg-white shadow-md border-[#8633FF] outline-none w-1/4 cursor-pointer  py-2 rounded-md px-2 text-sm"
          placeholder="Search Here"
          type="text"
        />
        <div className="absolute bottom-[9px] cursor-pointer p-[2px] rounded right-[6px] bg-[#8633FF]  text-white ">
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
              <th>Order ID</th>
              <th>UPIN</th>
              <th>Expected Qnt.</th>
              <th>Receive Qnt.</th>
              <th>Missing Qnt.</th>
              <th>Supplier Tracking</th>
              <th>EDA</th>
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
                  <th>{d.date}</th>
                  <th className="font-normal">{d.store_name}</th>
                  <td>{d.ASIN_UPC}</td>
                  <td>{d.code_type}</td>
                  <td>{d.product_name}</td>
                  <td>{d.order_ID}</td>
                  <td>{d.UPIN}</td>
                  <td>{d.expected_qnt}</td>
                  <td>{d.receive_qnt}</td>
                  <td>{d.missing_qnt}</td>
                  <td>{d.supplier_tracking}</td>
                  <td>{d.EDA}</td>
                  <td
                    onClick={() =>
                      document.getElementById("my_modal_2").showModal()
                    }
                    className="cursor-pointer"
                  >
                    <BiDotsVerticalRounded />
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
                <span className="font-bold">Receive Qnt: </span>
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
                <span>Not Added</span>
              </p>
            </div>
            <div className="w-1/2 px-4">
              <h3 className="text-2xl font-medium mb-6">Update</h3>
              <form>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Received Qnt</label>
                  <input
                    type="text"
                    placeholder="Enter Received Qnt"
                    className="border border-[#8633FF] outline-[#8633FF] py-2 pl-2 rounded text-xs"
                    id="receivedQnt"
                    name="receivedQnt"
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Remark</label>
                  <input
                    type="text"
                    placeholder="Enter Remark"
                    className="border border-[#8633FF] outline-[#8633FF] py-2 pl-2 rounded text-xs "
                    id="remark"
                    name="remark"
                  />
                </div>
              </form>
              <button className="bg-[#8633FF] mt-5 w-full py-[6px] rounded text-white font-medium">
                Update
              </button>
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