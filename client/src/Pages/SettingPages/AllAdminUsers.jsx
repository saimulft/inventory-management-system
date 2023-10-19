import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiTrash } from "react-icons/fi";
import Swal from "sweetalert2";

const AllAdminUsers = () => {
    const { data: adminUsers = [], refetch } = useQuery({
        queryKey: ['admin_users'],
        queryFn: async () => {
            const res = await axios.get('/api/v1/admin_api/admin_users')
            if (res.status === 200) {
                return res.data
            }
        }
    })

    const handleDeleteAdminUser = (adminId) => {
        try {
            axios.delete('/api/v1/admin_api/admin_users', { data: { admin_id: adminId } })
                .then(res => {
                    if (res.status === 200) {
                        refetch()
                        Swal.fire(
                            'Deleted',
                            'Successfully deleted an admin!',
                            'success'
                        )
                    }
                })
        } catch (error) {
            console.log(error)
        }
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
                    {adminUsers.map((user, index) => {
                        return (
                            <tr key={user.admin_id} className={`${index % 2 == 1 && "bg-gray-100"}`}>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleDeleteAdminUser(user.admin_id)} className="flex gap-1 items-center border border-gray-400 py-[2px] px-2 rounded-[4px] hover:bg-red-500 hover:text-white transition-all duration-150">
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
};

export default AllAdminUsers;