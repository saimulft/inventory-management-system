import { AiOutlineSearch } from "react-icons/ai";
import { LiaGreaterThanSolid } from "react-icons/lia";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function StoreAllStockTable() {
  const {user} = useAuth()

  const { data = [] } = useQuery({
    queryKey: ['all_stock_data'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/all_stock_api/get_all_stock_data?admin_id=${user?.admin_id}`)
        if (res.status === 200) {
          return res.data.data;
        }
        return []
      } catch (error) {
        console.log(error)
        return[]
      }
    }
  })

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
        <table className="table table-sm">
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
                  <td>{d.upin}</td>
                  <td>{d.product_name}</td>
                  <td>{d.received_quantity}</td>
                  <td>{d.total_sold ? `${d.total_sold}` : '-'}</td>
                  <td>{d.stock}</td>
                  <td>${d.unit_price}</td>
                  <td>{d.sold_price ? `$${d.sold_price}` : '-'}</td>
                  <td>{d.remaining_price ? `$${d.remaining_price}` : '-'}</td>
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
