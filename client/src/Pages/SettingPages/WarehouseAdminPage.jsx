import Swal from "sweetalert2";
import countries from "../../Utilities/countries";

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
              <label className="text-slate-500">Warehouse Name*</label>
              <input
                type="text"
                placeholder="Enter name"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="warehouseName"
                name="warehouseName" />
            </div>
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

            <div className="mt-4">
              <label className="text-slate-500">Address</label>
              <input
                type="text"
                placeholder="Street Address, P.O.Box, apartment, suit, building, floor"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="address"
                name="address"
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">State</label>
              <input
                type="text"
                placeholder="Enter state"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="state"
                name="state"
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
              />
            </div>
            <div className="mt-3">
              <label className="text-slate-500">Confirm Password*</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="confirmPassword"
                name="confirmPassword" />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">City</label>
              <input
                type="text"
                placeholder="Enter your city"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="city"
                name="city"
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">ZIP Code</label>
              <input
                type="text"
                placeholder="Enter zip code"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="zipCode"
                name="zipCode"
              />
            </div>
          </div>
        </form>
        <div className="mt-3 flex flex-col">
          <label className="text-slate-500">Country*</label>
          <select className="select select-primary w-full mt-2 shadow-lg">
            <option disabled selected>
              Select your country
            </option>
            {countries}
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
