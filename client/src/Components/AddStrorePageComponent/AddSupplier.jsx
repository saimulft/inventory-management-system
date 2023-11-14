import { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import SupplierInfoInputList from "./SupplierInfoInputList";
import AdditionalPaymentInputList from "./AdditionalPaymentInputList";
import { BsArrowRightShort } from "react-icons/bs";
import { Navigate, useNavigate } from "react-router-dom";
import useStore from "../../hooks/useStore";
import useAuth from "../../hooks/useAuth";
import { MdErrorOutline } from "react-icons/md";

export default function AddSupplier() {
  const [addSupplier, setAddSupplier] = useState([{ id: 1 }]);
  const { storeDetails, setStoreDetails, supplierInfoInputList, setSupplierInfoInputList, additionalPaymentInputList, setAdditionalPaymentInputList } = useStore()
  const { user } = useAuth()
  const [supplierInputError, setSupplierInputError] = useState('')
  const [paymentInputError, setPaymentInputError] = useState('')

  const navigate = useNavigate()

  if (!storeDetails) {
    return <Navigate to="/dashboard/add-store" />
  }

  const handleAddSupplierIncrementField = () => {
    setAddSupplier([...addSupplier, {}]);
  };

  const handleAddSupplierRemoveField = (index) => {
    const list = [...addSupplier];

    if (index > 0 && index < list.length) {
      list.splice(index, 1);
    }
    setAddSupplier(list);
  };

  const handleNext = async () => {
    const date = new Date().toISOString();

    let isNext;

    supplierInfoInputList.forEach(singleList => {
      setSupplierInputError('')
      isNext = undefined;

      if (!singleList.supplier_name || !singleList.username || !singleList.password) {
        return setSupplierInputError('Missing supplier information')
      }

      return isNext = true;
    })

    if (!isNext) {
      return;
    }

    additionalPaymentInputList.forEach(singleList => {
      setPaymentInputError('')
      isNext = undefined;

      if (additionalPaymentInputList.length > 1) {
        if (!singleList.email || !singleList.card_name || !singleList.card_info || !singleList.date || !singleList.cvc || !singleList.billing_address || !singleList.city || !singleList.state || !singleList.zip_code || !singleList.country) {
          return setPaymentInputError('Missing additional payment details')
        }
      }
      else {
        if (singleList.email || singleList.card_name || singleList.card_info || singleList.date || singleList.cvc || singleList.billing_address || singleList.city || singleList.state || singleList.zip_code || singleList.country && singleList.country !== 'Select country') {

          if (!singleList.email || !singleList.card_name || !singleList.card_info || !singleList.date || !singleList.cvc || !singleList.billing_address || !singleList.city || !singleList.state || !singleList.zip_code || !singleList.country) {
            return setPaymentInputError('Missing additional payment details')
          }
        }
      }

      return isNext = true;
    })

    if (!isNext) {
      return;
    }

    setStoreDetails({
      ...storeDetails,
      supplier_information: supplierInfoInputList,
      additional_payment_details: additionalPaymentInputList.length > 1 ? additionalPaymentInputList : additionalPaymentInputList.length === 1 && additionalPaymentInputList[0].email ? additionalPaymentInputList : [],
      admin_id: user.admin_id,
      date: date,
      creator_email: user?.email,
    })

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
          <div key={index} className="relative z-0">
            <div className="mt-8 border-2 border-[#8633FF] flex rounded-lg ">
              {/* supplier information  */}
              <div className="w-1/2 p-8">
                <div>
                  <h5 className="text-xl font-medium">Add Supplier Information {index}</h5>
                  {supplierInputError && <p className="w-full mt-3 flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {supplierInputError}</p>}
                </div>

                <SupplierInfoInputList/>
              </div>

              {/* add payment details  */}
              <div className="w-1/2 p-4 pb-10">
                {paymentInputError && <p className="w-full mt-3 flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {paymentInputError}</p>}

                <AdditionalPaymentInputList/>
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
      <button onClick={handleNext} className="flex items-center justify-center border border-[#8633FF]  w-80 mx-auto mt-12 py-[10px] rounded-md text-[#8633FF] hover:bg-[#8633FF] hover:text-white transition font-medium">
        <p>Next</p>
        <BsArrowRightShort className="mt-[1px]" size={28} />
      </button>
    </div>
  );
}
