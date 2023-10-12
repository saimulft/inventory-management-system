import { useContext } from "react";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import { LiaGreaterThanSolid } from "react-icons/lia";
import { GlobalContext } from "../../../Providers/GlobalProviders";

export default function StorePendingArrivalTable() {
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
      quantity: 23,
      courier: "-",
      supplier_tracking: "-",
      shipping_label: "Not Added",
      shipping_slip: "Not Added",
      notes: "-",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      product_name: "Thick Glaze Artist Spray",
      order_ID: "20000004245",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "-",
      supplier_tracking: "-",
      shipping_label: "Not Added",
      shipping_slip: "Not Added",
      notes: "-",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      product_name: "Thick Glaze Artist Spray",
      order_ID: "20000004245",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "-",
      supplier_tracking: "-",
      shipping_label: "Not Added",
      shipping_slip: "Not Added",
      notes: "-",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      product_name: "Thick Glaze Artist Spray",
      order_ID: "20000004245",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "-",
      supplier_tracking: "-",
      shipping_label: "Not Added",
      shipping_slip: "Not Added",
      notes: "-",
    },
  ];

  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">Pending Arrival: 584</h3>

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
              <th>Quantity</th>
              <th>Courier</th>
              <th>Supplier Tracking</th>
              <th>Shipping label</th>
              <th>Shipping Slip</th>
              <th>Notes</th>
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
                  <td>{d.quantity}</td>
                  <td>{d.courier}</td>
                  <td>{d.supplier_tracking}</td>
                  <td>{d.shipping_label}</td>
                  <td>{d.shipping_slip}</td>
                  <td>{d.notes}</td>
                  <td
                    onClick={() =>
                      document.getElementById("my_modal_2").showModal()
                    }
                    className="cursor-pointer "
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
                <span className="font-bold">Quantity: </span>
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
                <span className="font-bold">Courier: </span>
                <span>null</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Team Code: </span>
                <span>SAVE_k544sdwtetr</span>
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
                <span className="font-bold">Supplier Tracking: </span>
                <span>Not Added</span>
              </p>
            </div>
            <div className="w-1/2 px-4">
              <h3 className="text-2xl font-medium mb-6">Update</h3>
              <form>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Courier</label>
                  <select
                    className="border border-[#8633FF] outline-[#8633FF] py-1 pl-2 rounded"
                    id="gender"
                    name="gender"
                  >
                    <option value="none" selected>
                      Courier
                    </option>
                    <option value="male">Courier-1</option>
                    <option value="female">Courier-2</option>
                    <option value="other">Courier-3</option>
                  </select>
                </div>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Supplier Tracking</label>
                  <input
                    type="text"
                    placeholder="Supplier Tracking"
                    className="border border-[#8633FF] outline-[#8633FF] py-1 pl-2 rounded"
                    id="supplierTracking"
                    name="supplierTracking"
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
