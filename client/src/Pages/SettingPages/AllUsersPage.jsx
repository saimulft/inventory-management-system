import { FiEdit, FiTrash } from "react-icons/fi";

export default function AllUsersPage() {

  // table data
  const data = [
    {
      id: 1,
      full_name: "Nabil",
      email: "dlldf@gmail.com",
      role: "Admin"
    },
    {
      id: 2,
      full_name: "Toukir",
      email: "demo.email@testdomain.net",
      role: "Store Manager Admin"
    },
    // Repeat the structure for additional objects with different roles
    {
      id: 3,
      full_name: "John",
      email: "john@example.com",
      role: "Admin VA"
    },
    {
      id: 4,
      full_name: "Alice",
      email: "alice@example.com",
      role: "Store Owner"
    },
    {
      id: 5,
      full_name: "Bob",
      email: "bob@example.com",
      role: "Warehouse Admin"
    },
    {
      id: 6,
      full_name: "Ella",
      email: "ella@example.com",
      role: "Warehouse VA"
    },
    {
      id: 7,
      full_name: "Mike",
      email: "mike@example.com",
      role: "Store Manager VA"
    },
    {
      id: 8,
      full_name: "Sara",
      email: "sara@example.com",
      role: "Store Manager Admin"
    },
    {
      id: 9,
      full_name: "David",
      email: "david@example.com",
      role: "Admin VA"
    },
    {
      id: 10,
      full_name: "Grace",
      email: "grace@example.com",
      role: "Store Owner"
    }
  ];

  // user roles
  const roles = [
    "Admin",
    "Admin VA",
    "Store Owner",
    "Store Manager Admin",
    "Store Manager VA",
    "Warehouse Admin",
    "Warehouse VA",
  ];

  const handleEditUserRole = (id) => {
    console.log(id)
  }

  const handleDeleteUser = (id) => {
    console.log(id)
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
          {data.map((user, index) => {
            return (
              <tr key={index} className={`${index % 2 == 1 && "bg-gray-100"}`}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    style={{ borderRadius: "2px" }}
                    className="select select-bordered w-full select-xs max-w-xs select-primary"
                  >
                    <option defaultValue={user.role}>{user.role}</option>
                    {roles.map((role, index) => (
                      <option key={index}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="flex gap-2">
                  <button onClick={() => handleEditUserRole(user.id)} className="flex gap-1 items-center border border-gray-400 py-[2px] px-2 rounded-[4px] hover:bg-[#8633FF] hover:text-white transition-all duration-150">
                    <FiEdit />
                    <p>Edit</p>
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="flex gap-1 items-center border border-gray-400 py-[2px] px-2 rounded-[4px] hover:bg-red-500 hover:text-white transition-all duration-150">
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
