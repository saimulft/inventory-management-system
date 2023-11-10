import { AiOutlineSearch } from "react-icons/ai";
import { LiaGreaterThanSolid } from "react-icons/lia";

export default function InventoryAllStockTable() {
  const data = [
    {
      store_name: "DeveloperLook LLC",
      UPIN: "SAVE973_LLC_B010SI56F",
      product_name:
        "Diversfield Brand kry500 Krylon Triple Thick Glaze Artist Spray",
      total_received: 23,
      total_sold: 23,
      stock: 23,
      purchase_price: 23,
      sold_price: 23,
      remaining_price: 23,
    },
    {
      store_name: "DeveloperLook LLC",
      UPIN: "SAVE973_LLC_B010SI56F",
      product_name:
        "Diversfield Brand kry500 Krylon Triple Thick Glaze Artist Spray",
      total_received: 23,
      total_sold: 23,
      stock: 23,
      purchase_price: 23,
      sold_price: 23,
      remaining_price: 23,
    },
    {
      store_name: "DeveloperLook LLC",
      UPIN: "SAVE973_LLC_B010SI56F",
      product_name:
        "Diversfield Brand kry500 Krylon Triple Thick Glaze Artist Spray",
      total_received: 23,
      total_sold: 23,
      stock: 23,
      purchase_price: 23,
      sold_price: 23,
      remaining_price: 23,
    },
    {
      store_name: "DeveloperLook LLC",
      UPIN: "SAVE973_LLC_B010SI56F",
      product_name:
        "Diversfield Brand kry500 Krylon Triple Thick Glaze Artist Spray",
      total_received: 23,
      total_sold: 23,
      stock: 23,
      purchase_price: 23,
      sold_price: 23,
      remaining_price: 23,
    },
    {
      store_name: "DeveloperLook LLC",
      UPIN: "SAVE973_LLC_B010SI56F",
      product_name:
        "Diversfield Brand kry500 Krylon Triple Thick Glaze Artist Spray",
      total_received: 23,
      total_sold: 23,
      stock: 23,
      purchase_price: 23,
      sold_price: 23,
      remaining_price: 23,
    },
  ];

  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">All Stocks</h3>
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
              <th>Store Name</th>
              <th>UPIN</th>
              <th>Product Name</th>
              <th>Total Received</th>
              <th>Total Sold</th>
              <th>Stock</th>
              <th>Purchase Price</th>
              <th>Sold Price</th>
              <th>Remaining Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, index) => {
              return (
                <tr
                  className={`${index % 2 == 1 && "bg-gray-200"}`}
                  key={index}
                >
                  <th>{d.store_name}</th>
                  <td>{d.UPIN}</td>
                  <td>{d.product_name}</td>
                  <td>{d.total_received}</td>
                  <td>{d.total_sold}</td>
                  <td>{d.stock}</td>
                  <td>${d.purchase_price}</td>
                  <td>${d.sold_price}</td>
                  <td>${d.remaining_price}</td>
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
