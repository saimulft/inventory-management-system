/* eslint-disable no-unused-vars */
import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import SupplierInfoInputList from "../Components/AddStrorePageComponent/SupplierInfoInputList";
import AdditionalPaymentInputList from "../Components/AddStrorePageComponent/AdditionalPaymentInputList";

export default function AddSupplier() {
  const [addSupplier, setAddSupplier] = useState([{ id: 1 }]);
  const handleAddSupplierIncrementField = () => {
    setAddSupplier([...addSupplier, { id: 1 }]);
  };
  return (
    <div className="px-5 lg:px-20 rounded-lg md:mb-20 mb-10">
      {/* option select  */}
      <div></div>
      {/* add information  */}
      {addSupplier.map((supplier, index) => {
        return (
          <>
            <div className="mt-8 border-2 border-[#8633FF] flex flex-col lg:flex-row rounded-lg bg-white">
              {/* supplier information  */}
              <div className="lg:w-1/2 px-5 pt-8 lg:pb-8 px-5">
                <h5 className="text-xl font-medium">
                  Add Supplier Information
                </h5>
                <SupplierInfoInputList />
              </div>
              {/* add payment details  */}
              <div className="lg:w-1/2 px-5 pt-4 lg:pb-10 pb-16">
                <AdditionalPaymentInputList rootIndex={index} />
              </div>
            </div>
            {/* plus btn  */}
            <div onClick={handleAddSupplierIncrementField} className="w-full flex justify-center relative">
              <div style={{ boxShadow: "-1px 3px 8px 0px rgba(0, 0, 0, 0.2)" }} className="rounded-full shadow-xl absolute bottom-[-15px] flex">
                <button className="bg-white rounded-full text-slate-500 hover:text-slate-600 transition-all duration-100 p-1">
                  <AiOutlinePlusCircle size={24} />
                </button>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}
