import { useContext, useState } from "react";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import { LiaGreaterThanSolid } from "react-icons/lia";
import { GlobalContext } from "../../../Providers/GlobalProviders";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { format } from 'date-fns'
import Swal from "sweetalert2";

export default function StorePendingArrivalTable() {
  const [singleData, setSingleData] = useState({})
  const [isEditable, setIsEditable] = useState(false)
  const { user } = useAuth()
  const { isSidebarOpen } = useContext(GlobalContext);
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";

  const { data = [], refetch } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/pending_arrival_api/get_all_pending_arrival_data?admin_id=${user.admin_id}`)
        if (res.status === 200) {
          return res.data.data;
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const handleDelete = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8633FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/v1/pending_arrival_api/delete_pending_arrival_data?id=${_id}`)
          .then(res => {
            console.log(res)
            if (res.status === 200) {
              refetch()
              Swal.fire(
                'Deleted!',
                'A pending arrival entry has been deleted.',
                'success'
              )
            }
          })
      }
    })
  }

  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">Pending Arrival: 584</h3>

      <div className="overflow-x-auto mt-8">
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
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Courier</th>
              <th>Supplier Tracking</th>
              <th>EDA</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((d, index) => {
              return (
                <tr
                  className={`${index % 2 == 1 && "bg-gray-200"}`}
                  key={index}
                >
                  <th>{format(new Date(d.date), 'yyyy/MM/dd')}</th>
                  <th className="font-normal">{d.store_name}</th>
                  <td>{d.asin_upc_code}</td>
                  <td>{d.code_type}</td>
                  <td>{d.product_name}</td>
                  <td>{d.order_ID ? d.order_ID : '-'}</td>
                  <td>{d.upin}</td>
                  <td>{d.unit_price}</td>
                  <td>{d.quantity}</td>
                  <td>{d.courier ? d.courier : '-'}</td>
                  <td>{d.supplier_tracking ? d.supplier_tracking : '-'}</td>
                  <td>{format(new Date(d.eda), 'yyyy/MM/dd')}</td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0}>
                        <BiDotsVerticalRounded onClick={() => setSingleData(d)} cursor="pointer" />
                      </label>
                      <ul
                        tabIndex={0}
                        className="mt-3 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black"
                      >
                        <li>
                          <button onClick={() => {
                            document.getElementById("my_modal_2").showModal()
                          }
                          }>Edit</button>
                        </li>
                        <li>
                          <button onClick={() => handleDelete(d._id)}>Delete</button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* pagination  */}
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
        <div style={{ marginLeft, maxWidth: '750px'}} className="modal-box py-10 px-10">
          <div className="flex gap-5">
            <div className="w-1/2">
              <div className="flex items-center mb-6 gap-2">
                {user.role === 'Admin' || user.role === 'Admin VA' ? <BiSolidEdit onClick={() => setIsEditable(!isEditable)} size={24} className="cursor-pointer" /> : null}
                <h3 className="text-2xl font-medium">Details</h3>
              </div>
              <div className="flex items-center">
                <label className="font-bold">Date: </label>
                <input type='text' value={singleData.date && format(new Date(singleData.date), 'yyyy/MM/dd')}
                  className="outline-none w-[191px] py-1 pl-2 rounded" id="date" name="date" readOnly />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">Store Name: </label>
                <input type="text" defaultValue={singleData.store_name}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="date" name="date" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">ASIN: </label>
                <input type="text" defaultValue={singleData.asin_upc_code}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="date" name="date" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">Quantity: </label>
                <input type="text" defaultValue={singleData.quantity}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="date" name="date" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">Received Qnt: </label>
                <input type="text" defaultValue={singleData.received_quantity ? singleData.received_quantity : 'null'}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="date" name="date" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">Missing Qnt: </label>
                <input type="text" defaultValue={singleData.missing_quantity ? singleData.missing_quantity : 'null'}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="date" name="date" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">Courier: </label>
                <input type="text" defaultValue={singleData.courier ? singleData.courier : 'null'}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="date" name="date" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">Team Code: </label>
                <input type="text" defaultValue={singleData.team_code ? singleData.team_code : 'null'}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="date" name="date" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">EDA: </label>
                <input type={isEditable ? 'date' : 'text'} defaultValue={singleData.eda && format(new Date(singleData.eda), 'yyyy/MM/dd')}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} w-[191px] py-1 pl-2 rounded`} id="date" name="date" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">Supplier Tracking: </label>
                <input type="text" defaultValue={singleData.supplier_tracking ? singleData.supplier_tracking : 'Not Added'}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="date" name="date" readOnly={!isEditable} />
              </div>
            </div>
            <div className="w-1/2">
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
                  <label className="font-bold mb-1">Supplier Tracking</label>
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
