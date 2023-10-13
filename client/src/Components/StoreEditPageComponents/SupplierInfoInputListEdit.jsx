import { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";

export default function SupplierInfoInputListEdit() {
  const [supplierInfoInputList, setSupplierInfoInputList] = useState([
    { supplierName: "", userID: "", password: "" },
  ]);

  const handleSupplierInfoInputChange = (event, index) => {
    const { name, value } = event.target;
    const list = [...supplierInfoInputList];
    list[index][name] = value;
    setSupplierInfoInputList(list);
  };

  const handleSupplierInfoIncrementField = () => {
    setSupplierInfoInputList([
      ...supplierInfoInputList,
      { supplierName: "", userID: "", password: "" },
    ]);
  };

  const handleSupplierInfoRemoveField = (index) => {
    const list = [...supplierInfoInputList];
    if (index > 0 && index < list.length) {
      list.splice(index, 1);
    }
    setSupplierInfoInputList(list);
  };
  return (
    <div>
      <button className="border border-[#8633FF] px-4 py-1 flex justify-center items-center gap-2 my-4 rounded hover:bg-[#8633FF] hover:text-white transition-all">
        <BiSolidEdit />
        <p>Edit</p>
      </button>
      <h5 className="text-xl font-medium">Add Supplier Information</h5>
      {supplierInfoInputList.map((i, index) => {
        return (
          <form key={index} className="flex gap-2 my-8">
            <input
              onChange={(e, i) => handleSupplierInfoInputChange(e, i)}
              className="border border-gray-400 rounded py-3 px-2 w-1/3 text-xs "
              placeholder="Supplier name"
              type="text"
              name="supplierName"
            />
            <input
              onChange={(e, i) => handleSupplierInfoInputChange(e, i)}
              className="border border-gray-400 rounded py-3 px-2 w-1/3 text-xs "
              placeholder="User ID"
              type="text"
              name="userID"
            />
            <input
              onChange={(e, i) => handleSupplierInfoInputChange(e, i)}
              className="border border-gray-400 rounded py-3 px-2 w-1/3 text-xs"
              placeholder="Password"
              type="text"
              name="password"
            />
            <button
              onClick={() => handleSupplierInfoRemoveField(index)}
              className="text-slate-400 hover:text-slate-500 transition-all duration-100 hover:cursor-pointer"
            >
              <AiOutlineCloseCircle size={20} />
            </button>
          </form>
        );
      })}

      <div className="mt-3 flex justify-center items-center">
        <div
          onClick={handleSupplierInfoIncrementField}
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
    </div>
  );
}
