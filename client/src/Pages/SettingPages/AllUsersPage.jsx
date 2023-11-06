import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiTrash } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

export default function AllUsersPage() {
  const { user } = useAuth()

  const { data = [], refetch } = useQuery({
    queryKey: ['all_users_list'],
    queryFn: async () => {
      try {
        const res = await axios.post('/api/v1/admin_api/get_all_users_list', { user })
        if (res.status === 200) {
          return res.data
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

  return (
    <div className="overflow-x-auto py-10">
      <table className="table table-md">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Email</th>
            <th>User Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((user, index) => {
            return (
              <tr key={index} className={`${index % 2 == 1 && "bg-gray-100"}`}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{
                  user?.role
                }
                </td>
                <td className="flex gap-2">

                  <button onClick={() => handleDeleteUser(user)} className="flex gap-1 items-center border border-gray-400 py-[2px] px-2 rounded-[4px] hover:bg-red-500 hover:text-white transition-all duration-150">
                    <FiTrash />
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
