import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";
import ToastMessage from "../Components/Shared/ToastMessage";
import SearchDropdown from "../Utilities/SearchDropdown";
import { useQuery } from "@tanstack/react-query";
import useGlobal from "../hooks/useGlobal";
import { GlobalContext } from "../Providers/GlobalProviders";
import { NotificationContext } from "../Providers/NotificationProvider";
import { format } from "date-fns";
import { IoCalendarOutline } from "react-icons/io5";
import { Calendar } from "react-date-range";
import PulseLoader from "react-spinners/PulseLoader";

const PreparingFormPage = () => {
  const { socket } = useContext(GlobalContext);
  const { currentUser } = useContext(NotificationContext);
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
  const [storeOption, setStoreOption] = useState(null)
  const [warehouseOption, setWarehouseOption] = useState(null)
  const [asinUpcOption, setAsinUpcOption] = useState()
  const [productName, setProductName] = useState('')
  const [productNameLoading, setProductNameLoading] = useState(false)
  const { user } = useAuth()
  const { setCountsRefetch } = useGlobal()
  const [date, setDate] = useState(null)
  const [openDateCalendar, setOpenDateCalendar] = useState(false)
  const calendarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef?.current?.contains(event.target)) {
        setOpenDateCalendar(false)
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [])

  useEffect(() => {
    if (storeOption?.slug && asinUpcOption) {
      const upin = `${storeOption?.slug}_${asinUpcOption?.label}`;
      setProductNameLoading(true)
      axios
        .post(`/api/v1/all_stock_api/all_stock_by_upin?upin=${upin}`, { user })
        .then((res) => {
          if (res.status === 200) {
            setProductName(res.data.data.product_name);
          }
          // if (res.status === 204) {
          //   setProductName(asinUpcOption?.product_name);
          // }
        })
        .catch((err) => console.log(err))
        .finally(() => setProductNameLoading(false))
    }
  }, [storeOption?.slug, asinUpcOption, user]);

  const { data: asinUpcData = [], isLoading: asinLoading } = useQuery({
    queryKey: ["asin_upc_data", storeOption?.value],
    queryFn: async () => {
      try {
        const res = await axios.post(
          "/api/v1/asin_upc_api/get_store_based_asin_upc_data",
          { user: user, store_id: storeOption?.value }
        );
        if (res.status === 200) {
          return res.data.data;
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  const { data: allStoreData = [], isLoading: storeLoading } = useQuery({
    queryKey: ["get_all_stores_data"],
    queryFn: async () => {
      try {
        const res = await axios.post(
          "/api/v1/store_api/get_stores_dropdown_data",
          { user }
        );
        if (res.status === 200) {
          return res.data.data;
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  const { data: warehouseData = [], isLoading: warehouseLoading } = useQuery({
    queryKey: ["get_warehouse_data"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `/api/v1/warehouse_api/get_warehouse_dropdown_data?id=${user.admin_id}`
        );
        if (res.status === 200) {
          return res.data.data;
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  const handleKeyDown = (event) => {
    const alphabetKeys = /^[0-9\b]+$/; // regex pattern to match alphabet keys
    if (!alphabetKeys.test(event.key) && event.key != "Backspace") {
      event.preventDefault();
    }
  };

  const hadnlePreparingForm = (event) => {
    setInvoiceImageError("");
    setShippingImageError("");
    setFormError("");
    event.preventDefault();
    const form = event.target;
    const createdAt = new Date().toISOString();
    const orderID = form.orderID.value;
    const courier = form.courier.value;
    const upin = `${storeOption?.slug}_${asinUpcOption?.label}`;
    const quantity = form.quantity.value;
    const trackingNumber = form.trackingNumber.value;

    if (!warehouseOption?.label) {
      setFormError("Missing warehouse");
      return;
    }
    if (!storeOption?.slug) {
      setFormError("Select  Store");
      return;
    }
    if (!productName) {
      setFormError(`No product available under UPIN ${upin}`);
      return;
    }
    if (!date || !asinUpcOption || !orderID || !upin || !quantity) {
      setFormError("Missing form field detected");
      return;
    }

    const isoDate = new Date(date).toISOString();
    const formData = new FormData();
    let preparingFormvalue = {
      adminId: user?.admin_id,
      creatorEmail: user?.email,
      date: isoDate,
      asin_upc_code: asinUpcOption?.label,
      createdAt,
      orderID,
      courier,
      productName,
      storeName: storeOption?.slug,
      storeId: storeOption?.value,
      codeType: asinUpcOption?.code_type,
      upin,
      quantity,
      trackingNumber,
      warehouseName: warehouseOption?.label,
      warehouseId: warehouseOption?.value,
    };
    for (const key in preparingFormvalue) {
      formData.append(key, preparingFormvalue[key]);
    }
    const Invoice = InvoiceImageFile?.name.split(".").pop();
    const shipping = shippingImageFile?.name.split(".").pop();

    if (InvoiceImageFile && !shippingImageFile) {
      formData.append("file", InvoiceImageFile, `invoice.${Invoice}`);
    }
    if (shippingImageFile && !InvoiceImageFile) {
      formData.append("file", shippingImageFile, `shipping.${shipping}`);
    }
    if (InvoiceImageFile && shippingImageFile) {
      formData.append("file", InvoiceImageFile, `invoice.${Invoice}`);
      formData.append("file", shippingImageFile, `shipping.${shipping}`);
    }
    setLoading(true);
    axios
      .post("/api/v1/preparing_form_api/preparing_form_insert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res)
        if (res.status === 201) {
          console.log(currentUser);
          const notification_link =
            "/dashboard/management/store/preparing-request";
          const notification_search = [res?.data?.result?.insertedId];
          const status = "Submit a preparing request form.";
          axios
            .post(`/api/v1/notifications_api/send_notification`, {
              currentUser,
              status,
              notification_link,
              notification_search,
              storeId: storeOption?.value,
              warehouseId: warehouseOption?.value,
            })
            .then((res) => {
              if (res?.data?.finalResult?.acknowledged) {
                // send real time notification data
                const notificationData = res.data.notificationData;
                socket?.current?.emit("sendNotification", {
                  user,
                  notificationData,
                });
              }
            })
            .catch((err) => console.log(err));
          setCountsRefetch(true);
          Swal.fire(
            "Added",
            "Preparing form request has been added.",
            "success"
          );
          form.reset();
          setProductName("");
          setDate(null)
          setWarehouseOption(null);
          setStoreOption(null);
          setAsinUpcOption(null);
          setInvoiceImageFile(null);
          setShippingImageFile(null);
          setInvoiceImageSrc(null);
          setShippingImageSrc(null);
        }
        else if (res.data?.status === 'exceeded'){
          setFormError(res.data?.message)
        }
        else {
          setFormError("Something went wrong to send preparing form request");
        }
      })
      .catch((err) => {
        console.log(err);
        setFormError("Something went wrong to send preparing form request");
      })
      .finally(() => setLoading(false))
  };

  const handleInvoiceImage = (e) => {
    if (e.target.files[0]) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (e.target.files[0].size > maxSizeInBytes) {
        setInvoiceImageError("File size must be less than 5 MB");
        return;
      } else {
        ("");
        setInvoiceImageSrc(URL.createObjectURL(e.target.files[0]));
        setInvoiceImageFile(e.target.files[0]);
      }
    }
  };

  const handleShippingImage = (e) => {
    if (e.target.files[0]) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (e.target.files[0].size > maxSizeInBytes) {
        setShippingImageError("File size must be less than 5 MB");
        return;
      } else {
        setShippingImageError("");
        setShippingImageSrc(URL.createObjectURL(e.target.files[0]));
        setShippingImageFile(e.target.files[0]);
      }
    }
  };

  return (
    <div className="py-20 rounded-lg w-[60%] mx-auto">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] bg-white shadow-lg h-fit w-full m-auto rounded-xl"
      >
        <div className="text-center mt-10">
          <p className="text-2xl font-bold">Preparing Request Form</p>
        </div>
        <div className="lg:py-10 lg:px-20 w-full">
          <form className="w-full" onSubmit={hadnlePreparingForm}>
            <div className="flex gap-7">
              <div className="w-full">

                <div className="relative">
                  <p className="text-slate-500">Date</p>
                  <div className="w-full mt-2 shadow-lg rounded-lg bg-white px-4 h-12 border border-[#8633FF] flex justify-between items-center">
                    <span>{date ? format(new Date(date), 'yyyy/MM/dd') : 'YYYY/MM/DD'}</span>
                    <div ref={calendarRef}>
                      <span onClick={() => setOpenDateCalendar(!openDateCalendar)}><IoCalendarOutline size={18} /></span>
                      {openDateCalendar && <div style={{ boxShadow: "-1px 3px 8px 0px rgba(0, 0, 0, 0.2)" }} className='absolute bg-white right-0 top-full z-[999] border border-gray-300 shadow-lg w-fit rounded-[10px] overflow-hidden'>
                        <Calendar
                          color='#8633FF'
                          date={date ? date : null}
                          onChange={(date) => {
                            setDate(date)
                            setOpenDateCalendar(false)
                          }}
                        />
                      </div>}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-slate-500 mb-2">ASIN/UPC</label>
                  <SearchDropdown
                    isLoading={asinLoading}
                    option={asinUpcOption}
                    placeholder="Select ASIN or UPC"
                    optionData={asinUpcData}
                    setOption={setAsinUpcOption}
                  />
                </div>

                <div className="mt-4 relative">
                  {productNameLoading && <span className="absolute top-[43px] right-4"><PulseLoader color="#D1D5DB" size={4} /></span>}
                  <label className="text-slate-500">Product Name</label>
                  <input
                    type="text"
                    readOnly
                    value={productName}
                    required
                    placeholder="Enter product name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg cursor-not-allowed"
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
                    <option value="FedEx">FedEx</option>
                    <option value="Sky Postal">Sky Postal</option>
                    <option value="United Percel Service">United Percel Service</option>
                    <option value="Pace Couriers">Pace Couriers</option>
                    <option value="Central Courier Company">Central Courier Company</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Invoice</label>
                  <div className="flex items-center w-full mt-2">
                    <label
                      htmlFor="invoice-dropzone"
                      className="flex justify-between items-center px-4 w-full min-h-[70px] max-h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 shadow-lg"
                    >
                      <div className="flex items-center gap-5 py-[6.5px]">
                        {InvoieImageSrc ? (
                          <img src={InvoieImageSrc} className="h-8" alt="" />
                        ) : (
                          <AiOutlineCloudUpload size={26} />
                        )}
                        <div>
                          {InvoiceImageFile && (
                            <p className="text-md font-semibold">
                              {InvoiceImageFile.name.slice(0, 32)}
                            </p>
                          )}
                          {!InvoiceImageFile && (
                            <p className="text-xs text-gray-700 dark:text-gray-400 font-semibold">
                              Select a file or drag and drop
                            </p>
                          )}

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
                {InvoiceImageError && (
                  <p className="text-xs mt-2 font-medium text-rose-500">
                    {InvoiceImageError}
                  </p>
                )}
              </div>

              <div className="w-full">
                <div>
                  <label className="text-slate-500">Store name</label>
                  <SearchDropdown
                    isLoading={storeLoading}
                    option={storeOption}
                    optionData={allStoreData}
                    placeholder="Select Store"
                    setOption={setStoreOption}
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Code type</label>
                  <input
                    type="text"
                    readOnly
                    value={asinUpcOption?.code_type}
                    placeholder="Enter product name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="code"
                    name="code"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">UPIN</label>
                  <input
                    required
                    readOnly
                    value={
                      storeOption?.slug &&
                      asinUpcOption &&
                      `${storeOption?.slug}_${asinUpcOption?.label}`
                    }
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
                      className="flex justify-between items-center px-4 w-full min-h-[70px] max-h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 shadow-lg"
                    >
                      <div className="flex items-center gap-5 py-[6.5px]">
                        {shippingImageSrc ? (
                          <img src={shippingImageSrc} className="h-8" alt="" />
                        ) : (
                          <AiOutlineCloudUpload size={26} />
                        )}
                        <div>
                          {shippingImageFile && (
                            <p className="text-md font-semibold">
                              {shippingImageFile.name.slice(0, 32)}
                            </p>
                          )}
                          {!shippingImageFile && (
                            <p className="text-xs text-gray-700 dark:text-gray-400 font-semibold">
                              Select a file or drag and drop
                            </p>
                          )}
                          <p className="text-xs  text-gray-500 dark:text-gray-400">
                            PNG, JPG or PDF, file size no more than 5MB
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

                  {shippingImageError && (
                    <p className="text-xs mt-2 font-medium text-rose-500">
                      {shippingImageError}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-slate-500">Warehouse</label>
              <SearchDropdown
                isLoading={warehouseLoading}
                option={warehouseOption}
                optionData={warehouseData}
                placeholder="Select warehouse"
                setOption={setWarehouseOption}
              />
            </div>
            <ToastMessage errorMessage={formError} />
            <div className="flex items-center justify-center mt-8">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#8633FF] flex gap-2 py-3 justify-center items-center text-white rounded-lg w-full"
              >
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
