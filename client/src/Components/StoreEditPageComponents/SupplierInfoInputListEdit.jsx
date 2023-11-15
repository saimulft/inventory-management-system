import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { useState } from "react";

export default function SupplierInfoInputListEdit({ from_index, storeDetails }) {
  const [supplierInfoFieldNumber, setSupplierInfoFieldNumber] = useState(storeDetails?.supplier_information?.length > 0 ? storeDetails?.supplier_information[from_index - 1]?.length : 1)

  const handleSupplierInfoDelete = (index) => {
    if (document.getElementById(`${from_index}_supplier_parent_div`).children.length > 1) {
      document.getElementById(`${from_index}_supplier_input_div_${index}`).remove();
    }
  }

  return (
    <>
      <div id={`${from_index}_supplier_parent_div`}>
        {Array(supplierInfoFieldNumber).fill().map((i, index) => {
          return (
            <div id={`${from_index}_supplier_input_div_${index + 1}`} key={index} className="flex gap-2 mt-4">
              <input
                className="border border-gray-400 outline-[#8833FF] rounded py-3 px-2 w-1/3 text-xs"
                placeholder="Supplier name"
                type="text"
                name="supplier_name"
                id={`supplier_name_${index + 1}`}
                defaultValue={storeDetails?.supplier_information?.[from_index - 1]?.[index]?.name ? storeDetails?.supplier_information?.[from_index - 1]?.[index]?.name : ''}
              />
              <input
                // onChange={(e) => handleSupplierInfoInputChange(e, index)}
                className="border border-gray-400 outline-[#8833FF] rounded py-3 px-2 w-1/3 text-xs "
                placeholder="Username"
                type="text"
                name="supplier_username"
                id={`supplier_username_${index + 1}`}
                defaultValue={storeDetails?.supplier_information?.[from_index - 1]?.[index]?.username ? storeDetails?.supplier_information?.[from_index - 1]?.[index]?.username : ''}
              />
              <input
                // onChange={(e) => handleSupplierInfoInputChange(e, index)}
                className="border border-gray-400 outline-[#8833FF] rounded py-3 px-2 w-1/3 text-xs"
                placeholder="Password"
                type="text"
                name="supplier_password"
                id={`supplier_password_${index + 1}`}
                defaultValue={storeDetails?.supplier_information?.[from_index - 1]?.[index]?.password ? storeDetails?.supplier_information?.[from_index - 1]?.[index]?.password : ''}
              />
              <button
                onClick={() => handleSupplierInfoDelete(index + 1)}
                className="text-slate-400 hover:text-slate-500 transition-all duration-100 hover:cursor-pointer"
              >
                <AiOutlineCloseCircle size={20} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-center items-center">
        <div
          onClick={() => { setSupplierInfoFieldNumber(prevState => prevState + 1) }}
          style={{
            boxShadow: "-1px 3px 8px 0px rgba(0, 0, 0, 0.2)",
          }}
          className="w-8 h-8 rounded-full shadow-2xl flex justify-center items-center "
        >
          <button className="text-slate-500 hover:text-slate-600 transition-all duration-100">
            <AiOutlinePlusCircle size={24} />
          </button>
        </div>
      </div>
    </>
  );
}
