import Swal from "sweetalert2";
import countries from "../../Utilities/countries";
import { FaSpinner } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function WareHouseAdminPage() {
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (warehouseAdmin) => {
      return axios.post('/api/v1/warehouse_admin_api/create_warehouse_admin', warehouseAdmin)
    },
  })

  const handleCreateWarehouseAdmin = async (event) => {
    event.preventDefault()

    const form = event.target;
    const name = form.ownerName.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const username = form.username.value;

    const warehouseName = form.warehouseName.value;
    const address = form.address.value;
    const city = form.city.value;
    const state = form.state.value;
    const zipCode = form.zipCode.value;
    const country = form.country.value;

    if (password !== confirmPassword) {
      return console.log('Password and confirm password must be same!')
    }

    const warehouseAdmin = { admin_id: user.id, warehouse_admin_id: uuidv4(), full_name: name, email, username, password, role: 'Warehouse Admin', warehouse_name: warehouseName, address, city, state, zip: zipCode, country}

    try {
      const { status } = await mutateAsync(warehouseAdmin)
      if (status === 201) {
        form.reset()
        Swal.fire(
          'Created!',
          'New warehouse admin created successfully!',
          'success'
        )
      }
      else if (status === 200) {
        setSuccessMessage('')
        setErrorMessage('Email already exist!')
      }
    } catch (error) {
      setSuccessMessage('')
      setErrorMessage('Failed to create new warehouse admin!')
      console.log(error)
    }
  }

  return (
    <div>
      <div className="py-10 ">
        <h3 className="text-2xl font-bold text-center">
          Add New Warehouse Admin
        </h3>
        <form onSubmit={handleCreateWarehouseAdmin}>
          <div className="flex gap-4 w-full mt-5">
            <div className="w-1/2">
              <div className="mt-3">
                <label className="text-slate-500">Warehouse Name*</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="warehouseName"
                  name="warehouseName"
                  required
                />
              </div>
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

              <div className="mt-4">
                <label className="text-slate-500">Address*</label>
                <input
                  type="text"
                  placeholder="Street Address, P.O.Box, apartment, suit, building, floor"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="address"
                  name="address"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="text-slate-500">State*</label>
                <input
                  type="text"
                  placeholder="Enter state"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="state"
                  name="state"
                  required
                />
              </div>
            </div>

            <div className="w-1/2">
              <div className="mt-3">
                <label className="text-slate-500">Owner Name*</label>
                <input
                  type="text"
                  placeholder="Enter owner name"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="ownerName"
                  name="ownerName"
                  required
                />
              </div>
              <div className="mt-3">
                <label className="text-slate-500">Email*</label>
                <input
                  type="email"
                  placeholder="Enter owner email"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="email"
                  name="email"
                  required
                />
              </div>
              <div className="mt-3">
                <label className="text-slate-500">Confirm Password*</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="confirmPassword"
                  name="confirmPassword"
                  required 
                />
              </div>

              <div className="mt-4">
                <label className="text-slate-500">City*</label>
                <input
                  type="text"
                  placeholder="Enter your city"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="city"
                  name="city"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="text-slate-500">ZIP Code*</label>
                <input
                  type="text"
                  placeholder="Enter zip code"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="zipCode"
                  name="zipCode"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-col">
            <label className="text-slate-500">Country*</label>
            <select
              className="select select-primary w-full mt-2 shadow-lg"
              name="country"
              id="country"
              required
            >
              <option disabled selected>
                Select your country
              </option>
              {countries}
            </select>
          </div>

          <div className="flex justify-center">
            <button type="submit" disabled={isLoading} className="flex gap-2 items-center justify-center bg-[#8633FF] px-36 w-fit mt-8 py-3 rounded-md text-white">
              {isLoading && <FaSpinner size={20} className="animate-spin" />}
              <p>Create Warehouse Admin</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
