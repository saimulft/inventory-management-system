import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import Swal from "sweetalert2";
import AsinSearchDropdown from "../Utilities/AsinSearchDropdown";

const ArrivalFormPage = () => {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };
  const { user } = useAuth();
  const [inputError, setInputError] = useState('')
  const [asinUpcOption, setAsinUpcOption] = useState(null)
  const [storeName, setStoreName] = useState('')
  const [productName, setProductName] = useState('')
  const asinId = asinUpcOption?.value
  const asinUpc = asinUpcOption?.data?.filter(asinUpc => asinId === asinUpc._id)


  useEffect(() => {
    if (storeName && asinUpcOption) {
      const upin = (`${storeName}_${asinUpcOption.label}`);
      axios.get(`/api/v1/all_stock_api/all_stock_by_upin?upin=${upin}`)
        .then(res => {
          if (res.status === 200) {
            setProductName(res.data.data.product_name)
          }
          if (res.status === 204) {
            setProductName(asinUpc[0]?.product_name)
          }
        }).catch((error) => {
          console.log(error)
        })
    }
  }, [storeName, asinUpcOption, asinUpc]);

  const { data: asinUpcData = [] } = useQuery({
    queryKey: ['asin_upc_data'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/asin_upc_api/get_asin_upc_by_email?email=${user?.email}`)
        if (res.status === 200) {
          return res.data.data;
        }
        return []
      } catch (error) {
        console.log(error)
        return []
      }
    }
  })

  const handleKeyDown = (event) => {
    const alphabetKeys = /^[0-9\b]+$/; // regex pattern to match alphabet keys
    if (!alphabetKeys.test(event.key) && event.key != "Backspace") {
      event.preventDefault();
    }
  };

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (arrivalFormData) => {
      return axios.post('/api/v1/pending_arrival_api/insert_pending_arrival_form_data', arrivalFormData)
    },
  })

  const handleArrivalForm = async (event) => {
    event.preventDefault()
    setInputError('')

    const form = event.target;
    const date = new Date().toISOString();
    const storeName = form.storeName.value;
    const supplierId = form.supplierId.value;
    const upin = form.upin.value;
    const unitPrice = form.unitPrice.value;
    const quantity = form.quantity.value;
    const eda = form.eda.value;          // estimated date of arrival
    const warehouse = form.warehouse.value;

    if (warehouse === "Select Warehouse" || !warehouse) {
      setInputError('Select a warehouse')
      return;
    }
    if (storeName === "Pick Store Name" || !storeName) {
      setInputError('Select a store name')
      return;
    }
    if (!asinUpcOption) {
      setInputError('Select ASIN or UPC')
      return;
    }

    if (!date || !asinUpcOption?.label || !storeName || !supplierId || !upin || !unitPrice || !productName || !quantity || !eda || !warehouse) {
      setInputError('Please fill out all the inputs in order to submit the form')
      return;
    }

    const isoEda = new Date(eda).toISOString();
    const arrivalFormData = {
      admin_id: user.admin_id,
      date: date,
      creator_email: user?.email,
      store_name: storeName,
      asin_upc_code: asinUpcOption.label,
      code_type: asinUpc[0]?.code_type,
      supplier_id: supplierId,
      product_name: productName,
      upin: upin,
      quantity: quantity,
      unit_price: unitPrice,
      eda: isoEda,
      warehouse_name: warehouse
    }

    try {
      const { status } = await mutateAsync(arrivalFormData)
      if (status === 201) {
        form.reset()
        setAsinUpcOption('')
        setProductName('')
        Swal.fire(
          'Submitted',
          'Pending arrival data has been submitted.',
          'success'
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-white py-20 rounded-lg w-full">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] shadow-lg h-fit w-fit m-auto rounded-xl"
      >
        <div className="text-center mt-10">
          <p className="text-2xl font-bold">Pending Arrival From</p>
        </div>
        <div className="lg:py-10 lg:px-20 w-full flex justify-center">
          <form onSubmit={handleArrivalForm}>
            <div className="flex gap-7">
              <div className="w-full">
                <div>
                  <label className="text-slate-500">Warehouse</label>
                  <select
                    className="select select-primary w-full mt-2 shadow-lg"
                    name="warehouse"
                    id="warehouse"
                  >
                    <option defaultValue="Select Warehouse">Select Warehouse</option>
                    <option value="Test-1">Test-1</option>
                    <option value="Test-2">Test-2</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">ASIN/UPC</label>
                  <AsinSearchDropdown asinUpcOption={asinUpcOption} asinUpcData={asinUpcData} setAsinUpcOption={setAsinUpcOption} />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Supplier ID</label>
                  <input
                    type="text"
                    placeholder="Enter supplier order number"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="supplierId"
                    name="supplierId"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">UPIN</label>
                  <input
                    value={asinUpcOption && storeName && storeName !== 'Pick Store Name' ? `${storeName}_${asinUpcOption.label}` : ''}
                    type="text"
                    placeholder="Enter UPIN"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="upin"
                    name="upin"
                    readOnly
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Unit Price</label>
                  <input
                    type="text"
                    placeholder="Enter unit price"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="unitPrice"
                    name="unitPrice"
                  />
                </div>
              </div>

              <div className="w-full">
                <div>
                  <label className="text-slate-500">Store name</label>
                  <select
                    className="select select-primary w-full mt-2 shadow-lg"
                    name="storeName"
                    id="storeName"
                    onChange={(e) => setStoreName(e.target.value)}
                  >
                    <option defaultValue="Pick Store Name">
                      Pick Store Name
                    </option>
                    <option value="Amazon">Amazon</option>
                    <option value="Daraz">Daraz</option>
                    <option value="Alibaba">Alibaba</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Code type</label>
                  <input
                    type="text"
                    readOnly
                    value={asinUpc && asinUpc[0].code_type}

                    placeholder="Enter product name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="productName"
                    name="productName"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Product Name</label>
                  <input
                    type="text"
                    readOnly
                    value={productName}
                    placeholder="Enter product name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="productName"
                    name="productName"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Quantity</label>
                  <input
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Enter quantity"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="quantity"
                    name="quantity"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">EDA</label>
                  <input
                    type="date"
                    placeholder="Enter store name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="eda"
                    name="eda"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">{inputError && <p className="w-[100%] flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {inputError}</p>}</div>

            <div className="flex items-center justify-center mt-8">
              <button type="submit" disabled={isLoading} className="bg-[#8633FF] flex gap-2 py-3 justify-center items-center text-white  rounded-lg w-72 capitalize">
                {isLoading && <FaSpinner size={20} className="animate-spin" />}
                <p>Pending Arrival Request</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArrivalFormPage;
