import { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import SupplierInfoInputListEdit from "../Components/StoreEditPageComponents/SupplierInfoInputListEdit";
import AdditionalPaymentInputListEdit from "../Components/StoreEditPageComponents/AdditionalPaymentInputListEdit";
import { BiSolidEdit } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useGlobal from "../hooks/useGlobal";
import ToastMessage from "../Components/Shared/ToastMessage";
import { FaSpinner } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md"
import Swal from "sweetalert2";

export default function StoreEditPage() {
  const [storeDetails, setStoreDetails] = useState(null)
  const [addSupplier, setAddSupplier] = useState(null);

  const [isValidCardNumber, setIsValidCardNumber] = useState([])
  const [isValidCardExp, setIsValidCardExp] = useState([])
  const [isValidCardCvv, setIsValidCardCvv] = useState([])

  const [inputError, setInputError] = useState([])

  const { isSidebarOpen } = useGlobal()
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const { id } = useParams()

  const { data: singleStore = [], refetch } = useQuery({
    queryKey: ['single_store'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/store_api/get_store_by_id?id=${id}`)
        if (res.status === 200) {
          setStoreDetails(res.data.data)
          setAddSupplier(res.data.data?.supplier_information?.length > 0 ? parseInt(res.data.data?.supplier_information?.length) : 1)
          return res.data.data;
        }
        if (res.status === 204) {
          return {}
        }
      } catch (error) {
        console.log(error);
        return {};
      }
    }
  })

  const handleAddSupplierRemoveField = (index) => {
    if (document.getElementById(`store_parent_div`).children.length > 1) {
      document.getElementById(`supplier_parent_div_${index}`).remove();
    }
  }

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
    axios.post(`/api/v1/store_api/update_store_details?id=${storeDetails?._id}`, updateData)
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

  const handleNext = async () => {
    setLoading(true)
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
      axios.post(`/api/v1/store_api/update_store_suppliers_details?id=${storeDetails?._id}`, { supplier_information: suppliers_data, additional_payment_details: additional_payment_data })
        .then(res => {
          if (res.status === 200) {
            setLoading(false)
            refetch()
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Updated New Data",
              showConfirmButton: false,
              timer: 1500,
            });
          }
          if (res.status === 204) {
            setLoading(false)
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "Not Updated New Data",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }).catch(err => {
          setLoading(false)
          console.log(err)
        })
    }

    setInputError(error_data)
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

                  {addSupplier && <SupplierInfoInputListEdit storeDetails={storeDetails} from_index={index + 1} />}
                </div>

                {/* add payment details  */}
                <div className="w-1/2 p-4 pb-10">
                  <div>
                    {(inputError.filter((element) => element.id == `supplier_parent_div_${index}` && element.type == 'payment').length > 0) && <p className="w-full mt-3 flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {'Missing additional payment details'}</p>}
                  </div>
                  {addSupplier && <AdditionalPaymentInputListEdit storeDetails={storeDetails} from_index={index + 1} isValidCardNumber={isValidCardNumber} setIsValidCardNumber={setIsValidCardNumber} isValidCardExp={isValidCardExp} setIsValidCardExp={setIsValidCardExp} isValidCardCvv={isValidCardCvv} setIsValidCardCvv={setIsValidCardCvv} />}
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
      <button disabled={loading} onClick={handleNext} className="flex items-center justify-center border border-[#8633FF]  w-80 mx-auto mt-12 py-[10px] rounded-md text-[#8633FF] hover:bg-[#8633FF] hover:text-white transition font-medium">
        <p className="flex items-center gap-1"><span>Update</span><span className={loading ? "loading loading-spinner loading-xs" : 'hidden'}></span></p>
      </button>
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
