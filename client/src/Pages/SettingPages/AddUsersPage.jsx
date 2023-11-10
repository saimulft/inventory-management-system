import { Link } from "react-router-dom";

export default function AddUsersPage() {
  return (
    <div className="py-10">
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-medium text-center mb-8">
            Select User Type
          </h3>

          <Link
            to="/dashboard/settings/add-users/admin-va"
            className="border border-[#8633FF] rounded hover:bg-purple-100 transition-all duration-200 px-4 py-2 text-center"
          >
            <button className="">Admin VA</button>
          </Link>
          <Link
            to="/dashboard/settings/add-users/store-owner"
            className="border border-[#8633FF] rounded hover:bg-purple-100 transition-all duration-200 px-4 py-2 text-center"
          >
            <button className="">Store Owner</button>
          </Link>
          <Link
            to="/dashboard/settings/add-users/store-manager-admin"
            className="border border-[#8633FF] rounded hover:bg-purple-100 transition-all duration-200 px-4 py-2 text-center"
          >
            <button className="">Store Manager Admin</button>
          </Link>
          <Link
            to="/dashboard/settings/add-users/store-manager-va"
            className="border border-[#8633FF] rounded hover:bg-purple-100 transition-all duration-200 px-4 py-2 text-center"
          >
            <button className="">Store Manager VA</button>
          </Link>
          <Link
            to="/dashboard/settings/add-users/warehouse-admin"
            className="border border-[#8633FF] rounded hover:bg-purple-100 transition-all duration-200 px-4 py-2 text-center"
          >
            <button className="">Warehouse Admin</button>
          </Link>
          <Link
            to="/dashboard/settings/add-users/warehouse-manager-va"
            className="border border-[#8633FF] rounded hover:bg-purple-100 transition-all duration-200 px-4 py-2 text-center"
          >
            <button className="">Warehouse Manager VA</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
