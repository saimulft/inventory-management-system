import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";

import { LiaGreaterThanSolid } from "react-icons/lia";

export default function OutOfStockTable() {
  const data = [
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      order_ID: "20000004245",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      supplier_tracking: "sfsad52112sdf",
      notes: "-",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      order_ID: "20000004245",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      supplier_tracking: "sfsad52112sdf",
      notes: "-",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      order_ID: "20000004245",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      supplier_tracking: "sfsad52112sdf",
      notes: "-",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      order_ID: "20000004245",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      supplier_tracking: "sfsad52112sdf",
      notes: "-",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      order_ID: "20000004245",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      supplier_tracking: "sfsad52112sdf",
      notes: "-",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      order_ID: "20000004245",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      supplier_tracking: "sfsad52112sdf",
      notes: "-",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      order_ID: "20000004245",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      supplier_tracking: "sfsad52112sdf",
      notes: "-",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      order_ID: "20000004245",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      supplier_tracking: "sfsad52112sdf",
      notes: "-",
    },
  ];

  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">Out Of Stock: 46</h3>
      <div className="relative flex justify-end">
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
              <th>Order ID</th>
              <th>Product Name</th>
              <th>UPIN</th>
              <th>Quantity</th>
              <th>Courier</th>
              <th>Supplier Tracking</th>
              <th>Shipping label</th>
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
                  <td>{d.order_ID}</td>
                  <td className=" text-[#8633FF]">{d.product_name}</td>
                  <td>{d.UPIN}</td>
                  <td>{d.quantity}</td>
                  <td>{d.courier}</td>
                  <td className=" text-[#8633FF]">{d.supplier_tracking}</td>
                  <td className="cursor-pointer text-[#8633FF]">Click</td>
                  <td>{d.notes}</td>
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
        <div className="modal-box">
          <div className="flex">
            <div className="w-1/2">
              <div className="flex items-center mb-4 gap-2">
                <BiSolidEdit size={24} />
                <h3 className="text-2xl font-medium">Details</h3>
              </div>
              <p className="mt-2">
                <span className="font-medium">Data: </span>
                <span>2023-06-26</span>
              </p>
              <p className="mt-2">
                <span className="font-medium">Store Name: </span>
                <span>SAVE_k544.LLC</span>
              </p>
              <p className="mt-2">
                <span className="font-medium">ASIN: </span>
                <span>BOHFK4522</span>
              </p>
              <p className="mt-2">
                <span className="font-medium">Quantity: </span>
                <span>23</span>
              </p>
              <p className="mt-2">
                <span className="font-medium">Courier: </span>
                <span>USPC</span>
              </p>

              <p className="mt-2">
                <span className="font-medium">UPIN: </span>
                <span>USAfsdfds</span>
              </p>

              <p className="mt-2">
                <span className="font-medium">Product Name: </span>
                <span>demo product name</span>
              </p>

              <p className="mt-2">
                <span className="font-medium">Supplier Tracking: </span>
                <span>Not Added</span>
              </p>
            </div>
            <div className="w-1/2 px-4">
              <h3 className="text-2xl font-medium">Update</h3>
              <form>
                <div className="flex flex-col mt-4">
                  <label className="text-slate-500">Remark</label>
                  <input
                    type="text"
                    placeholder="Enter remark here"
                    className="input input-bordered input-primary w-full input-sm mt-2"
                    id="storeManagerName"
                    name="storeManagerName"
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-slate-500">Status</label>
                  <select
                    className="select select-primary w-full select-sm mt-2"
                    name="country"
                    id="country"
                  >
                    <option disabled selected>
                      Status
                    </option>
                    <option>status-1</option>
                    <option>status-2</option>
                    <option>status-3</option>
                  </select>
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
