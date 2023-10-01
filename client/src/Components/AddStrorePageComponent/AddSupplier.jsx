import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import SupplierInfoInputList from "./SupplierInfoInputList";
import AdditionalPaymentInputList from "./AdditionalPaymentInputList";

export default function AddSupplier() {
  const [addSupplier, setAddSupplier] = useState([{ id: 1 }]);
  const handleAddSupplierIncrementField = () => {
    setAddSupplier([...addSupplier, { id: 1 }]);
  };
  return (
    <div className="p-10 bg-white rounded-lg">
      {/* option select  */}
      <div></div>
      {/* add information  */}
      {addSupplier.map((a) => {
        return (
          <>
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
              className="w-full flex justify-center"
            >
              <div
                style={{
                  boxShadow: "-1px 3px 8px 0px rgba(0, 0, 0, 0.2)",
                }}
                className="w-8 h-8 rounded-full shadow-2xl flex justify-center items-center"
              >
                <button className="text-slate-500 hover:text-slate-600 transition-all duration-100">
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
