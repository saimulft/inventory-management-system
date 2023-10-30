import { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import SupplierInfoInputList from "./SupplierInfoInputList";
import AdditionalPaymentInputList from "./AdditionalPaymentInputList";
import { BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function AddSupplier() {
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
        <div className="collapse collapse-arrow bg-white ">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium flex items-center gap-2 ">
           General Information
          </div>
          <div className="collapse-content">
            <p>
              <span className="font-bold text-slate-600">Store name:</span>{" "}
              <span>Amazon</span>
            </p>
            <p>
              <span className="font-bold text-slate-600">Store manager name:</span>
              <span> Saidul Basar</span>
            </p>
            <p>
              <span className="font-bold text-slate-600">Store type:</span>{" "}
              <span>Aafsdja</span>
            </p>
          </div>
        </div>
      </div>

      {/* add information  */}
      {addSupplier.map((a, index) => {
        return (
          <div key={index} className="relative z-10">
            <div className="mt-8 border-2 border-[#8633FF] flex rounded-lg ">
              {/* supplier information  */}
              <div className="w-1/2 p-8">
                <h5 className="text-xl font-medium">
                  Add Supplier Information
                </h5>

                <SupplierInfoInputList />
              </div>

              {/* add payment details  */}
              <div className="w-1/2 p-4 pb-10">
                <AdditionalPaymentInputList />
              </div>
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
      {/* next btn  */}
      <Link to="/dashboard/add-store/add-supplier/select-payment">
        <button className="flex items-center justify-center border border-[#8633FF]  w-80 mx-auto mt-12 py-[10px] rounded-md text-[#8633FF] hover:bg-[#8633FF] hover:text-white transition font-medium">
          <p>Next</p>
          <BsArrowRightShort className="mt-[1px]" size={28} />
        </button>
      </Link>
    </div>
  );
}
