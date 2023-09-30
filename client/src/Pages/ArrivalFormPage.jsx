const ArrivalFormPage = () => {
    const boxShadowStyle = {
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
    };

    return (
        <div className="bg-white py-20 px-32 rounded-lg">
            <div style={boxShadowStyle} className="border border-[#8633FF] shadow-lg h-fit w-full m-auto rounded-xl" >
                <div className="text-center mt-10">
                    <p className="text-2xl font-bold">Pending Arrival From</p>
                </div>
                <div className="lg:py-10 lg:px-20 p-10 w-full">
                    <form>
                        <div className="flex gap-7">
                            <div className="w-full">
                                <div>
                                    <label className="text-slate-500">Date</label>
                                    <input type="date" placeholder="Enter store name" className="input input-bordered input-primary w-full mt-2" id="fromDate" name="fromDate" />
                                </div>

                                <div className="mt-4">
                                    <label className="text-slate-500">ASIN/UPAC</label>
                                    <input type="text" placeholder="Enter ASIN/UPAC" className="input input-bordered input-primary w-full mt-2" id="fromDate" name="fromDate" />
                                </div>

                                <div className="mt-2">
                                    <label className="text-slate-500">Store type*</label>
                                    <select className="select select-primary w-full mt-2" name="country" id="country">
                                        <option disabled selected>Pick Store Type</option>
                                        <option value="Amazon">Amazon</option>
                                        <option value="Daraz">Daraz</option>
                                        <option value="Alibaba">Alibaba</option>
                                    </select>
                                </div>
                            </div>
                            <div className="w-full">
                                <div>
                                    <label className="text-slate-500">Store name*</label>
                                    <select className="select select-primary w-full mt-2" name="storeName" id="storeName">
                                        <option disabled selected>Pick Store Type</option>
                                        <option value="Amazon">Amazon</option>
                                        <option value="Daraz">Daraz</option>
                                        <option value="Alibaba">Alibaba</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center mt-8">
                            <button className="btn btn-primary text-white w-72 capitalize">Pending Arrival Request</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArrivalFormPage;