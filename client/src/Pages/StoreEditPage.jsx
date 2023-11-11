import { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import SupplierInfoInputListEdit from "../Components/StoreEditPageComponents/SupplierInfoInputListEdit";
import AdditionalPaymentInputListEdit from "../Components/StoreEditPageComponents/AdditionalPaymentInputListEdit";
import { BiSolidEdit } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useGlobal from "../hooks/useGlobal";
import useAuth from "../hooks/useAuth";
import ToastMessage from "../Components/Shared/ToastMessage";
import { FaSpinner } from "react-icons/fa";

export default function StoreEditPage() {
  const [addSupplier, setAddSupplier] = useState([{ id: 1 }]);
  const [supplierInfoInputList, setSupplierInfoInputList] = useState([])
  const [additionalPaymentInputList, setAdditionalPaymentInputList] = useState([])
  const { isSidebarOpen } = useGlobal()
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const { id } = useParams()

  const { data: singleStore = [], refetch } = useQuery({
    queryKey: ['single_store'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/store_api/get_store_by_id?id=${id}`)
        if (res.status === 200) {
          setSupplierInfoInputList(res.data.data.supplier_information)
          setAdditionalPaymentInputList(res.data.data.additional_payment_details)
          return res.data.data;
        }
        if(res.status === 204){
          return {}
        }
      } catch (error) {
        console.log(error);
        return {};
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
  const handleUpdateModal = () => {
    document.getElementById("update_modal").showModal()
  }
  const handleUpdate = (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    const form = e.target
    const storeName = form.storeName.value
    const storeManagername = form.storeManagername.value
    const storeStatus = form.storeStatus.value
    const storeType = form.storeType.value
    if (!storeName && !storeManagername && storeStatus === "Select Status" && storeType === "Pick Store Type") {
      return;
    }
    const updateData = {
      storeName,
      storeManagername,
      storeStatus,
      storeType
    }
    setLoading(true)
    axios.post(`/api/v1/store_api//update_store_details?id=${user.admin_id}`, updateData)
      .then(res => {
     
        if (res.status === 200) {
          setLoading(false)
          refetch()
          form.reset()
          setSuccessMessage("Updated")
          setTimeout(() => {
            setSuccessMessage("")
          }, 2000);
        }
        if (res.status === 204) {
          setLoading(false)    
          setErrorMessage("Up to date")
          setTimeout(() => {
            setErrorMessage("")
          }, 2000);
        }
      }).catch(err => {
        setLoading(false)
        console.log(err)
      })
  }
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";
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
            <button onClick={handleUpdateModal} className="border border-[#8633FF] px-4 py-1 flex justify-center items-center gap-2 my-4 rounded hover:bg-[#8633FF] hover:text-white transition-all">
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
      <dialog id="update_modal" className="modal">
        <div style={{ marginLeft, maxWidth: '500px' }} className="modal-box py-10 px-10">
          <form onSubmit={handleUpdate} className="flex justify-center flex-col">
            <label className="text-slate-500 font-bold mb-1">New store name</label>
            <input
              className="border bg-white shadow-md border-[#8633FF] outline-none w-full py-3 rounded-md px-2 text-sm"
              placeholder="Store name"
              name="storeName"
              type="text"
            />
            <label className=" text-slate-500 mt-4 font-bold mb-1">New store manager name</label>
            <input
              className="border bg-white shadow-md border-[#8633FF] outline-none w-full py-3 rounded-md px-2 text-sm"
              placeholder="Store name"
              name="storeManagername"
              type="text"
            />
            <label className="font-bold text-slate-500 mt-4">Store type*</label>
            <select
              className="select select-primary w-full mt-2"
              name="storeType"
              id="storeType"
              required
            >
              <option defaultValue="Pick Store Type">
                Pick Store Type
              </option>
              <option value="Amazon">Amazon</option>
              <option value="Walmart">Walmart</option>
              <option value="Ebay">Ebay</option>
              <option value="Shopify">Shopify</option>
              <option value="Ali Express">Ali Express</option>
            </select>
            <label className="font-bold text-slate-500 mt-4">Store status*</label>
            <select
              className="select select-primary w-full mt-2"
              name="storeStatus"
              id="storeStatus"
              required
            >
              <option defaultValue="Select Status">
                Select Status
              </option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {successMessage && <ToastMessage errorMessage={errorMessage} successMessage={successMessage} />}
            <button type="submit" disabled={loading} className="bg-[#8633FF] mt-4 flex gap-2 py-2 justify-center items-center text-white rounded-lg w-full">
              {loading && <FaSpinner size={20} className="animate-spin" />}
              Update
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
