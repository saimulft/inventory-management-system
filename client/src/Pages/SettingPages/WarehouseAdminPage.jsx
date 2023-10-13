import Swal from "sweetalert2";

export default function WareHouseAdminPage() {
  const handleWarehouseAdmin = (e) => {
    e.preventDefault();

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Created warehouse admin successfully!",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  return (
    <div>
      <div className="py-10 ">
        <h3 className="text-2xl font-bold text-center">
          Add New Warehouse Admin
        </h3>
        <form className="flex gap-4 w-full mt-5 ">
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
              <label className="text-slate-500">Password*</label>
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="password"
                name="password"
              />
            </div>
            <div className="mt-3">
              <label className="text-slate-500">Confirm password*</label>
              <input
                type="text"
                placeholder="confirmPassword"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="fullName"
                name="fullName"
              />
            </div>
          </div>
          <div className="w-1/2">
            <div className="mt-3">
              <label className="text-slate-500">User Id*</label>
              <input
                type="text"
                placeholder="User ID"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="userID"
                name="userID"
              />
            </div>
            <div className="mt-3">
              <label className="text-slate-500">User Role*</label>
              <select className="select select-primary shadow-lg w-full ">
                <option disabled selected>
                  demo
                </option>
                <option>Text-1</option>
                <option>Text-2</option>
                <option>Text-3</option>
              </select>
            </div>
            <div className="mt-3">
              <label className="text-slate-500">User Role*</label>
              <input
                type="text"
                placeholder="User role"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="UserRole"
                name="UserRole"
              />
            </div>
          </div>
        </form>
        <div className="mt-3 flex flex-col">
          <label className="text-slate-500">Country*</label>
          <select className="select select-primary w-full mt-2 shadow-lg">
            <option disabled selected>
              Demo
            </option>
            <option>Test-1</option>
            <option>Test-2</option>
            <option>Test-3</option>
          </select>
        </div>
        <div className="flex justify-center">
          <button
            onClick={(e) => handleWarehouseAdmin(e)}
            className="flex items-center justify-center bg-[#8633FF] px-32 w-full mt-8 py-3 rounded-md text-white"
          >
            <p>Create Warehouse Admin</p>
          </button>
        </div>
      </div>
    </div>
  );
}
