import { useContext, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
// import { LiaGreaterThanSolid } from "react-icons/lia";
import { GlobalContext } from "../../../Providers/GlobalProviders";
import axios from "axios";
import { format } from "date-fns"
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";


export default function StorePreparingRequestTable() {

  const { isSidebarOpen } = useContext(GlobalContext);
  const navigate = useNavigate()
  const [singleData, setSingleData] = useState()

  const marginLeft = isSidebarOpen ? "18.5%" : "6%";
  const { data: preparingRequestData = [], refetch } = useQuery({
    queryKey: ['preparing_request_data'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/v1/preparing_form_api/get_all_preparing_request_data')
        if (res.status === 200) {
          return res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const data = preparingRequestData
  const handleDelete = (_id) => {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8633FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/v1/preparing_form_api/delete_preparing_request_data?id=${_id}`)
          .then(res => {
            if (res.status === 200) {
              Swal.fire(
                'Deleted!',
                'Data has been deleted.',
                'success'
              )
              refetch()
            }
          }).catch(err => console.log(err))



      }
    })
  }
  console.log(import.meta.env.VITE_IMAGE_BASE_URL)
  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">
        Preparing Request : {preparingRequestData?.length}
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
              <th></th>
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
                  <td>{d.invoice_file && <button  className="bg-[#8633FF] w-full rounded text-white font-medium">Image</button>}</td>
                  <td>{d.shipping_file && <button  className="bg-[#8633FF] w-full rounded text-white font-medium">Image</button>}</td>
                  <td>{d.notes}</td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <label
                        tabIndex={0}
                      >
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

      </div>
      {/* modal content  */}

      <dialog id="my_modal_2" className="modal">
        <div style={{ marginLeft }} className="modal-box py-10 px-10">
          <div className="flex">
            <div className="w-100">
              <div className="flex items-center mb-6 gap-2">
                <BiSolidEdit size={24} />
                <h3 className="text-2xl font-medium">Details</h3>
              </div>
              <p className="mt-2">
                <p className="font-bold">Date: </p>
                <input readOnly disabled className="border border-[#8633FF] outline-[#8633FF] p-1 rounded" type="text" defaultValue={singleData && format(new Date(singleData?.date), "y/MM/d")} />
              </p>
              <p className="mt-2">
                <p className="font-bold">Store Name: </p>
                <input readOnly disabled className="border border-[#8633FF] outline-[#8633FF] p-1 rounded" type="text" defaultValue={singleData?.store_name} />
              </p>
              <p className="mt-2">
                <p className="font-bold">ASIN: </p>
                <input readOnly disabled className="border border-[#8633FF] outline-[#8633FF] p-1 rounded" type="text" defaultValue={singleData?.code_type} />
              </p>
              <p className="mt-2">
                <p className="font-bold">Quantity: </p>
                <input className="border border-[#8633FF] outline-[#8633FF] p-1 rounded" type="number" defaultValue={singleData?.quantity} />
              </p>

              <p className="mt-2">
                <p className="font-bold">Courier: </p>
                <input readOnly disabled className="border border-[#8633FF] outline-[#8633FF] p-1 rounded" type="text" defaultValue={singleData?.courier ? singleData?.courier : ""} />
              </p>

              <p className="mt-2">
                <p className="font-bold">UPIN: </p>
                <input readOnly disabled className="border border-[#8633FF] outline-[#8633FF] p-1 rounded" type="text" defaultValue={singleData?.upin} />
              </p>

              <p className="mt-2">
                <p className="font-bold">Product Name: </p>
                <input className="border border-[#8633FF] outline-[#8633FF] p-1 rounded" type="text" defaultValue={singleData?.product_name} />
              </p>

              <p className="mt-2">
                <p className="font-bold">Supplier Tracking: </p>
                <input className="border border-[#8633FF] outline-[#8633FF] p-1 rounded" type="text" defaultValue={singleData?.tracking_number ? singleData?.tracking_number : ""} />
              </p>

              <p className="mt-2">
                <span className="font-bold">Shipping Label: </span>
                <span className="text-[#8633FF] cursor-pointer">Click</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Invoice: </span>
                <span className="text-[#8633FF] cursor-pointer">Click</span>
              </p>
            </div>
            <div className="w-1/2 px-4">
              <h3 className="text-2xl mb-6 font-medium">Update</h3>
              <form>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Courier</label>
                  <select
                    className="border border-[#8633FF] outline-[#8633FF] py-2 text-xs pl-2 rounded"
                    id="courier"
                    name="courier"
                  >
                    <option value="none" selected>
                      USPS
                    </option>
                    <option value="male">Courier-1</option>
                    <option value="female">Courier-2</option>
                    <option value="other">Courier-3</option>
                  </select>
                </div>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Supplier Tracker</label>
                  <input
                    type="text"
                    placeholder="Enter Supplier Tracker"
                    className="border border-[#8633FF] outline-[#8633FF] py-2 text-xs pl-2 rounded"
                    id="supplierTracker"
                    name="supplierTracker"
                  />
                </div>

                <div className="mt-2">
                  <label className="font-bold mb-1">Invoice </label>
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

                      </div>
                    </label>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="font-bold mb-1">Shipping Label</label>
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
                        id="shippingLabel-dropzone"
                        name="shippingLabel-dropzone"
                        type="file"
                        className="hidden"
                      />
                      <div className="ml-5">

                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Note</label>
                  <input
                    type="text"
                    placeholder="Enter Your Note"
                    className="border border-[#8633FF] outline-[#8633FF] py-2 pl-2 rounded text-xs"
                    id="note"
                    name="note"
                  />
                </div>
                <button type="submit" className="bg-[#8633FF] mt-5 w-full py-[6px] rounded text-white font-medium">
                  Update
                </button>
              </form>
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
