import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from "@tanstack/react-query";

export default function StoreManagerAdminPage() {
  const { user } = useAuth();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (storeManagerAdmin) => {
      return axios.post('/api/v1/store_manager_admin_api/create_store_manager_admin', storeManagerAdmin)
    },
  })

  const handleCreateStoreManagerAdmin = async (event) => {
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

    const storeManagerAdmin = { admin_id: user.admin_id, store_manager_admin_id: uuidv4(), full_name: name, email, username, password, role: 'Store Manager Admin' }

    try {
      const { status } = await mutateAsync(storeManagerAdmin)
      if (status === 201) {
        form.reset()
        Swal.fire(
          'Created!',
          'New store manager admin created successfully!',
          'success'
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="py-10 ">
      <h3 className="text-2xl font-bold text-center">Add New AVA</h3>
      <form onSubmit={handleCreateStoreManagerAdmin}>
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
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button type="submit" disabled={isLoading} className="flex gap-2 items-center justify-center bg-[#8633FF] px-36 w-fit mt-8 py-3 rounded-md text-white">
            {isLoading && <FaSpinner size={20} className="animate-spin" />}
            <p>Create AVA</p>
          </button>
        </div>
      </form>
    </div>
  );
}
