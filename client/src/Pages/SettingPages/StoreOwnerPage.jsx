import useAuth from "../../hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import ToastMessage from "../../Components/Shared/ToastMessage";
import SearchDropdown from "../../Utilities/SearchDropdown";

export default function StoreOwnerPage() {
  const { user } = useAuth()
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [storeOption, setStoreOption] = useState(null)

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (storeOwner) => {
      return axios.post('/api/v1/store_owner_api/create_store_owner', storeOwner)
    },
  })

  const { data: allStoreData = [], isLoading: storeLoading } = useQuery({
    queryKey: ['get_all_stores_data'],
    queryFn: async () => {
      try {
        const res = await axios.post('/api/v1/store_api/get_stores_dropdown_data', { user })
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

  const storeIDS = []
  storeOption?.map(store => storeIDS.push(store.value))

  const handleCreateStoreOwner = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const username = form.username.value;

    if (password !== confirmPassword) {
      return setErrorMessage('Password and confirm password must be same!')
    }

    else if (password.length < 6) {
      return setErrorMessage("Password must be at least 6 characters or longer!")
    }

    const storeOwner = { admin_id: user.admin_id, creator_email: user?.email, store_access_ids: storeIDS, full_name: name, email, username, password, role: 'Store Owner' }

    try {
      const { status } = await mutateAsync(storeOwner)
      if (status === 201) {
        form.reset()
        setSuccessMessage(`Successfully created a new store owner and sent an invitation mail to ${email} with login credentials`)
      }
      else if (status === 200) {
        setSuccessMessage('')
        setErrorMessage('Email already exist!')
      }
    } catch (error) {
      setSuccessMessage('')
      setErrorMessage('Failed to create new store owner!')
      console.log(error)
    }
  }

  return (
    <div className="py-10 ">
      <h3 className="text-2xl font-bold text-center">Add New Store Owner</h3>
      <form onSubmit={handleCreateStoreOwner}>
        <div className="flex gap-4 w-full mt-5">
          <div className="w-1/2">
            <div className="mt-3">
              <label className="text-slate-500">Name*</label>
              <input
                type="text"
                placeholder="Enter name"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="name"
                name="name"
                required
              />
            </div>
            <div className="mt-3">
              <label className="text-slate-500">Email*</label>
              <input
                type="email"
                placeholder="Enter email"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="email"
                name="email"
                required
              />
            </div>
            <div className="mt-3">
              <label className="text-slate-500">Confirm password*</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="confirmPassword"
                name="confirmPassword"
                required
              />
            </div>
          </div>

          <div className="w-1/2">
            <div className="mt-3">
              <label className="text-slate-500">Username*</label>
              <input
                type="text"
                placeholder="Enter username"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="username"
                name="username"
                required
              />
            </div>
            <div className="mt-3">
              <label className="text-slate-500">Password*</label>
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="password"
                name="password"
                required
              />
            </div>
            <div className="mt-3">
              <label className="text-slate-500">Select Store</label>
              <SearchDropdown isLoading={storeLoading} isMulti={true} option={storeOption} optionData={allStoreData} placeholder="Select Store" setOption={setStoreOption} />
            </div>
          </div>
        </div>

        <ToastMessage successMessage={successMessage} errorMessage={errorMessage} />

        <div className="flex justify-center">
          <button type="submit" disabled={isLoading} className="flex gap-2 items-center justify-center bg-[#8633FF] px-36 w-fit mt-8 py-3 rounded-md text-white">
            {isLoading && <FaSpinner size={20} className="animate-spin" />}
            <p>Create Store Owner</p>
          </button>
        </div>
      </form>
    </div>
  );
}
