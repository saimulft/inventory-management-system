import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiTrash } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import Loading from "../../Components/Shared/Loading";
import { useState } from "react";
import Select from 'react-select';
import { FaRegEdit, FaSpinner } from "react-icons/fa";
import { HiOutlineEye } from "react-icons/hi";

export default function AllUsersPage() {
  const { user } = useAuth()
  const [isOpenUserModal, setIsOpenUserModal] = useState(false)
  const [isOpenWarehouseModal, setIsOpenWarehouseModal] = useState(false)
  const [singleUser, setSingleUser] = useState({})
  const [storeOption, setStoreOption] = useState([])
  const [matchedOpiton, setMatchedOption] = useState([])
  const [updateLoading, setUpdateLoading] = useState(false)
  const [warehouseLoading, setWarehouseLoading] = useState(false)
  const [updateMessage, setUpdateMssage] = useState('')
  const [warehouseDetails, setWareHouseDetails] = useState({})

  const { data = [], refetch, isLoading } = useQuery({
    queryKey: ['all_users_list'],
    queryFn: async () => {
      try {
        const res = await axios.post('/api/v1/admin_api/get_all_users_list', { user })
        if (res.status === 200) {
          if (user.role === 'Admin VA') {
            const filterData = res.data.filter(u => user.role !== u.role)
            return filterData
          } else {
            return res.data
          }
        }
        if (res.status === 204) {
          return []
        }
      } catch (error) {
        console.log(error)
        return []
      }
    }
  })
  useQuery({
    queryKey: ['all_store_options'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/admin_api/get_all_stores?admin_id=${user.admin_id}&role=${user.role}&email=${user.email}`)
        if (res.status === 200) {
          // console.log(res.data);
          const storeOp = res.data.stores.map(s => {
            return { label: s.store_name, value: s._id }
          })
          setStoreOption(storeOp)
          return res.data.stores
        }
        if (res.status === 204) {
          return []
        }
      } catch (error) {
        console.log(error)
        return []
      }
    }
  })

  const handleDeleteUser = (user) => {
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
        axios.post(`/api/v1/admin_api/delete_user`, { user })
          .then(res => {
            if (res.status === 200) {
              refetch()
              Swal.fire(
                'Deleted!',
                'Data has been deleted.',
                'success'
              )

            }
            if (res.status === 204) {
              Swal.fire(
                'Something went wrong!',
                'Something went wrong when deleting user.',
                'warning'
              )
            }
          }).catch(err => console.log(err))
      }
    })

  }

  const handleEdit = (user) => {
    setMatchedOption([])
    setIsOpenUserModal(true)
    setSingleUser(user)
    axios.get(`/api/v1/admin_api/get_user_access_data?email=${user.email}&role=${user.role}`)
      .then(res => {
        if (res.status === 200) {
          const defaultOption = res.data.storeData.map(s => {
            return { label: s.store_name, value: s._id }
          })
          setMatchedOption(defaultOption)
        }
      })
      .catch(err => console.log(err))
  }

  const handleView = (user) => {
    setIsOpenWarehouseModal(true)
    setWarehouseLoading(true)
    axios.get(`/api/v1/admin_api/get_ware_house_user_details?email=${user.email}&role=${user.role}`)
      .then(res => {
        if (res.status === 200) {
          setWareHouseDetails(res.data.warehouse)
        }
      })
      .catch(err => console.log(err))
      .finally(() => setWarehouseLoading(false))
  }
  const handleAccessUpdate = (email, role) => {

    if (!matchedOpiton.length) {
      return
    }
    const updatedIds = matchedOpiton?.map(op => op.value)
    setUpdateLoading(true)
    axios.post(`/api/v1/admin_api/update_user_access_data?email=${email}&role=${role}`, { updatedIds: updatedIds })
      .then(res => {
        if (res.status === 200) {
          setUpdateMssage("Data updated")
          setTimeout(() => {
            setUpdateMssage("")
          }, 1000);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setUpdateLoading(false))
  }

  return (
    <>
      <div className=" py-10 min-h-[calc(100vh-310px)] max-h-full">
        <table className="table table-md">
          <thead>
            <tr className="bg-gray-100">
              <th>Name</th>
              <th>Email</th>
              <th>User Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="relative">
            {!isLoading && !data.length ? <p className="absolute top-[230px] flex items-center justify-center w-full text-rose-500 text-xl font-medium">User not added yet!</p> : <></>}
            {isLoading ? <Loading top="230px" /> : data?.map((user, index) => {
              return (
                <tr key={index} className={`${index % 2 == 1 && "bg-gray-100"}`}>
                  <td>{user.full_name}</td>
                  <td>{user.email}{!user.email_verified && <span className="ml-3 py-1 px-2 rounded text-xs  font-medium tracking-wide text-white bg-[#2e2e30] ">Pending</span>}</td>
                  <td>{
                    user?.role
                  }
                  </td>
                  <td>
                    <div className="flex  gap-x-2">

                      <button onClick={() => handleDeleteUser(user)} className="flex gap-1 items-center border border-gray-400 py-[2px] px-2 rounded-[4px] hover:bg-red-500 hover:text-white transition-all duration-150">
                        <FiTrash />
                        Delete
                      </button>
                      {(user.role === 'Store Owner' || user.role === 'Store Manager Admin' || user.role === 'Store Manager VA') && <button onClick={() => handleEdit(user)} className="flex gap-1 items-center border border-gray-400 py-[2px] px-2 rounded-[4px] hover:bg-[#8633FF] hover:text-white transition-all duration-150">
                        <FaRegEdit />
                        Edit
                      </button>}
                      {(user.role === 'Warehouse Admin' || user.role === 'Warehouse Manager VA') && <button onClick={() => {
                        handleView(user)
                        setSingleUser(user)
                      }} className="flex gap-1 items-center border border-gray-400 py-[2px] px-2 rounded-[4px] hover:bg-[#8633FF] hover:text-white transition-all duration-150">
                        <HiOutlineEye />
                        View
                      </button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* user edit modal */}

      {isOpenUserModal && <div onClick={() => { setIsOpenUserModal(false) }} className="flex justify-center items-center w-full h-screen fixed bg-[#00000030] top-0 left-0 right-0 bottom-0 z-50">
        <div onClick={(e) => e.stopPropagation()} className="relative w-[30%] min-h-[25%] bg-white rounded-md p-5 ">
          <h1 className="text-xl font-medium">{singleUser?.full_name}</h1>
          <p className="font-medium text-gray-400">{singleUser?.role}</p>

          <Select
            className="mt-5"
            options={storeOption}
            isMulti
            onChange={setMatchedOption}
            defaultValue={matchedOpiton}
            key={matchedOpiton.length}
            isLoading={matchedOpiton.length <= 0}
          />

          <div className="flex  justify-between items-center mt-4">
            <span className=" left-7 bottom-7 text-green-700  font-bold">{updateMessage}</span>

            <div className="flex gap-x-2 items-center">
              {updateLoading && <FaSpinner size={28} className="animate-spin text-[#8633FF] " />}
              <button onClick={() => handleAccessUpdate(singleUser.email, singleUser.role)} disabled={updateLoading} className="bg-[#8633FF] flex gap-x-2 items-center py-2 px-5 rounded-md text-white  right-7 bottom-7"> Update</button>
            </div>
          </div>
        </div>
      </div>}
      {isOpenWarehouseModal && <div onClick={() => { setIsOpenWarehouseModal(false) }} className="flex justify-center items-center w-full h-screen fixed bg-[#00000030] top-0 left-0 right-0 bottom-0 z-50">
        <div onClick={(e) => e.stopPropagation()} className="relative w-[30%] min-h-[25%] bg-white rounded-md p-5 ">
          <h1 className="text-xl font-medium">{singleUser?.full_name}</h1>
          <p className="font-medium text-gray-400 mb-2">{singleUser?.role}</p>

          {warehouseLoading ? <FaSpinner size={28} className="animate-spin text-[#8633FF] mt-8 mx-auto" /> : <div>
            <p className="font-bold">Warehouse Name : {warehouseDetails.warehouse_name}</p>
            <p className="font-bold">Warehouse Adress : {warehouseDetails.address}</p>
            <p className="font-bold">Warehouse City : {warehouseDetails.city}</p>
            <p className="font-bold">Warehouse Country : {warehouseDetails.country}</p>
            <p className="font-bold">Warehouse State : {warehouseDetails.state}</p>
          </div>}

        </div>
      </div>}

    </>
  );
}
