import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";

import { LiaGreaterThanSolid } from "react-icons/lia";

export default function TotalASINTable() {
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
                  <td>{d.ASIN_UPC}</td>
                  <td className="text-[#8633FF]">{d.product_name}</td>
                  <td>{d.min_price}</td>
                  <td>{d.code_type}</td>
                  <td>{d.store_manager}</td>
                  <td>{d.product_img}</td>
                  <td>
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
    </div>
  );
}
