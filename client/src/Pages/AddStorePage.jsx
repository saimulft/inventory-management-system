import { BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function AddStorePage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
  };

  return (
    <div className="bg-white p-20 rounded-lg">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] shadow-lg h-fit w-fit m-auto rounded-xl flex justify-center items-center"
      >
        <div className="lg:py-20 lg:px-28 p-10">
          <form>
            <h4 className="text-xl font-bold">Add New Store</h4>
            <p className="text-slate-400">
              Please fill out the details to add a new store
            </p>

            <div className="flex flex-col mt-4">
              <label className="text-slate-500">Store name*</label>
              <input
                type="text"
                placeholder="Enter store name"
                className="input input-bordered input-primary w-full max-w-xs mt-2"
                id="storeName"
                name="storeName"
              />
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-slate-500">Store manager name*</label>
              <input
                type="text"
                placeholder="Enter store manager name"
                className="input input-bordered input-primary w-full max-w-xs mt-2"
                id="storeManagerName"
                name="storeManagerName"
              />
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-slate-500">Store type*</label>
              <select
                className="select select-primary w-full mt-2"
                name="country"
                id="country"
              >
                <option disabled selected>
                  Pick Store Type
                </option>
                <option value="Amazon">Amazon</option>
                <option value="Daraz">Daraz</option>
                <option value="Alibaba">Alibaba</option>
              </select>
            </div>

            <Link to="/dashboard/add-store/add-supplier">
              <div className="flex items-center justify-center mt-8 bg-[#8633FF] rounded-lg">
                <button className=" flex py-3 justify-center items-center text-white w-full capitalize ">
                  Next
                  <BsArrowRightShort className="mt-[2px]" size={28} />
                </button>
              </div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
