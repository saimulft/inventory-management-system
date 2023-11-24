import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useContext, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import Swal from "sweetalert2";
import SearchDropdown from "../Utilities/SearchDropdown";
import useGlobal from "../hooks/useGlobal";
import { GlobalContext } from "../Providers/GlobalProviders";
import { NotificationContext } from "../Providers/NotificationProvider";

const ArrivalFormPage = () => {
  const { socket } = useContext(GlobalContext);
  const { currentUser } = useContext(NotificationContext);
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };
  const { user } = useAuth();
  const { setCountsRefetch } = useGlobal();
  const [inputError, setInputError] = useState("");
  const [asinUpcOption, setAsinUpcOption] = useState(null);
  const [storeOption, setStoreOption] = useState(null);
  const [warehouseOption, setWarehouseOption] = useState(null);
  const [productName, setProductName] = useState("");
  const asinId = asinUpcOption?.value;
  const asinUpc = asinUpcOption?.data?.filter(
    (asinUpc) => asinId === asinUpc._id
  );

  useEffect(() => {
    if (storeOption?.label && asinUpcOption) {
      const upin = `${storeOption?.label}_${asinUpcOption.label}`;
      axios
        .post(`/api/v1/all_stock_api/all_stock_by_upin?upin=${upin}`, { user })
        .then((res) => {
          if (res.status === 200) {
            setProductName(res.data.data.product_name);
          }
          if (res.status === 204) {
            setProductName(asinUpc[0]?.product_name);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storeOption?.label, asinUpcOption, asinUpc, user]);

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
    const eda = form.eda.value;

    const amazonQuantity = form.amazonQuantity.value;
    const customerName = form.customerName.value;
    const amazonShipping = form.amazonShipping.value;
    const shippingCost = form.shippingCost.value;
    const handlingCost = form.handlingCost.value;
    const walmartQuantity = form.walmartQuantity.value;
    const amazonPrice = form.amazonPrice.value;
    const averagePrice = form.averagePrice.value;
    const averageTax = form.averageTax.value;
    const orderNumber = form.orderNumber.value;

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
      !storeOption?.label ||
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
      store_name: storeOption?.label,
      store_id: storeOption?.value,
      asin_upc_code: asinUpcOption.label,
      code_type: asinUpc[0]?.code_type,
      supplier_id: supplierId,
      product_name: productName,
      upin: upin,
      quantity: quantity,
      unit_price: unitPrice,
      eda: isoEda,
      warehouse_name: warehouseOption?.label,
      warehouse_id: warehouseOption?.value,
      amazon_quantity: amazonQuantity,
      customer_name: customerName,
      amazon_shipping: amazonShipping,
      shipping_cost: shippingCost,
      handling_cost: handlingCost,
      walmart_quantity: walmartQuantity,
      amazon_price: amazonPrice,
      average_price: averagePrice,
      average_tax: averageTax,
      order_number: orderNumber,
    };

    try {
      const { status } = await mutateAsync(arrivalFormData);
      if (status === 201) {
        const notificationStatus = "Submit a pending arrival form.";
        axios
          .post(`/api/v1/notifications_api/send_notification`, {
            currentUser,
            status: notificationStatus,
          })
          .then((res) => {
            console.log(res.data.acknowledged);

            if (res.data.acknowledged) {
              const notificationData = res.data?.notificationData;
              console.log("success");
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

  // const handleTest = () => {
  //   socket?.current?.emit("sendNotification", {
  //     user,
  //     status: "submit a pending arrival form."
  //   })
  // console.log("inside handle text")
  //   const status = "Submit a pending arrival form."
  //   axios.post(`/api/v1/notifications_api/send_notification`,{currentUser, status})
  //   .then(res => console.log(res.data))
  //   .catch(err => console.log(err)
  //   )
  // }
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
                      asinUpcOption && storeOption?.label
                        ? `${storeOption?.label}_${asinUpcOption.label}`
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
                    type="number"
                    placeholder="Enter unit price"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="unitPrice"
                    name="unitPrice"
                  />
                </div>

                {/* left side new input fields */}
                <div className="mt-4">
                  <label className="text-slate-500">Amazon Quantity</label>
                  <input
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Enter amazon quantity"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="amazonQuantity"
                    name="amazonQuantity"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="customerName"
                    name="customerName"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Amazon Shipping</label>
                  <input
                    onKeyDown={handlePriceKeyDown}
                    type="text"
                    placeholder="Enter amazon shipping"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="amazonShipping"
                    name="amazonShipping"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Shipping Cost</label>
                  <input
                    onKeyDown={handlePriceKeyDown}
                    type="text"
                    placeholder="Enter shipping cost"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="shippingCost"
                    name="shippingCost"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Handling Cost</label>
                  <input
                    onKeyDown={handlePriceKeyDown}
                    type="text"
                    placeholder="Enter handling cost"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="handlingCost"
                    name="handlingCost"
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
                    value={asinUpc && asinUpc[0].code_type}
                    placeholder="Code type"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="codeType"
                    name="codeType"
                  />
                </div>

                <div className="mt-4">
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

                {/* right side new input fields */}
                <div className="mt-4">
                  <label className="text-slate-500">Walmart Quantity</label>
                  <input
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Enter walmart quantity"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="walmartQuantity"
                    name="walmartQuantity"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Amazon Price</label>
                  <input
                    onKeyDown={handlePriceKeyDown}
                    type="text"
                    placeholder="Enter amazon price"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="amazonPrice"
                    name="amazonPrice"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Average Price</label>
                  <input
                    onKeyDown={handlePriceKeyDown}
                    type="text"
                    placeholder="Enter average price"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="averagePrice"
                    name="averagePrice"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Average Tax</label>
                  <input
                    onKeyDown={handlePriceKeyDown}
                    type="text"
                    placeholder="Enter average tax"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="averageTax"
                    name="averageTax"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Order Number</label>
                  <input
                    type="text"
                    placeholder="Enter order number"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="orderNumber"
                    name="orderNumber"
                  />
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
        {/* <button onClick={handleTest} className="bg-green-500 py-2 px-4 text-white">test</button> */}
      </div>
    </div>
  );
};

export default ArrivalFormPage;
