import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { useState } from "react";

export default function AdminVRPage() {
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (adminVA) => {
      return axios.post('/api/v1/admin_va_api/create_admin_va', adminVA)
    },
  })

  const handleCreateAdminVA = async (event) => {
    event.preventDefault()

    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const username = form.username.value;

    if (password !== confirmPassword) {
      return console.log('Password and confirm password must be same!')
    }

    const adminVA = { admin_id: user.admin_id, admin_va_id: uuidv4(), full_name: name, email, username, password, role: 'Admin VA' }

    try {
      const { status } = await mutateAsync(adminVA)
      if (status === 201) {
        form.reset()
        Swal.fire(
          'Created!',
          'New admin VA created successfully!',
          'success'
        )
      }
      else if (status === 200) {
        setSuccessMessage('')
        setErrorMessage('Email already exist!')
      }
    } catch (error) {
      setSuccessMessage('')
      setErrorMessage('Failed to create new admin VA')
      console.log(error)
    }
  }

  return (
    <div className="py-10 ">
      <h3 className="text-2xl font-bold text-center">Add New Admin</h3>
      <form onSubmit={handleCreateAdminVA}>
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
          </div>
        </div>
        <div className="flex justify-center">
          <button type="submit" disabled={isLoading} className="flex gap-2 items-center justify-center bg-[#8633FF] px-36 w-fit mt-8 py-3 rounded-md text-white">
            {isLoading && <FaSpinner size={20} className="animate-spin" />}
            <p>Create Admin</p>
          </button>
        </div>
      </form>
    </div>
  );
}
