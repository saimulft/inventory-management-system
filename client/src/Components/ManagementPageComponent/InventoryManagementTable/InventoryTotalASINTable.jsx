import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";

import { LiaGreaterThanSolid } from "react-icons/lia";

export default function InventoryTotalASINTable() {
  const data = [
    {
      date: "2023-06-26",
      ASIN_UPC: "B015KJKHH123",
      product_name: "Thick Glaze Artist Spray",
      min_price: 35,
      code_type: "ASIN",
      store_manager: "Saidul Basar",
      product_img: "https://test.img",
    },
    {
      date: "2023-06-26",
      ASIN_UPC: "B015KJKHH123",
      product_name: "Thick Glaze Artist Spray",
      min_price: 35,
      code_type: "ASIN",
      store_manager: "Saidul Basar",
      product_img: "https://test.img",
    },
    {
      date: "2023-06-26",
      ASIN_UPC: "B015KJKHH123",
      product_name: "Thick Glaze Artist Spray",
      min_price: 35,
      code_type: "ASIN",
      store_manager: "Saidul Basar",
      product_img: "https://test.img",
    },
    {
      date: "2023-06-26",
      ASIN_UPC: "B015KJKHH123",
      product_name: "Thick Glaze Artist Spray",
      min_price: 35,
      code_type: "ASIN",
      store_manager: "Saidul Basar",
      product_img: "https://test.img",
    },
    {
      date: "2023-06-26",
      ASIN_UPC: "B015KJKHH123",
      product_name: "Thick Glaze Artist Spray",
      min_price: 35,
      code_type: "ASIN",
      store_manager: "Saidul Basar",
      product_img: "https://test.img",
    },
    {
      date: "2023-06-26",
      ASIN_UPC: "B015KJKHH123",
      product_name: "Thick Glaze Artist Spray",
      min_price: 35,
      code_type: "ASIN",
      store_manager: "Saidul Basar",
      product_img: "https://test.img",
    },
    {
      date: "2023-06-26",
      ASIN_UPC: "B015KJKHH123",
      product_name: "Thick Glaze Artist Spray",
      min_price: 35,
      code_type: "ASIN",
      store_manager: "Saidul Basar",
      product_img: "https://test.img",
    },
  ];

  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">
        Total ASIN/UPC: 8,451
      </h3>
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
              <th>ASIN/UPC</th>
              <th>Product Name</th>
              <th>Min Price</th>
              <th>Code Type</th>
              <th>Store Manager</th>
              <th>Product Image</th>
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
                  <td>{d.ASIN_UPC}</td>
                  <td className="text-[#8633FF]">{d.product_name}</td>
                  <td>{d.min_price}</td>
                  <td>{d.code_type}</td>
                  <td>{d.store_manager}</td>
                  <td>{d.product_img}</td>
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
                <span className="font-medium">Store Manager: </span>
                <span>Saidul Basar</span>
              </p>

              <p className="mt-2">
                <span className="font-medium">Product Name: </span>
                <span>demo product name</span>
              </p>
              <p className="mt-2">
                <span className="font-medium">Old Min Price: </span>
                <span>$35</span>
              </p>
            </div>
            <div className="w-1/2 px-4">
              <h3 className="text-2xl font-medium">Update</h3>
              <form>
                <div className="flex flex-col mt-4">
                  <label className="text-slate-500">New Min Price</label>
                  <input
                    type="text"
                    placeholder="Enter new min price"
                    className="input input-bordered input-primary w-full input-sm mt-2"
                    id="storeManagerName"
                    name="storeManagerName"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Product Image</label>
                  <div className="flex items-center w-full mt-2">
                    <label
                      htmlFor="shippingLabel-dropzone"
                      className="flex justify-between items-center px-4 w-full h-fit border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 shadow-lg"
                    >
                      <div className="flex items-center gap-5 py-[4px]">
                        <svg
                          className="w-6 h-6 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                      </div>
                      <input
                        id="invoice-dropzone"
                        name="invoice-dropzone"
                        type="file"
                        className="hidden"
                      />
                      <div className="ml-5">
                        <button
                          onClick={() => {
                            document.getElementById("invoice-dropzone").click();
                          }}
                          type="button"
                          className="btn btn-outline btn-primary btn-xs"
                        >
                          select file
                        </button>
                      </div>
                    </label>
                  </div>
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
