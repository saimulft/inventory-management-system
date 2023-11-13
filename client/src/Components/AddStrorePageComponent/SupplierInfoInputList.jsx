import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import useStore from "../../hooks/useStore";

export default function SupplierInfoInputList() {
  const { supplierInfoInputList, setSupplierInfoInputList } = useStore()

  const handleSupplierInfoInputChange = (event, index) => {
    const { name, value } = event.target;

    // console.log(name, value, index)

    const list = [...supplierInfoInputList];
    list[index][name] = value;
    setSupplierInfoInputList(list);
  };

  const handleSupplierInfoIncrementField = () => {
    setSupplierInfoInputList([
      ...supplierInfoInputList,
      { supplier_name: "", username: "", password: "" },
    ]);
  };

  const handleSupplierInfoRemoveField = (index) => {
    if (supplierInfoInputList.length > 1) {
      const list = supplierInfoInputList.filter((item, idx) => idx !== index);
      setSupplierInfoInputList([...list]);
    }
  };

  return (
    <>
      {supplierInfoInputList.map((i, index) => {
        return (
          <div key={index} className="flex gap-2 mt-4">
            <input
              onChange={(e) => handleSupplierInfoInputChange(e, index)}
              className="border border-gray-400 outline-[#8833FF] rounded py-3 px-2 w-1/3 text-xs "
              placeholder="Supplier name"
              type="text"
              name="supplier_name"
              id="supplier_name"
              value={i?.supplier_name}
            />
            <input
              onChange={(e) => handleSupplierInfoInputChange(e, index)}
              className="border border-gray-400 outline-[#8833FF] rounded py-3 px-2 w-1/3 text-xs "
              placeholder="Username"
              type="text"
              name="username"
              id="username"
              value={i?.username}
            />
            <input
              onChange={(e) => handleSupplierInfoInputChange(e, index)}
              className="border border-gray-400 outline-[#8833FF] rounded py-3 px-2 w-1/3 text-xs"
              placeholder="Password"
              type="text"
              name="password"
              id="password"
              value={i?.password}
            />
            <button
              onClick={() => handleSupplierInfoRemoveField(index)}
              className="text-slate-400 hover:text-slate-500 transition-all duration-100 hover:cursor-pointer"
            >
              <AiOutlineCloseCircle size={20} />
            </button>
          </div>
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
    </>
  );
}
