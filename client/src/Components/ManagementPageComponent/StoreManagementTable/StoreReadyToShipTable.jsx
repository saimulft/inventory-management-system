
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
export default function StorePreparingRequestTable() {
  // const [RTSdata ,setRTSdata] = useState({})
  const {user} = useAuth()

  const { data = [], } = useQuery({
    queryKey: ['ready_to_ship_data'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/ready_to_ship_api/get_all_RTS_data?admin_id=${user?.admin_id}`)
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


  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">
        Ready to ship : {data?.length}
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

      <div className="overflow-x-auto overflow-y-auto mt-8">
        <table className="table table-sm">
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
              <th>Shipping level</th>
              
            </tr>
          </thead>
          <tbody>
            {data.map((d, index) => {
              return (
                <tr
                  className={`${index % 2 == 1 && "bg-gray-200"} py-2`}
                  key={index}
                >
                  <th>{format(new Date(d.date), "y/MM/d")}</th>
                  <th className="font-normal">{d.store_name}</th>
                  <td>{d.code}</td>
                  <td>{d.code_type}</td>
                  <td>{d.product_name}</td>
                  <td>{d.order_id}</td>
                  <td>{d.upin}</td>
                  <td>{d.quantity}</td>
                  <td>{d.courier}</td>
                  <td>{d.tracking_number}</td>
                  <td className="flex gap-2">
                    <button className="text-xs border border-[#8633FF] px-2 rounded-[3px] flex items-center gap-1 hover:bg-[#8633FF] transition whitespace-nowrap py-1 hover:text-white text-[#8633FF]">
                      
                      <p>Download</p>
                    </button>

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
    </div>
  );
}
