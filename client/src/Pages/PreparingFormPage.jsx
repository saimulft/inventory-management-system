import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";
import ToastMessage from "../Components/Shared/ToastMessage";
import AsinSearchDropdown from "../Utilities/AsinSearchDropdown";
import { useQuery } from "@tanstack/react-query";
const PreparingFormPage = () => {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };
  const [InvoieImageSrc, setInvoiceImageSrc] = useState(null)
  const [InvoiceImageFile, setInvoiceImageFile] = useState(null)
  const [InvoiceImageError, setInvoiceImageError] = useState('')
  const [shippingImageSrc, setShippingImageSrc] = useState(null)
  const [shippingImageFile, setShippingImageFile] = useState(null)
  const [shippingImageError, setShippingImageError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [asinUpcOption, setAsinUpcOption] = useState()
  const [storeName, setStoreName] = useState('')
  const [productName, setProductName] = useState('')
  const { user } = useAuth()

  const asinId = asinUpcOption?.value
  const asinUpc = asinUpcOption?.data?.filter(asinUpc => asinId === asinUpc._id)

  useEffect(() => {
    if (storeName && asinUpcOption) {
      const upin = (`${storeName}_${asinUpcOption.label}`);

      axios.get(`/api/v1/all_stock_api/all_stock_by_upin?upin=${upin}`)
        .then(res => {
          if (res.status === 200) {
            console.log(res.data.data)
            setProductName(res.data.data.product_name)
          }
          if (res.status === 204) {

            setProductName("")
          }
        }).catch(err => console.log(err))
    }
  }, [storeName, asinUpcOption]);

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


  const hadnlePreparingForm = (event) => {
    setInvoiceImageError('')
    setShippingImageError('')
    setFormError('')
    event.preventDefault()
    const form = event.target
    const date = new Date().toISOString();
    const orderID = form.orderID.value
    const courier = form.courier.value
    const storeName = form.storeName.value
    const upin = `${storeName}_${asinUpcOption?.label}`
    const quantity = form.quantity.value
    const trackingNumber = form.trackingNumber.value
    const warehouse = form.warehouse.value



    if (warehouse === 'Select Warehouse' || !warehouse) {
      setFormError("Missing warehouse")
      return
    }

    if (storeName === 'Pick Store Name' || !storeName) {
      setFormError("Missing  store name")
      return
    }
    if (!productName) {
      setFormError(`No product available under UPIN ${upin}`)
      return
    }
    if (!date || !asinUpcOption.label || !orderID || !storeName || !upin || !quantity) {
      setFormError("Missing form field detected")
      return;
    }

    const formData = new FormData()
    let preparingFormvalue = {
      adminId: user?.admin_id,
      creatorEmail: user?.email,
      date,
      asin_upc_code: asinUpcOption.label,
      orderID,
      courier,
      productName,
      storeName,
      codeType: asinUpc && asinUpc[0].code_type,
      upin,
      quantity,
      trackingNumber,
      warehouse
    }
    for (const key in preparingFormvalue) {
      formData.append(key, preparingFormvalue[key]);
    }
    const Invoice = InvoiceImageFile?.name.split('.').pop();
    const shipping = shippingImageFile?.name.split('.').pop();

    if (InvoiceImageFile && !shippingImageFile) {
      formData.append('file', InvoiceImageFile, `invoice.${Invoice}`)
    }
    if (shippingImageFile && !InvoiceImageFile) {
      formData.append('file', shippingImageFile, `shipping.${shipping}`)
    }
    if (InvoiceImageFile && shippingImageFile) {
      formData.append('file', InvoiceImageFile, `invoice.${Invoice}`)
      formData.append('file', shippingImageFile, `shipping.${shipping}`)
    }
    setLoading(true)
    axios.post('/api/v1/preparing_form_api/preparing_form_insert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(res => {
        if (res.status === 201) {
          Swal.fire(
            'Added',
            'Preparing form request has been added.',
            'success'
          )
          form.reset()
          setProductName("")
          setAsinUpcOption(null)
          setInvoiceImageFile(null)
          setShippingImageFile(null)
          setInvoiceImageSrc(null)
          setShippingImageSrc(null)
          setLoading(false)
        }
        else {
          setLoading(false)
          setFormError("Something went wrong to send preparing form request")
        }
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        setFormError("Something went wrong to send preparing form request")

      })
  }
  const handleInvoiceImage = (e) => {
    if (e.target.files[0]) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (e.target.files[0].size > maxSizeInBytes) {
        setInvoiceImageError("File size must be less than 5 MB")
        return;

      } else {
        ('')
        setInvoiceImageSrc(URL.createObjectURL(e.target.files[0]))
        setInvoiceImageFile(e.target.files[0])
      }
    }
  }
  const handleShippingImage = (e) => {
    if (e.target.files[0]) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (e.target.files[0].size > maxSizeInBytes) {
        setShippingImageError("File size must be less than 5 MB")
        return;

      } else {
        setShippingImageError('')
        setShippingImageSrc(URL.createObjectURL(e.target.files[0]))
        setShippingImageFile(e.target.files[0])
      }
    }
  }


  return (
    <div className="py-20 rounded-lg">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] bg-white shadow-lg h-fit w-fit m-auto rounded-xl"
      >
        <div className="text-center mt-10">
          <p className="text-2xl font-bold">Preparing Request From</p>
        </div>
        <div className="lg:py-10 lg:px-20 w-full">
          <form onSubmit={hadnlePreparingForm}>
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
                  <label className="text-slate-500 mb-2">ASIN/UPC</label>
                  <AsinSearchDropdown asinUpcOption={asinUpcOption} asinUpcData={asinUpcData} setAsinUpcOption={setAsinUpcOption} />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Product Name</label>
                  <input
                    type="text"
                    readOnly
                    value={productName}
                    required
                    placeholder="Enter product name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="productName"
                    name="productName"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Order ID</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter merchant order number"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="orderId"
                    name="orderID"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Courier</label>
                  <select
                    className="select select-primary w-full mt-2 shadow-lg"
                    name="courier"
                    id="courier"
                  >
                    <option defaultValue="Select courier">
                      Select courier
                    </option>
                    <option value="test1">Test1</option>
                    <option value="test2">Test2</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Invoice</label>
                  <div className="flex items-center w-full mt-2">
                    <label
                      htmlFor="invoice-dropzone"
                      className="flex justify-between items-center px-4 w-max h-[70px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 shadow-lg"
                    >
                      <div className="flex items-center gap-8 py-[6.5px]">
                        {InvoieImageSrc ? <img src={InvoieImageSrc} className="h-8" alt="" /> :
                          <AiOutlineCloudUpload size={26} />}
                        <div>


                          {InvoiceImageFile && <p className="text-md font-semibold">{InvoiceImageFile.name.slice(0, 32)}</p>}
                          {!InvoiceImageFile && <p className="text-xs text-gray-700 dark:text-gray-400 font-semibold">
                            Select a file or drag and drop
                          </p>}

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG or PDF, file size no more than 5MB
                          </p>
                        </div>
                      </div>
                      <input
                        id="invoice-dropzone"
                        name="invoice-dropzone"
                        accept="image/*,application/pdf"
                        type="file"
                        onChange={handleInvoiceImage}
                        className="hidden"
                      />
                      <div className="ml-5">
                        <button
                          onClick={() => {
                            document.getElementById("invoice-dropzone").click();
                          }}
                          type="button"
                          className="w-[100px] btn btn-outline btn-primary btn-xs"
                        >
                          select file
                        </button>
                      </div>
                    </label>
                  </div>
                </div>
                {InvoiceImageError && <p className="text-xs mt-2 font-medium text-rose-500">{InvoiceImageError}</p>}
              </div>

              <div className="w-full">
                <div>
                  <label className="text-slate-500">Store name</label>
                  <select
                    className="select select-primary w-full mt-2 shadow-lg"
                    name="storeName"
                    id="storeName"
                    onChange={(e) => {
                      if (e.target.value === 'Pick Store Name') {
                        setStoreName('')
                      }
                      else {
                        setStoreName(e.target.value)
                      }
                    }}
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
                  <label className="text-slate-500">UPIN</label>
                  <input
                    required
                    readOnly
                    value={storeName && asinUpcOption && `${storeName}_${asinUpcOption.label}`}
                    type="text"
                    placeholder="Enter UPIN"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg cursor-not-allowed"
                    id="upin"
                    name="upin"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Quantity</label>
                  <input
                    onKeyDown={handleKeyDown}
                    required
                    type="text"
                    placeholder="Enter quantity"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="quantity"
                    name="quantity"
                  />
                </div>
                <div className="mt-4">
                  <label className="text-slate-500">Tracking Number</label>
                  <input

                    type="text"
                    placeholder="Enter tracking number"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="trackingNumber"
                    name="trackingNumber"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Shipping Label</label>
                  <div className="flex items-center w-full mt-2">
                    <label
                      htmlFor="shippingLabel-dropzone"
                      className="flex justify-between items-center px-4 w-full h-[70px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 shadow-lg"
                    >
                      <div className="flex items-center gap-5 py-[6.5px]">
                        {shippingImageSrc ? <img src={shippingImageSrc} className="h-8" alt="" /> :
                          <AiOutlineCloudUpload size={26} />}
                        <div>
                          {shippingImageFile && <p className="text-md font-semibold">{shippingImageFile.name.slice(0, 32)}</p>}
                          {!shippingImageFile && <p className="text-xs text-gray-700 dark:text-gray-400 font-semibold">
                            Select a file or drag and drop
                          </p>}
                          <p className="text-xs  text-gray-500 dark:text-gray-400">
                            PNG, JPG or PDF, file size no more than 10MB
                          </p>
                        </div>
                      </div>
                      <input
                        id="shippingLabel-dropzone"
                        name="shippingLabel-dropzone"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleShippingImage}
                        className="hidden"
                      />
                      <div className="ml-5">
                        <button
                          onClick={() => {
                            document
                              .getElementById("shippingLabel-dropzone")
                              .click();
                          }}
                          type="button"
                          className="w-[100px] btn btn-outline btn-primary btn-xs"
                        >
                          select file
                        </button>
                      </div>
                    </label>
                  </div>
                  {shippingImageError && <p className="text-xs mt-2 font-medium text-rose-500">{shippingImageError}</p>}
                </div>

              </div>
            </div>

            <ToastMessage errorMessage={formError} />
            <div className="flex items-center justify-center mt-8">
              <button type="submit" disabled={loading} className="bg-[#8633FF] flex gap-2 py-3 justify-center items-center text-white rounded-lg w-full">
                {loading && <FaSpinner size={20} className="animate-spin" />}
                Preparing Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreparingFormPage;