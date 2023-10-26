
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query";
import { LiaShippingFastSolid } from "react-icons/lia";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import FileDownload from "../../Shared/FileDownload";


export default function StorePreparingRequestTable() {
  // const [RTSdata ,setRTSdata] = useState({})
  const { user } = useAuth()
  const { data = [], refetch } = useQuery({
    queryKey: ['preparing_request_data'],
    queryFn: async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/preparing_form_api/get_all_preparing_request_data?id=${user?.admin_id}`)
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


  const handleRTS = (RTSdata) => {
    Swal.fire({
      title: 'Confirm ready to ship?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8633FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/v1/ready_to_ship_api/ready_to_ship`, RTSdata)
          .then(res => {
            if (res.status === 201) {
              Swal.fire(
                'Shipped!',
                'Product has been Shipped.',
                'success'
              )
              refetch()
            }
          }).catch(err => console.log(err))
      }
    })
  }
  const handleOOS = (OOSdata) => {

    Swal.fire({
      title: 'Confirm out of stock?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8633FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/v1/out_of_stock_api/out_of_stock`, OOSdata)
          .then(res => {
            console.log(res)
            if (res.status === 201) {
              Swal.fire(
                'Added to out of stock!',
                'Product has been Added to out of stock.',
                'success'
              )
              refetch()
            }
          }).catch(err => console.log(err))



      }
    })
  }
  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">
        Preparing Request : {data?.length}
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
              <th>Invoice level</th>
              <th>Shipping level</th>
              <th>Notes</th>
              <th>Status</th>
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
                  <td>{d.invoice_file && <FileDownload fileName={d.invoice_file} />}</td>
                  <td>{d.shipping_file && <FileDownload fileName={d.shipping_file} />}</td>
                  <td>{d.notes}</td>
                  <td className="flex gap-2">

                    <button onClick={() => {
                      handleRTS(d)

                    }} className="text-xs border border-[#8633FF] px-2 rounded-[3px] flex items-center gap-1 hover:bg-[#8633FF] transition hover:text-white text-[#8633FF] py-[2px]">
                      <LiaShippingFastSolid />
                      <p>RTS</p>
                    </button>


                    <button onClick={() => {
                      handleOOS(d)
                    }} className="text-xs border border-[#8633FF] px-2 rounded-[3px] flex items-center gap-1 hover:bg-[#8633FF] transition hover:text-white text-[#8633FF] py-[2px]">
                      <LiaShippingFastSolid />
                      <p>OOS</p>
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
