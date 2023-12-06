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
  const { storeDetails, setStoreDetails } = useStore()

  const [addSupplier, setAddSupplier] = useState(storeDetails?.supplier_information?.length > 0 ? parseInt(storeDetails?.supplier_information?.length) : 1);

  const [isValidCardNumber, setIsValidCardNumber] = useState([])
  const [isValidCardExp, setIsValidCardExp] = useState([])
  const [isValidCardCvv, setIsValidCardCvv] = useState([])

  const { user } = useAuth()
  const [inputError, setInputError] = useState([])

  const navigate = useNavigate()

  if (!storeDetails) {
    return <Navigate to="/dashboard/add-store" />
  }

  const handleNext = async () => {
    const suppliers_data = [];
    let additional_payment_data = [];
    const error_data = [];

    for (let i = 0; i < document.getElementById('store_parent_div').children.length; i++) {
      let supplier_list = [];
      for (let j = 0; j < document.getElementById('store_parent_div').children[i].children[0].children[0].children[1].children.length; j++) {

        const name = document.getElementById('store_parent_div').children[i].children[0].children[0].children[1].children[j].children[0].value;
        const username = document.getElementById('store_parent_div').children[i].children[0].children[0].children[1].children[j].children[1].value;
        const password = document.getElementById('store_parent_div').children[i].children[0].children[0].children[1].children[j].children[2].value;

        if (name && username && password) {
          if (error_data.filter((element) => element.type == 'supplier' && element.id == document.getElementById('store_parent_div').children[i].id).length > 0) {
            error_data.splice(error_data.findIndex(a => a.type == 'supplier' && a.id == document.getElementById('store_parent_div').children[i].id), 1)
          }
          supplier_list.push({
            parent_id: i + 1,
            id: j + 1,
            name: name,
            username: username,
            password: password,
          })
        } else {
          error_data.push({ type: 'supplier', id: document.getElementById('store_parent_div').children[i].id })
        }
      }
      if (supplier_list.length > 0) {
        suppliers_data.push(supplier_list)
      }
    }

    for (let i = 0; i < document.getElementById('store_parent_div').children.length; i++) {
      let additional_payment_list = [];
      for (let j = 0; j < document.getElementById('store_parent_div').children[i].children[0].children[1].children[1].children.length; j++) {

        const email = document.getElementById('store_parent_div').children[i].children[0].children[1].children[1].children[j].children[0].children[0].children[2].children[0].children[0].children[1].value;
        const name_on_card = document.getElementById('store_parent_div').children[i].children[0].children[1].children[1].children[j].children[0].children[0].children[2].children[0].children[1].children[1].value;
        const card_number = document.getElementById('store_parent_div').children[i].children[0].children[1].children[1].children[j].children[0].children[0].children[2].children[0].children[2].children[1].value;
        const card_date = document.getElementById('store_parent_div').children[i].children[0].children[1].children[1].children[j].children[0].children[0].children[2].children[0].children[3].children[0].children[0].value;
        const card_cvc = document.getElementById('store_parent_div').children[i].children[0].children[1].children[1].children[j].children[0].children[0].children[2].children[0].children[3].children[1].children[0].value;
        const billing_address = document.getElementById('store_parent_div').children[i].children[0].children[1].children[1].children[j].children[0].children[0].children[2].children[0].children[4].children[0].children[1].value;
        const city = document.getElementById('store_parent_div').children[i].children[0].children[1].children[1].children[j].children[0].children[0].children[2].children[0].children[4].children[1].children[1].value;
        const state = document.getElementById('store_parent_div').children[i].children[0].children[1].children[1].children[j].children[0].children[0].children[2].children[0].children[5].children[0].children[1].value;
        const zip_code = document.getElementById('store_parent_div').children[i].children[0].children[1].children[1].children[j].children[0].children[0].children[2].children[0].children[5].children[1].children[1].value;
        const country = document.getElementById('store_parent_div').children[i].children[0].children[1].children[1].children[j].children[0].children[0].children[2].children[0].children[6].children[1].value;

        if (email || name_on_card || card_number || card_date || card_cvc || billing_address || city || state || zip_code || country != 'Select country') {
          if (email && name_on_card && card_number && card_date && card_cvc && billing_address && city && state && zip_code && country) {
            if (error_data.filter((element) => element.type == 'payment' && element.id == document.getElementById('store_parent_div').children[i].id).length > 0) {
              error_data.splice(error_data.findIndex(a => a.type == 'payment' && a.id == document.getElementById('store_parent_div').children[i].id), 1)
            }
            additional_payment_list.push({
              parent_id: i + 1,
              id: j + 1,
              email: email,
              name_on_card: name_on_card,
              card_info: {
                number: card_number,
                date: card_date,
                cvc: card_cvc,
              },
              billing_address: billing_address,
              city: city,
              state: state,
              zip_code: zip_code,
              country: country
            })
          } else {
            error_data.push({ type: 'payment', id: document.getElementById('store_parent_div').children[i].id })
          }
        }
      }
      if (additional_payment_list.length > 0) {
        additional_payment_data.push(additional_payment_list)
      }
    }

    if (error_data.length <= 0 && isValidCardCvv.length <= 0 && isValidCardExp.length <= 0 && isValidCardNumber.length <= 0) {
      const date = new Date().toISOString();
      setStoreDetails({
        ...storeDetails,
        supplier_information: suppliers_data,
        additional_payment_details: additional_payment_data,
        admin_id: user.admin_id,
        date: date,
        creator_email: user?.email,
      })
      navigate("/dashboard/add-store/add-supplier/select-payment")
    }

    setInputError(error_data)
  }

  const handleAddSupplierRemoveField = (index) => {
    if (document.getElementById(`store_parent_div`).children.length > 1) {
      document.getElementById(`supplier_parent_div_${index}`).remove();
    }
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
      <div id="store_parent_div">
        {Array(addSupplier).fill().map((a, index) => {
          return (
            <div id={`supplier_parent_div_${index}`} key={index} className="relative z-0">
              <div className="mt-8 border-2 border-[#8633FF] flex rounded-lg ">
                {/* supplier information  */}
                <div className="w-1/2 p-8">
                  <div>
                    <h5 className="text-xl font-medium">Add Supplier Information</h5>
                    {(inputError.filter((element) => element.id == `supplier_parent_div_${index}` && element.type == 'supplier').length > 0) && <p className="w-full mt-3 flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {'Missing supplier information'}</p>}
                  </div>

                  <SupplierInfoInputList from_index={index + 1} />
                </div>

                {/* add payment details  */}
                <div className="w-1/2 p-4 pb-10">
                  <div>
                    {(inputError.filter((element) => element.id == `supplier_parent_div_${index}` && element.type == 'payment').length > 0) && <p className="w-full mt-3 flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {'Missing additional payment details'}</p>}
                  </div>
                  <AdditionalPaymentInputList from_index={index + 1} isValidCardNumber={isValidCardNumber} setIsValidCardNumber={setIsValidCardNumber} isValidCardExp={isValidCardExp} setIsValidCardExp={setIsValidCardExp} isValidCardCvv={isValidCardCvv} setIsValidCardCvv={setIsValidCardCvv} />
                </div>
              </div>

              {/* plus btn  */}
              <div
                onClick={() => { setAddSupplier(addSupplier + 1) }}
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
      {/* next btn  */}
      <button onClick={handleNext} className="flex items-center justify-center border border-[#8633FF]  w-80 mx-auto mt-12 py-[10px] rounded-md text-[#8633FF] hover:bg-[#8633FF] hover:text-white transition font-medium">
        <p>Next</p>
        <BsArrowRightShort className="mt-[1px]" size={28} />
      </button>
    </div>
  );
}
