import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ToastMessage from "../Components/Shared/ToastMessage";
import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";
import handlePriceKeyDown from "../Utilities/handlePriceKeyDown";
import Select from 'react-select'
import { IoCalendarOutline } from "react-icons/io5";
import { Calendar } from "react-date-range";
import { format } from "date-fns";

const SalesForm = () => {
    const { user } = useAuth()
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedStore, setSelectedStore] = useState(null)
    const [totalStockData, setTotalStockData] = useState([])
    const [allStockData, setAllStockData] = useState([])
    const [purchaseDate, setPurchaseDate] = useState(null)
    const [openCalendar, setOpenCalendar] = useState(false)
    const calendarRef = useRef(null)

    
    let { isLoading } = useQuery({
        queryKey: ['all_stock_drop_data'],
        queryFn: async () => {
            try {
                const res = await axios.post('/api/v1/all_stock_api/get_all_stock_dropdown_data', { user })
                if (res.status === 200) {
                    setTotalStockData(res.data.data)
                    setAllStockData(res.data.data)
                    return res.data.data;
                }
                return []
            } catch (error) {
                console.log(error)
                return []
            }
        },
        refetchOnWindowFocus: false
    })
    const filterByStore = (store_id) => {
        const data = totalStockData.filter(item => item.store_id === store_id)
        setAllStockData(data)
    }

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
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef?.current?.contains(event.target)) {
                setOpenCalendar(false)
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])

    const handleSalesData = (e) => {
        e.preventDefault()
        setErrorMessage('')
        const form = e.target
        const formData = new FormData(form)
        const quantity = formData.get('quantity')
        const sourceQuantity = formData.get('sourceQuantity')
        const customerName = formData.get('customerName')
        const shippingCost = formData.get('shippingCost')
        const handlingCost = formData.get('handlingCost')
        const sellingPrice = formData.get('sellingPrice')
        const tax = formData.get('tax')
        const orderNumber = formData.get('orderNumber')

        if (!selectedProduct || !selectedStore || !purchaseDate) {
            return setErrorMessage('Please fill all required fields')
        }
        const salesData = {
            admin_id: user.admin_id,
            upin: selectedProduct.value,
            store_id: selectedStore.value,
            quantity: parseFloat(quantity),
            source_quantity: parseFloat(sourceQuantity),
            customer_name: customerName,
            shipping_cost: parseFloat(shippingCost),
            handling_cost: parseFloat(handlingCost),
            selling_price: parseFloat(sellingPrice),
            tax: parseFloat(tax),
            order_number: orderNumber,
            purchase_date: new Date(purchaseDate).toISOString()
        }
        setLoading(true)
        axios.post('/api/v1/sales_form_api/insert_sales_form', salesData)
            .then(res => {
                if (res.status === 201) {
                    form.reset()
                    Swal.fire(
                        "Submitted!",
                        "",
                        "success"
                    )
                }
                if (res.status === 204) {
                    Swal.fire(
                        "Something went wrong!",
                        "",
                        "error"
                    )
                }
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const handleKeyDown = (event) => {
        const alphabetKeys = /^[0-9\b]+$/; // regex pattern to match alphabet keys
        if (!alphabetKeys.test(event.key) && event.key != "Backspace") {
            event.preventDefault();
        }
    };

    const boxShadowStyle = {
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
    };

    return (
        <div className="py-20 mx-auto w-[60%] rounded-lg">
            <div
                style={boxShadowStyle}
                className="border border-[#8633FF] shadow-lg h-full w-full m-auto rounded-xl">
                <div className="text-center mt-10">
                    <p className="text-2xl font-bold">Sales Form</p>
                </div>
                <div className="lg:py-10 lg:px-20 w-full flex justify-center">
                    <form onSubmit={handleSalesData} className="w-[100%]" >
                        <div className="flex gap-7">
                            <div className="w-full">



                                {/* left side new input fields */}
                                <div className="mt-4">
                                    <label className="text-slate-500">Quantity</label>
                                    <input required
                                        onKeyDown={handleKeyDown}
                                        type="text"
                                        placeholder="Enter quantity"
                                        className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                        id="quantity"
                                        name="quantity"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="text-slate-500">Source Quantity</label>
                                    <input required
                                        onKeyDown={handleKeyDown}
                                        type="text"
                                        placeholder="Enter Source quantity"
                                        className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                        id="sourceQuantity"
                                        name="sourceQuantity"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">Customer Name</label>
                                    <input required
                                        type="text"
                                        placeholder="Enter customer name"
                                        className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                        id="customerName"
                                        name="customerName"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">Shipping Cost</label>
                                    <input required
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
                                    <input required onKeyDown={handlePriceKeyDown} type="text" placeholder="Enter handling cost" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="handlingCost" name="handlingCost"
                                    />
                                </div>
                                <div className="mt-4 relative">
                                    <p className="text-slate-500">Purchase Date</p>
                                    <div className="w-full mt-2 shadow-lg rounded-lg bg-white px-4 h-12 border border-[#8633FF] flex justify-between items-center">
                                        <span>{purchaseDate ? format(new Date(purchaseDate), 'yyyy/MM/dd') : 'YYYY/MM/DD'}</span>
                                        <div className="cursor-pointer" ref={calendarRef}>
                                            <span onClick={() => setOpenCalendar(!openCalendar)}><IoCalendarOutline size={18} /></span>
                                            {openCalendar && <div style={{ boxShadow: "-1px 3px 8px 0px rgba(0, 0, 0, 0.2)" }} className='absolute bg-white right-0 bottom-[48px] z-[999] border border-gray-300 shadow-lg w-fit rounded-[10px] overflow-hidden'>
                                                <Calendar
                                                    color='#8633FF'
                                                    date={purchaseDate ? purchaseDate : null}
                                                    onChange={(date) => {
                                                        setPurchaseDate(date)
                                                        setOpenCalendar(false)
                                                    }}
                                                />
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">

                                {/* right side new input fields */}
                                <div className="mt-4">
                                    <label className="text-slate-500">Select Store</label>
                                    <Select
                                        className='shadow-lg'
                                        options={allStoreData}
                                        value={selectedStore}
                                        onChange={(store) => {
                                            setSelectedStore(store)
                                            filterByStore(store.value)
                                        }}
                                        placeholder={"Select Store"}
                                        isLoading={storeLoading}

                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="text-slate-500">Select Product ( UPIN )</label>
                                    <Select
                                        className='shadow-lg'
                                        options={allStockData}
                                        value={selectedProduct}
                                        onChange={setSelectedProduct}
                                        placeholder={"Select Product"}
                                        isLoading={isLoading}
                                        key={selectedStore?.value}
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">Selling Price</label>
                                    <input required
                                        onKeyDown={handlePriceKeyDown}
                                        type="text"
                                        placeholder="Enter selling price"
                                        className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                        id="sellingPrice"
                                        name="sellingPrice"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">Tax</label>
                                    <input required
                                        onKeyDown={handlePriceKeyDown}
                                        type="text"
                                        placeholder="Enter tax"
                                        className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                        id="tax"
                                        name="tax"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">Order Number</label>
                                    <input required
                                        type="text"
                                        placeholder="Enter order number"
                                        className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                        id="orderNumber"
                                        name="orderNumber"
                                    />
                                </div>
                            </div>

                        </div>
                        <ToastMessage errorMessage={errorMessage} />
                        <div className="flex items-center justify-center mt-8">
                            <button disabled={loading} type="submit" className="bg-[#8633FF] flex gap-2 py-3 justify-center items-center text-white  rounded-lg w-full capitalize">
                                {loading && <FaSpinner size={20} className="animate-spin" />}
                                <p>Submit</p>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SalesForm;