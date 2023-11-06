import { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import SupplierInfoInputListEdit from "../Components/StoreEditPageComponents/SupplierInfoInputListEdit";
import AdditionalPaymentInputListEdit from "../Components/StoreEditPageComponents/AdditionalPaymentInputListEdit";
import { BiSolidEdit } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function StoreEditPage() {
  const [addSupplier, setAddSupplier] = useState([{ id: 1 }]);
  const [supplierInfoInputList, setSupplierInfoInputList] = useState([])
  const [additionalPaymentInputList, setAdditionalPaymentInputList] = useState([])

  const {id} = useParams()

  const { data: singleStore = [] } = useQuery({
    queryKey: ['single_store'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/store_api/get_store_by_id?id=${id}`)
        if (res.status === 200) {
          setSupplierInfoInputList(res.data.data.supplier_information)
          setAdditionalPaymentInputList(res.data.data.additional_payment_details)
          return res.data.data;
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    }
  })

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
            General Information
          </div>
          <div className="collapse-content">
            <p>
              <span className="font-bold text-slate-600">Store name: </span>
              <span>{singleStore.store_name}</span>
            </p>
            <p>
              <span className="font-bold text-slate-600">Store manager name: </span>
              <span>{singleStore.store_manager_name}</span>
            </p>
            <p>
              <span className="font-bold text-slate-600">Store type: </span>
              <span>{singleStore.store_type}</span>
            </p>
            <p>
              <span className="font-bold text-slate-600">Store status: </span>
              <span>{singleStore.store_status}</span>
            </p>
            <button className="border border-[#8633FF] px-4 py-1 flex justify-center items-center gap-2 my-4 rounded hover:bg-[#8633FF] hover:text-white transition-all">
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
                  <SupplierInfoInputListEdit supplierInfoInputList={supplierInfoInputList} setSupplierInfoInputList={setSupplierInfoInputList} />
                </div>

                {/* add payment details  */}
                <div className="w-1/2 p-4 pb-24">
                  <AdditionalPaymentInputListEdit additionalPaymentInputList={additionalPaymentInputList} setAdditionalPaymentInputList={setAdditionalPaymentInputList} />
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
