import { AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { LiaGreaterThanSolid } from "react-icons/lia";

export default function ShippedTable() {
  const data = [
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      order_ID: "20000004245",
      supplier_tracking: "sfsad52112sdf",
      shipping_label: "Not Added",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      supplier_tracking: "sfsad52112sdf",
      order_ID: "20000004245",
      shipping_label: "Not Added",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      supplier_tracking: "sfsad52112sdf",
      order_ID: "20000004245",
      shipping_label: "Not Added",
    },
    {
      date: "2023-06-26",
      store_name: "DeveloperLook`",
      ASIN_UPC: "B015KJKHH123",
      code_type: "ASIN",
      product_name: "Thick Glaze Artist Spray",
      UPIN: "SAVE973_LLC_B010S",
      quantity: 23,
      courier: "UPS",
      supplier_tracking: "sfsad52112sdf",
      order_ID: "20000004245",
      shipping_label: "Not Added",
    },
  ];

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
                  <th>{d.date}</th>
                  <th className="font-normal">{d.store_name}</th>
                  <td>{d.ASIN_UPC}</td>
                  <td>{d.code_type}</td>
                  <td className="text-[#8633FF]">{d.product_name}</td>
                  <td>{d.UPIN}</td>
                  <td>{d.quantity}</td>
                  <td>{d.courier}</td>
                  <td>{d.order_ID}</td>
                  <td className="text-[#8633FF]">{d.supplier_tracking}</td>
                  <td className="cursor-pointer text-[#8633FF]">Click</td>
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
        <div className="modal-box">
          <div className="px-8 py-10">
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
              <span className="font-medium">Order Qnt: </span>
              <span>23</span>
            </p>
            <p className="mt-2">
              <span className="font-medium">Received Qnt: </span>
              <span>23</span>
            </p>
            <p className="mt-2">
              <span className="font-medium">Missing Qnt: </span>
              <span>23</span>
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
              <span className="font-medium">EDA: </span>
              <span>2023-06-26</span>
            </p>
            <p className="mt-2">
              <span className="font-medium">Supplier Tracking: </span>
              <span>Not Added</span>
            </p>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
