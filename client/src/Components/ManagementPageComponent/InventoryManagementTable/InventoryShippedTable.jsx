import { useContext, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import { LiaGreaterThanSolid } from "react-icons/lia";
import { GlobalContext } from "../../../Providers/GlobalProviders";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import useAuth from "../../../hooks/useAuth";
import FileDownload from "../../Shared/FileDownload";
import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import Loading from "../../Shared/Loading";

export default function InventoryShippedTable() {
  const [singleData, setSingleData] = useState({})
  const { isSidebarOpen } = useContext(GlobalContext);
  const { user } = useAuth()
  const [filterDays, setFilterDays] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState()

  const { data = [], refetch, isLoading } = useQuery({
    queryKey: ['ready_to_ship_data'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/shipped_api/get_all_shipped_data?admin_id=${user?.admin_id}`)
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
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";

  const handleKeyDown = (event) => {
    const alphabetKeys = /^[0-9\b]+$/; // regex pattern to match alphabet keys
    if (!alphabetKeys.test(event.key) && event.key != "Backspace") {
      event.preventDefault();
    }
  };

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
        axios.delete(`/api/v1/shipped_api/delete_shipped_data?id=${_id}`)
          .then(res => {
            if (res.status === 200) {
              refetch()
              Swal.fire(
                'Deleted!',
                'A shipped entry has been deleted.',
                'success'
              )
            }
          })
          .catch(error => console.log(error))
      }
    })
  }

  const handleUpdate = (event, _id) => {
    event.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    const form = event.target;
    const resaleableQuantity = form.resaleableQuantity.value;
    const remark = form.remark.value;

    if (!resaleableQuantity && !remark) {
      setLoading(false)
      return setErrorMessage('No data entered')
    }

    if (parseInt(resaleableQuantity) > parseInt(singleData.quantity)) {
      setLoading(false)
      setErrorMessage(`Quantity must be less than ${singleData.quantity}`)
      setTimeout(() => {
        setErrorMessage('')
      }, 2000);
      return;
    }

    const updatedData = {
      resaleable_quantity: resaleableQuantity,
      remark: remark
    }

    axios.put(`/api/v1/shipped_api/update_shipped_data?id=${_id}`, updatedData)
      .then(res => {
        if (res.status === 201) {
          setLoading(false)
          form.reset()
          refetch()
          setSuccessMessage('Data update successful!')
          setTimeout(() => {
            setSuccessMessage('')
          }, 2000);
        }
      })
      .catch(error => {
        setLoading(false)
        setErrorMessage('Something went wrong while updating data!')

        setTimeout(() => {
          setErrorMessage('')
        }, 2000);
        console.log(error)
      })
  }

  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">Shipped: {data.length}</h3>

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
              <th>UPIN</th>
              <th>Quantity</th>
              <th>Courier</th>
              <th>Order ID</th>
              <th>Supplier Tracking</th>
              <th>Shipping label</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="relative">
            {isLoading ? <Loading /> : data.map((d, index) => {
              return (
                <tr
                  className={`${index % 2 == 1 && "bg-gray-200"}`}
                  key={index}
                >
                  <th>{d.date && format(new Date(d.date), "y/MM/d")}</th>
                  <th className="font-normal">{d.store_name}</th>
                  <td>{d.asin_upc_code}</td>
                  <td>{d.code_type}</td>
                  <td>{d.product_name}</td>
                  <td>{d.upin}</td>
                  <td>{d.quantity}</td>
                  <td>{d.courier}</td>
                  <td>{d.order_id}</td>
                  <td className="text-[#8633FF]">{d.tracking_number}</td>
                  <td>{d.shipping_file && <FileDownload fileName={d.shipping_file} />}</td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0}>
                        <BiDotsVerticalRounded onClick={() => setSingleData(d)} cursor="pointer" />
                      </label>
                      <ul tabIndex={0} className="mt-3 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black">
                        <li>
                          <button onClick={() => document.getElementById("my_modal_2").showModal()}>Edit</button>
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

      {/* modal content  */}
      <dialog id="my_modal_2" className="modal">
        <div style={{ marginLeft, maxWidth: '750px' }} className="modal-box py-10 px-10">
          <form onSubmit={(event) => handleUpdate(event, singleData._id)} className="flex gap-10">
            <div className="w-1/2">
              <div className="flex items-center mb-6 gap-2">
                <BiSolidEdit size={24} />
                <h3 className="text-2xl font-medium">Details</h3>
              </div>
              <p className="mt-2">
                <span className="font-bold">Date: </span>
                <span>{singleData.date && format(new Date(singleData.date), 'yyyy/MM/dd')}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Store Name: </span>
                <span>{singleData.store_name}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Product Name: </span>
                <span>{singleData.product_name}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Quantity: </span>
                <span>{singleData.quantity}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Shipping Tracking: </span>
                <span className="text-[#8633FF] cursor-pointer">Click</span>
              </p>
            </div>

            <div className="w-1/2">
              <h3 className="text-2xl font-medium mb-6">Update</h3>
              <div className="flex flex-col mt-2">
                <label className=" font-bold mb-1">Resaleable Qnt</label>
                <input
                  type="number"
                  placeholder="Enter Resaleable Qnt"
                  className="border border-[#8633FF] outline-[#8633FF] py-2 pl-2 rounded text-xs"
                  id="resaleableQuantity"
                  name="resaleableQuantity"
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="flex flex-col mt-2">
                <label className=" font-bold mb-1">Remark</label>
                <input
                  type="text"
                  placeholder="Enter Remark"
                  className="border border-[#8633FF] outline-[#8633FF] py-2 pl-2 rounded text-xs "
                  id="remark"
                  name="remark"
                />
              </div>

              <div className="mt-3">
                {successMessage && <p className="w-full flex gap-2 items-center justify-center text-center text-sm font-medium text-green-600 bg-green-100 border py-1 px-4 rounded"><BsCheck2Circle size={20} /> {successMessage}</p>}

                {errorMessage && <p className="w-full flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-1 px-4 rounded"><MdErrorOutline size={20} /> {errorMessage}</p>}
              </div>

              <button className="bg-[#8633FF] flex items-center gap-2 justify-center mt-5 w-full py-[6px] rounded text-white font-medium">
                {loading && <FaSpinner size={20} className="animate-spin" />}
                Update
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
