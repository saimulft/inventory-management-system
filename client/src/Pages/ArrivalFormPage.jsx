import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useContext, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import SearchDropdown from "../Utilities/SearchDropdown";
import useGlobal from "../hooks/useGlobal";
import { GlobalContext } from "../Providers/GlobalProviders";
import { NotificationContext } from "../Providers/NotificationProvider";
import { Calendar } from "react-date-range";
import { format } from "date-fns";
import PulseLoader from "react-spinners/PulseLoader";

const ArrivalFormPage = () => {
  const { socket } = useContext(GlobalContext);
  const { currentUser } = useContext(NotificationContext);
  const { user } = useAuth();
  const { setCountsRefetch } = useGlobal();
  const [inputError, setInputError] = useState("");
  const [asinUpcOption, setAsinUpcOption] = useState(null);
  const [storeOption, setStoreOption] = useState(null);
  const [warehouseOption, setWarehouseOption] = useState(null);
  const [productName, setProductName] = useState("");
  const [productNameLoading, setProductNameLoading] = useState(false)
  const [eda, setEda] = useState(null)
  const [openEdaCalendar, setOpenEdaCalendar] = useState(false)
  const calendarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef?.current?.contains(event.target)) {
        setOpenEdaCalendar(false)
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [])

  useEffect(() => {
    if (storeOption?.slug && asinUpcOption) {
      const upin = `${storeOption?.slug}_${asinUpcOption.label}`;
      setProductNameLoading(true)
      axios
        .post(`/api/v1/all_stock_api/all_stock_by_upin?upin=${upin}`, { user })
        .then((res) => {

          if (res.status === 200) {
            setProductName(res.data.data.product_name);
          }
          if (res.status === 204) {
            setProductName(asinUpcOption.product_name);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setProductNameLoading(false))
    }
  }, [storeOption?.slug, asinUpcOption, user]);

  const { data: asinUpcData = [], isLoading: asinLoading } = useQuery({
    queryKey: ["asin_upc_data"],
    queryFn: async () => {
      try {
        const res = await axios.post(
          "/api/v1/asin_upc_api/get_asin_upc_dropdown_data",
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

  const handlePriceKeyDown = (event) => {
    const alphabetKeys = /^[0-9]*\.*$/;
    if (!alphabetKeys.test(event.key) && event.key != "Backspace") {
      event.preventDefault();
    }
  };

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (arrivalFormData) => {
      return axios.post(
        "/api/v1/pending_arrival_api/insert_pending_arrival_form_data",
        arrivalFormData
      );
    },
  });

  const handleArrivalForm = async (event) => {
    event.preventDefault();
    setInputError("");

    const form = event.target;
    const date = new Date().toISOString();
    const supplierId = form.supplierId.value;
    const upin = form.upin.value;
    const unitPrice = form.unitPrice.value;
    const quantity = form.quantity.value;


    if (!warehouseOption?.label) {
      setInputError("Select a warehouse");
      return;
    }

    if (!asinUpcOption) {
      setInputError("Select ASIN or UPC");
      return;
    }

    if (!storeOption) {
      setInputError("Select Store");
      return;
    }

    if (
      !date ||
      !asinUpcOption?.label ||
      !storeOption?.slug ||
      !supplierId ||
      !upin ||
      !unitPrice ||
      !productName ||
      !quantity ||
      !eda
    ) {
      setInputError(
        "Please fill out all the inputs in order to submit the form"
      );
      return;
    }

    const isoEda = new Date(eda).toISOString();
    const arrivalFormData = {
      admin_id: user.admin_id,
      date: date,
      creator_email: user?.email,
      store_name: storeOption?.slug,
      store_id: storeOption?.value,
      asin_upc_code: asinUpcOption.label,
      code_type: asinUpcOption?.code_type,
      supplier_id: supplierId,
      product_name: productName,
      upin: upin,
      quantity: quantity,
      unit_price: unitPrice,
      eda: isoEda,
      warehouse_name: warehouseOption?.label,
      warehouse_id: warehouseOption?.value,
    }

    try {
      const { status, data } = await mutateAsync(arrivalFormData);
      if (status === 201) {
        const notification_link = "/dashboard/management/store/pending-arrival";
        const notification_search = [data?.result?.insertedId];
        const notificationStatus = "Submit a pending arrival form.";
        axios
          .post(`/api/v1/notifications_api/send_notification`, {
            currentUser,
            status: notificationStatus,
            notification_search,
            notification_link,
            storeId: storeOption?.value,
            warehouseId: warehouseOption?.value,
          })
          .then((res) => {
            if (res?.data?.finalResult?.acknowledged) {
              const notificationData = res.data.notificationData;
              socket?.current?.emit("sendNotification", {
                user,
                notificationData,
              });
            }
          })
          .catch((err) => console.log(err));
        setCountsRefetch(true);
        form.reset();
        setAsinUpcOption("");
        setStoreOption("");
        setProductName("");
        setEda(null)
        setWarehouseOption(null);
        Swal.fire(
          "Submitted",
          "Pending arrival data has been submitted.",
          "success"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };
  
  return (
    <div className="py-20 mx-auto w-[60%] rounded-lg">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] shadow-lg h-full w-full m-auto rounded-xl"
      >
        <div className="text-center mt-10">
          <p className="text-2xl font-bold">Pending Arrival Form</p>
        </div>
        <div className="lg:py-10 lg:px-20 w-full flex justify-center">
          <form className="w-[100%]" onSubmit={handleArrivalForm}>
            <div className="flex gap-7">
              <div className="w-full">
                <div>
                  <label className="text-slate-500">Warehouse</label>
                  <SearchDropdown
                    isLoading={warehouseLoading}
                    isMulti={false}
                    option={warehouseOption}
                    optionData={warehouseData}
                    placeholder="Select warehouse"
                    setOption={setWarehouseOption}
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">ASIN/UPC</label>
                  <SearchDropdown
                    isLoading={asinLoading}
                    isMulti={false}
                    option={asinUpcOption}
                    optionData={asinUpcData}
                    placeholder="Select ASIN or UPC"
                    setOption={setAsinUpcOption}
                  />
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
                    value={
                      asinUpcOption && storeOption?.slug
                        ? `${storeOption?.slug}_${asinUpcOption.label}`
                        : ""
                    }
                    type="text"
                    placeholder="Enter UPIN"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg cursor-not-allowed"
                    id="upin"
                    name="upin"
                    readOnly
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Unit Price</label>
                  <input
                    onKeyDown={handlePriceKeyDown}
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
                  <SearchDropdown
                    isLoading={storeLoading}
                    isMulti={false}
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
                    placeholder="Code type"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="codeType"
                    name="codeType"
                  />
                </div>

                <div className="mt-4 relative">
                  {productNameLoading && <span className="absolute top-[43px] right-4"><PulseLoader color="#D1D5DB" size={4} /></span>}
                  <label className="text-slate-500">Product Name</label>
                  <input
                    type="text"
                    readOnly
                    value={productName}
                    placeholder="Enter product name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg cursor-not-allowed"
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

                <div className="mt-4 relative">
                  <p className="text-slate-500">EDA</p>
                  <div className="w-full mt-2 shadow-lg rounded-lg bg-white px-4 h-12 border border-[#8633FF] flex justify-between items-center">
                    <span>{eda ? format(new Date(eda), 'yyyy/MM/dd') : 'YYYY/MM/DD'}</span>
                    <div ref={calendarRef}>
                      <span onClick={() => setOpenEdaCalendar(!openEdaCalendar)}><IoCalendarOutline size={18} /></span>
                      {openEdaCalendar && <div style={{ boxShadow: "-1px 3px 8px 0px rgba(0, 0, 0, 0.2)" }} className='absolute bg-white right-0 bottom-[48px] z-[999] border border-gray-300 shadow-lg w-fit rounded-[10px] overflow-hidden'>
                        <Calendar
                          color='#8633FF'
                          date={eda ? eda : null}
                          onChange={(date) => {
                            setEda(date)
                            setOpenEdaCalendar(false)
                          }}
                        />
                      </div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              {inputError && (
                <p className="w-[100%] flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded">
                  <MdErrorOutline size={20} /> {inputError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#8633FF] flex gap-2 py-3 justify-center items-center text-white  rounded-lg w-full capitalize"
              >
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
