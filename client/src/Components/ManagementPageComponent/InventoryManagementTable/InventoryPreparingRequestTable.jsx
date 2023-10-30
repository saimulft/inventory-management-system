
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query";
import { LiaGreaterThanSolid, LiaShippingFastSolid } from "react-icons/lia";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import FileDownload from "../../Shared/FileDownload";
import { useState } from "react";
import Loading from "../../Shared/Loading";

export default function StorePreparingRequestTable() {
  const { user } = useAuth()
  const [filterDays, setFilterDays] = useState('')

  const { data = [], refetch, isLoading } = useQuery({
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


  const handleRTS = async (_id, quantity, upin) => {

    const res = await axios.get(`/api/v1/all_stock_api/all_stock_by_upin?upin=${upin}`)

    if (res.status === 200) {
      if (parseInt(quantity) > parseInt(res?.data?.data?.stock)) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Product is not available in stock. Please check product quantity under UPIN ${upin}`,
        })
        return
      }
    }

    if (parseInt(quantity) <= parseInt(res?.data?.data?.stock)) {
      Swal.fire({
        title: 'Confirm ready to ship?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8633FF',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {

          axios.post(`/api/v1/ready_to_ship_api/ready_to_ship?id=${_id}`)
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

  }

  const handleOOS = (_id) => {

    Swal.fire({
      title: 'Confirm out of stock?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8633FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/v1/out_of_stock_api/out_of_stock?id=${_id}`)
          .then(res => {
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
      
      <div className="relative flex justify-between items-center mt-4">
        <div>
          <div className="flex gap-4 text-sm items-center">
            <p onClick={() => setFilterDays('today')} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 'today' && 'bg-[#8633FF] text-white'}`}>
              Today
            </p>
            <p onClick={() => setFilterDays(7)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 7 && 'bg-[#8633FF] text-white'}`}>
              7 Days
            </p>
            <p onClick={() => setFilterDays(15)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 15 && 'bg-[#8633FF] text-white'}`}>
              15 Days
            </p>
            <p onClick={() => setFilterDays(1)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 1 && 'bg-[#8633FF] text-white'}`}>
              1 Month
            </p>
            <p onClick={() => setFilterDays('year')} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 'year' && 'bg-[#8633FF] text-white'}`}>
              Year
            </p>
            <p onClick={() => setFilterDays('custom')} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 'custom' && 'bg-[#8633FF] text-white'}`}>
              Custom
            </p>
          </div>
        </div>
        <input
          className="border bg-white shadow-md border-[#8633FF] outline-none w-1/4 cursor-pointer  py-2 rounded-md px-2 text-sm"
          placeholder="Search Here"
          type="text"
        />
        <div className="absolute bottom-[7px] cursor-pointer p-[2px] rounded right-[6px] bg-[#8633FF]  text-white ">
          <AiOutlineSearch size={20} />
        </div>
      </div>

      <div className="overflow-x-auto mt-8 min-h-[calc(100vh-288px)] max-h-full">
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
          <tbody className="relative">
            {isLoading ? <Loading /> : data.map((d, index) => {
              return (
                <tr
                  className={`${index % 2 == 1 && "bg-gray-200"} py-2`}
                  key={index}
                >
                  <th>{format(new Date(d.date), "y/MM/d")}</th>
                  <th className="font-normal">{d.store_name}</th>
                  <td>{d.asin_upc_code}</td>
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
                      handleRTS(d._id, d.quantity, d.upin)

                    }} className="text-xs border border-[#8633FF] px-2 rounded-[3px] flex items-center gap-1 hover:bg-[#8633FF] transition hover:text-white text-[#8633FF] py-[2px]">
                      <LiaShippingFastSolid />
                      <p>RTS</p>
                    </button>


                    <button onClick={() => {
                      handleOOS(d._id)
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
        
        {/* pagination */}
        {!isLoading &&
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
        }
      </div>
    </div>
  );
}
