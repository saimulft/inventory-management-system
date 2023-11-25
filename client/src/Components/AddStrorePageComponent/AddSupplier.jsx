import { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import SupplierInfoInputList from "./SupplierInfoInputList";
import AdditionalPaymentInputList from "./AdditionalPaymentInputList";
import { BsArrowRightShort } from "react-icons/bs";
import { Navigate, useNavigate } from "react-router-dom";
import useStore from "../../hooks/useStore";
import useAuth from "../../hooks/useAuth";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import Swal from "sweetalert2";
// import useGlobal from "../../hooks/useGlobal";

export default function AddSupplier() {
  const [addSupplier, setAddSupplier] = useState([{ id: 1 }]);
  const { storeDetails, setStoreDetails, supplierInfoInputList, setSupplierInfoInputList, additionalPaymentInputList, setAdditionalPaymentInputList } = useStore()
  const { user } = useAuth()

  const [inputError, setInputError] = useState('')

  // const { setStoreRefetch } = useGlobal()
  const navigate = useNavigate()

  // const { mutateAsync, isLoading } = useMutation({
  //   mutationFn: (storeData) => {
  //     return axios.post('/api/v1/store_api/add_new_store', storeData)
  //   },
  // })

  if (!storeDetails) {
    return <Navigate to="/dashboard/add-store" />
  }

  const handleAddSupplierIncrementField = () => {
    setAddSupplier([...addSupplier, { id: 1 }]);
  };

  
  const handleAddSupplierRemoveField = (index) => {
    const list = [...addSupplier];
    if (index >= 0 && index < list.length) {
      list.splice(index, 1);
    }
    setAddSupplier(list);
  };

  const handleAddStore = async () => {
    const date = new Date().toISOString();

    let isNext;

    supplierInfoInputList.forEach(singleList => {
      setInputError('')
      isNext = undefined;

      if (!singleList.supplier_name) {
        return setInputError('Provide supplier name')
      }
      else if (!singleList.username) {
        return setInputError('Provide supplier username')
      }
      else if (!singleList.password) {
        return setInputError('Provide supplier password')
      }
      return isNext = true;
    })

    if(!isNext){
      return;
    }

    setStoreDetails({
      ...storeDetails,
      supplier_information: supplierInfoInputList,
      additional_payment_details: additionalPaymentInputList,
      admin_id: user.admin_id,
      date: date,
      creator_email: user?.email,
    })

    // try {
    //   const { status } = await mutateAsync(storeData)

    //   if (status === 201) {
    //     setStoreDetails(null)
    //     setSupplierInfoInputList([{ supplier_name: "", username: "", password: "" }])
    //     setAdditionalPaymentInputList([{ email: "", card_name: "", card_info: "", date: "", cvc: "", billing_address: "", city: "", state: "", zip_code: "", country: ""}])

    //     setStoreRefetch(true)
    //     Swal.fire(
    //       'Added',
    //       'New store has been added.',
    //       'success'
    //     )
    //     navigate("/dashboard/all-stores")
    //   }
    // } catch (error) {
    //   console.log(error)
    // }

    navigate("/dashboard/add-store/add-supplier/select-payment")
  }

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
              <span className="font-bold text-slate-600">Store name: </span>
              <span>{storeDetails.store_name}</span>
            </p>
            <p>
              <span className="font-bold text-slate-600">Store manager name: </span>
              <span>{storeDetails.store_manager_name}</span>
            </p>
            <p>
              <span className="font-bold text-slate-600">Store type: </span>
              <span>{storeDetails.store_type}</span>
            </p>
            <p>
              <span className="font-bold text-slate-600">Store status: </span>
              <span>{storeDetails.store_status}</span>
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
      <button onClick={handleAddStore} className="flex items-center justify-center border border-[#8633FF]  w-80 mx-auto mt-12 py-[10px] rounded-md text-[#8633FF] hover:bg-[#8633FF] hover:text-white transition font-medium">
        <p>Next</p>
        <BsArrowRightShort className="mt-[1px]" size={28} />
      </button>
    </div>
  );
}
