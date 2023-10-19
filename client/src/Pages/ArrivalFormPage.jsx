import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import Swal from "sweetalert2";

const ArrivalFormPage = () => {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };

  const { user } = useAuth();
  const [inputError, setInputError] = useState('')

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
    const date = form.date.value;
    const asinUpc = form.code.value;
    const storeName = form.storeName.value;
    const supplierId = form.supplierId.value;
    const upin = form.upin.value;
    const unitPrice = form.unitPrice.value;
    const codeType = form.codeType.value;
    const productName = form.productName.value;
    const quantity = form.quantity.value;
    const eda = form.eda.value;          // estimated date of arrival
    const warehouse = form.warehouse.value;

    if (storeName === "Pick Store Name" || !storeName) {
      setInputError('Select a store name')
      return;
    }
    if (asinUpc === "Select ASIN or UPC" || !asinUpc) {
      setInputError('Select ASIN or UPC')
      return;
    }
    if (codeType === "Pick Code Type" || !codeType) {
      setInputError('Select code type')
      return;
    }
    if (warehouse === "Select Warehouse" || !warehouse) {
      setInputError('Select a warehouse')
      return;
    }
    if (!date || !asinUpc || !storeName || !supplierId || !upin || !unitPrice || !codeType || !productName || !quantity || !eda || !warehouse) {
      setInputError('Please fill out all the inputs in order to submit the form')
      return;
    }
    const isoDate = new Date(date).toISOString();
    const isoEda = new Date(eda).toISOString();
    const arrivalFormData = {
      admin_id: user.admin_id,
      date: isoDate,
      store_name: storeName,
      asin_upc_code: asinUpc,
      code_type: codeType,
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
                  <label className="text-slate-500">Date</label>
                  <input
                    type="date"
                    placeholder="Enter store name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="date"
                    name="date"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">ASIN/UPC</label>
                  <select
                    className="select select-primary w-full mt-2 shadow-lg"
                    name="code"
                    id="code"
                  >
                    <option defaultValue="Select ASIN or UPC">Select ASIN or UPC</option>
                    <option value="Test-1">Test-1</option>
                    <option value="Test-2">Test-2</option>
                  </select>
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
                    type="text"
                    placeholder="Enter UPIN"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="upin"
                    name="upin"
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
                  <label className="text-slate-500">Store name*</label>
                  <select
                    className="select select-primary w-full mt-2 shadow-lg"
                    name="storeName"
                    id="storeName"
                  >
                    <option defaultValue="Pick Store Name">Pick Store Name</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Daraz">Daraz</option>
                    <option value="Alibaba">Alibaba</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="text-slate-500">Code type</label>
                  <select
                    className="select select-primary w-full mt-2 shadow-lg"
                    name="codeType"
                    id="codeType"
                  >
                    <option defaultValue="Pick Code Type">Pick Code Type</option>
                    <option value="ASIN">ASIN</option>
                    <option value="UPC">UPC</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Product Name</label>
                  <input
                    type="text"
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

            <div className="mt-4">
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

            <div>{inputError && <p className="w-[100%] flex gap-1 items-center justify-center text-center mt-5 text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {inputError}</p>}</div>

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
