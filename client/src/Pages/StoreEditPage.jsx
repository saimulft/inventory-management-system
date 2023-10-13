import { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import SupplierInfoInputListEdit from "../Components/StoreEditPageComponents/SupplierInfoInputListEdit";
import AdditionalPaymentInputListEdit from "../Components/StoreEditPageComponents/AdditionalPaymentInputListEdit";
import { BiSolidEdit } from "react-icons/bi";

export default function StoreEditPage() {
  const [addSupplier, setAddSupplier] = useState([{ id: 1 }]);

  const handleAddSupplierIncrementField = () => {
    setAddSupplier([...addSupplier, { id: 1 }]);
  };

  const handleAddSupplierRemoveField = (index) => {
    const list = [...addSupplier];

    if (index > 0 && index < list.length) {
      list.splice(index, 1);
    }
    setAddSupplier(list);
  };

  return (
    <div className="p-10 bg-white rounded-lg">
      {/* option select  */}
      <div className=" border-2 border-[#8633FF]  rounded-lg">
        <div className="collapse  collapse-arrow bg-white ">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium flex items-center gap-2 ">
            Additional payment Details
            <span className="text-sm text-slate-400">(Optional)</span>
          </div>
          <div className="collapse-content">
            <p>
              <span className="font-bold text-slate-600">Store name:</span>{" "}
              <span>Amazon</span>
            </p>
            <p>
              <span className="font-bold text-slate-600">
                Store manager name:
              </span>
              <span>Saidul Basar</span>
            </p>
            <p>
              <span className="font-bold text-slate-600">Store type:</span>{" "}
              <span>fsdklfsdkllk</span>
            </p>
            <button className="border border-[#8633FF] px-4 py-1 flex justify-center items-center gap-2 my-4 rounded hover:bg-[#8633FF] hover:text-white transition-all w-20 ">
              <BiSolidEdit />
              <p>Edit</p>
            </button>
          </div>
        </div>
      </div>
      {/* add information  */}
      {addSupplier.map((a, index) => {
        return (
          <div key={index} className="relative z-10">
            <div>
              <div className="mt-8 border-2 border-[#8633FF] flex rounded-lg ">
                {/* supplier information  */}
                <div className="w-1/2  p-8">
                  <SupplierInfoInputListEdit />
                </div>

                {/* add payment details  */}
                <div className="w-1/2 p-4 pb-24">
                  <AdditionalPaymentInputListEdit />
                </div>
              </div>
              <button className="absolute left-[50%] -translate-x-1/2 bottom-8 bg-[#8633FF] text-white px-32 py-[10px] font-medium rounded ">
                Update
              </button>
            </div>

            {/* plus btn  */}
            <div
              onClick={handleAddSupplierIncrementField}
              style={{
                boxShadow: "-1px 3px 8px 0px rgba(0, 0, 0, 0.2)",
              }}
              className="w-8 h-8 rounded-full shadow-2xl flex justify-center items-center absolute right-[50%]  translate-x-1/2 -translate-y-1/2 bg-white"
            >
              <button className="text-[#8633FF] hover:text-[#6519cf] transition-all duration-100">
                <AiOutlinePlusCircle size={24} />
              </button>
            </div>

            {/* delete btn  */}
            <button
              onClick={() => handleAddSupplierRemoveField(index)}
              className="text-slate-400 hover:text-slate-500 transition-all duration-100 hover:cursor-pointer absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-white"
            >
              <AiOutlineCloseCircle size={24} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
