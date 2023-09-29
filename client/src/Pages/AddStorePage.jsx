import { BsArrowRightShort } from "react-icons/bs";

export default function AddStorePage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.3)",
  };

  return (
    <div className="bg-white p-20 rounded-lg">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] shadow-lg h-[500px] w-[500px] m-auto rounded-xl flex justify-center items-center"
      >
        <form>
          <h4 className="text-xl font-bold">Add New Store</h4>
          <p className="text-slate-400">
            Please fill out the details to add a new store
          </p>
          <div className="flex flex-col mt-4">
            <label className="text-slate-500">Store name*</label>
            <input
              className=" border border-[#8633FF] mt-2 outline-2 outline-[#8633FF] rounded-md py-[7px]  px-4 "
              placeholder="Enter store name"
              type="text"
              id="storeName"
              name="storeName"
            />
          </div>
          <div className="flex flex-col mt-2">
            <label className="text-slate-500">Store name*</label>
            <input
              className=" border border-[#8633FF] mt-2 outline-2 outline-[#8633FF] rounded-md py-[7px]  px-4"
              placeholder="Enter store manager name "
              type="text"
              id="storeName"
              name="storeName"
            />
          </div>

          <div className="flex flex-col mt-2">
            <label className="text-slate-500">Store type*</label>
            <select
              className=" border border-[#8633FF] mt-2 outline-2 outline-[#8633FF] rounded-md py-2 px-2"
              name="country"
              id="country"
            >
              <option value="Amazon">Amazon</option>
              <option value="Daraz">Daraz</option>
              <option value="Alibaba">Alibaba</option>
            </select>
          </div>
          <button className="flex items-center justify-center bg-[#8633FF] w-full mt-8 py-2 rounded-md text-white">
            <p>Next</p>
            <BsArrowRightShort className="mt-[1px]" size={28} />
          </button>
        </form>
      </div>
    </div>
  );
}
