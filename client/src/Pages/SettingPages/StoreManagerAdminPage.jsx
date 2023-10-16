import Swal from "sweetalert2";

export default function StoreManagerAdminPage() {
  const handleStoreManagerAdmin = (e) => {
    e.preventDefault();

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Created store manager admin successfully!",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  return (
    <div className="py-10 ">
      <h3 className="text-2xl font-bold text-center">Add New AVA</h3>
      <form className="flex gap-4 w-full mt-5">
        <div className="w-1/2">
          <div className="mt-3">
            <label className="text-slate-500">Name*</label>
            <input
              type="text"
              placeholder="Enter name"
              className="input input-bordered input-primary w-full mt-2 shadow-lg"
              id="name"
              name="name"/>
          </div>
          <div className="mt-3">
            <label className="text-slate-500">Email*</label>
            <input
              type="email"
              placeholder="Enter name"
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
            <label className="text-slate-500">User ID*</label>
            <input
              type="text"
              placeholder="User ID"
              className="input input-bordered input-primary w-full mt-2 shadow-lg"
              id="userId"
              name="userId"
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
      </form>
      <div className="flex justify-center">
        <button
          onClick={(e) => handleStoreManagerAdmin(e)}
          className="flex items-center justify-center bg-[#8633FF] px-36 w-fit mt-8 py-3 rounded-md text-white"
        >
          <p>Create AVA</p>
        </button>
      </div>
    </div>
  );
}
