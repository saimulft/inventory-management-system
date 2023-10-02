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
    <div className="p-4 md:p-10 bg-white rounded-lg">
      {/* option select  */}
      <div></div>
      {/* add information  */}
      {addSupplier.map((a, index) => {
        return (
          <div key={index} className="relative z-10">
            <div className="mt-8 border-2 border-[#8633FF] md:flex rounded-lg ">
              {/* supplier information  */}
              <div className="md:w-1/2 p-4 md:p-8">
                <h5 className="text-lg md:text-xl font-medium">
                  Add Supplier Information
                </h5>

                <SupplierInfoInputList />
              </div>

              {/* add payment details  */}
              <div className="md:w-1/2 p-4 pb-10">
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
        <button className="flex items-center justify-center border border-[#8633FF]  w-full md:w-80 mx-auto mt-12 py-2 rounded-md text-[#8633FF] font-medium">
          <p>Next</p>
          <BsArrowRightShort className="mt-[1px]" size={28} />
        </button>
      </Link>
    </div>
  );
}
