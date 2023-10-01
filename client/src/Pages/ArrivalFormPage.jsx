const ArrivalFormPage = () => {
    const boxShadowStyle = {
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
    };

    const handleKeyDown = (event) => {
        const alphabetKeys = /^[0-9\b]+$/; // regex pattern to match alphabet keys
        if (!alphabetKeys.test(event.key) && event.key != 'Backspace') {
            event.preventDefault();
        }
    }

    return (
        <div className="bg-white py-20 rounded-lg w-full">
            <div style={boxShadowStyle} className="border border-[#8633FF] shadow-lg h-fit w-fit m-auto rounded-xl" >
                <div className="text-center mt-10">
                    <p className="text-2xl font-bold">Pending Arrival From</p>
                </div>
                <div className="lg:py-10 lg:px-20 w-full flex justify-center">
                    <form>
                        <div className="flex gap-7">
                            <div className="w-full">
                                <div>
                                    <label className="text-slate-500">Date</label>
                                    <input type="date" placeholder="Enter store name" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="fromDate" name="fromDate" />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">ASIN/UPAC</label>
                                    <input type="text" placeholder="Enter ASIN/UPAC" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="code" name="code" />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">Supplier ID</label>
                                    <input type="text" placeholder="Enter supplier order number" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="supplierId" name="supplierId" />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">UPIN</label>
                                    <input type="text" placeholder="Enter UPIN" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="upin" name="upin" />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">Unit Price</label>
                                    <input type="text" placeholder="Enter unit price" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="unitPrice" name="unitPrice" />
                                </div>

                            </div>

                            <div className="w-full">
                                <div>
                                    <label className="text-slate-500">Store name*</label>
                                    <select className="select select-primary w-full mt-2 shadow-lg" name="storeName" id="storeName">
                                        <option disabled selected>Pick Store Name</option>
                                        <option value="Amazon">Amazon</option>
                                        <option value="Daraz">Daraz</option>
                                        <option value="Alibaba">Alibaba</option>
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <label className="text-slate-500">Code type</label>
                                    <select className="select select-primary w-full mt-2 shadow-lg" name="CodeType" id="CodeType">
                                        <option disabled selected>Pick Code Type</option>
                                        <option value="ASIN">ASIN</option>
                                        <option value="UPC">UPC</option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">Product Name</label>
                                    <input type="text" placeholder="Enter product name" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="productName" name="productName" />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">Quantity</label>
                                    <input onKeyDown={handleKeyDown} type="text" placeholder="Enter quantity" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="quantity" name="quantity" />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">EDA</label>
                                    <input type="date" placeholder="Enter store name" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="eda" name="eda" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-slate-500">Warehouse</label>
                            <select className="select select-primary w-full mt-2 shadow-lg" name="warehouse" id="warehouse">
                                <option disabled selected>Select Warehouse</option>
                                <option value="test1">Test1</option>
                                <option value="test2">Test2</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-center mt-8">
                            <button className="bg-[#4a07da] flex py-3 justify-center items-center text-white capitalize rounded-lg w-72 capitalize">Pending Arrival Request</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArrivalFormPage;