export default function WareHouseAdminPage() {
  return (
    <div>
      <div className="md:py-10 py-6">
        <h3 className="text-2xl font-bold text-center">
          Add New Warehouse Admin
        </h3>
        <div className="md:flex gap-4 w-full mt-5 ">
          <div className="md:w-1/2">
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
              <label className="text-slate-500">Password</label>
              <input
                type="text"
                placeholder="Enter password"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="password"
                name="password"
              />
            </div>
            <div className="mt-3">
              <label className="text-slate-500">Confirm password</label>
              <input
                type="text"
                placeholder="confirmPassword"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="fullName"
                name="fullName"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="mt-3">
              <label className="text-slate-500">User Id</label>
              <input
                type="text"
                placeholder="User ID"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="userID"
                name="userID"
              />
            </div>
            <div className="mt-3">
              <label className="text-slate-500">User Role</label>
              <input
                type="text"
                placeholder="User role"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="UserRole"
                name="UserRole"
              />
            </div>
            <div className="mt-3">
              <label className="text-slate-500">User Role</label>
              <input
                type="text"
                placeholder="User role"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="UserRole"
                name="UserRole"
              />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-slate-500">Password</label>
          <input
            type="text"
            placeholder="Enter password"
            className="input input-bordered input-primary w-full mt-2 shadow-lg"
            id="password"
            name="password"
          />
        </div>
        <div className="flex justify-center">
          <button className="flex items-center justify-center bg-[#8633FF] md:px-32 w-full md:w-fit mt-8 py-2 rounded-md text-white">
            <p>Create Warehouse Admin</p>
          </button>
        </div>
      </div>
    </div>
  );
}
