import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import SearchDropdown from "../Utilities/SearchDropdown";
import { useState } from "react";
import ToastMessage from "../Components/Shared/ToastMessage";
import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";
import handlePriceKeyDown from "../Utilities/handlePriceKeyDown";


const SalesForm = () => {
    const { user } = useAuth()
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const { data: allStockData = [], isLoading } = useQuery({
        queryKey: ['all_stock_drop_data'],
        queryFn: async () => {
            try {
                const res = await axios.post('/api/v1/all_stock_api/get_all_stock_dropdown_data', { user })
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

    const handleSalesData = (e) => {
        e.preventDefault()
        setErrorMessage('')
        const form = e.target

        const amazon_quantity = form.amazonQuantity.value
        const walmart_quantity = form.walmartQuantity.value
        const customer_name = form.customerName.value
        const amazon_shipping = form.amazonShipping.value
        const shipping_cost = form.shippingCost.value
        const handling_cost = form.handlingCost.value
        const amazon_price = form.amazonPrice.value
        const average_price = form.averagePrice.value
        const average_tax = form.averageTax.value
        const order_number = form.orderNumber.value
        const upin = selectedProduct?.value

        if (!selectedProduct) {
            return setErrorMessage("Product is missing")
        }
        const salesData = { admin_id: user.admin_id, upin, amazon_quantity, walmart_quantity, customer_name, amazon_price, shipping_cost, amazon_shipping, handling_cost, average_price, average_tax, order_number }
        setLoading(true)
        axios.put('/api/v1/sales_form_api/update_stock_product', salesData)
            .then(res => {
                if (res.status === 200) {
                    form.reset()
                    Swal.fire(
                        "Updated",
                        "",
                        "success"
                    )
                }
                if (res.status === 204) {
                    Swal.fire(
                        "Data is up to date",
                        "",
                        "warning"
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
                                    <label className="text-slate-500">Amazon Quantity</label>
                                    <input required
                                        onKeyDown={handleKeyDown}
                                        type="text"
                                        placeholder="Enter amazon quantity"
                                        className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                        id="amazonQuantity"
                                        name="amazonQuantity"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="text-slate-500">Walmart Quantity</label>
                                    <input required
                                        onKeyDown={handleKeyDown}
                                        type="text"
                                        placeholder="Enter amazon quantity"
                                        className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                        id="walmartQuantity"
                                        name="walmartQuantity"
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
                                    <label className="text-slate-500">Amazon Shipping</label>
                                    <input required
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
                                    <input required
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

                                {/* right side new input fields */}
                                <div className="mt-4">
                                    <label className="text-slate-500">Select Product</label>
                                    <SearchDropdown isLoading={isLoading} option={selectedProduct} placeholder="Select Product" optionData={allStockData} setOption={setSelectedProduct} />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">Amazon Price</label>
                                    <input required
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
                                    <input required
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
                                    <input required
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