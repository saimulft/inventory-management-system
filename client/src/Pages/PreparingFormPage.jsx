const PreparingFormPage = () => {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };

  const handleKeyDown = (event) => {
    const alphabetKeys = /^[0-9\b]+$/; // regex pattern to match alphabet keys
    if (!alphabetKeys.test(event.key) && event.key != "Backspace") {
      event.preventDefault();
    }
  };

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
          <form>
            <div className="flex gap-7">
              <div className="w-full">
                <div>
                  <label className="text-slate-500">Date</label>
                  <input
                    type="date"
                    placeholder="Enter store name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="fromDate"
                    name="fromDate"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">ASIN/UPAC</label>
                  <input
                    type="text"
                    placeholder="Enter ASIN/UPAC"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="code"
                    name="code"
                  />
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
                  <label className="text-slate-500">Order ID</label>
                  <input
                    type="text"
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
                    name="CodeType"
                    id="CodeType"
                  >
                    <option disabled selected>
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
                      className="flex justify-between items-center px-4 w-max h-fit border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 shadow-lg"
                    >
                      <div className="flex items-center gap-8 py-[6.5px]">
                        <svg
                          className="w-6 h-6 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-700 dark:text-gray-400 font-semibold">
                            Select a file or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG or PDF, file size no more than 10MB
                          </p>
                        </div>
                      </div>
                      <input
                        id="invoice-dropzone"
                        name="invoice-dropzone"
                        type="file"
                        className="hidden"
                      />
                      <div className="ml-5">
                        <button
                          onClick={() => {
                            document.getElementById("invoice-dropzone").click();
                          }}
                          type="button"
                          className="btn btn-outline btn-primary btn-xs"
                        >
                          select file
                        </button>
                      </div>
                    </label>
                  </div>
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
                    <option disabled selected>
                      Pick Store Name
                    </option>
                    <option value="Amazon">Amazon</option>
                    <option value="Daraz">Daraz</option>
                    <option value="Alibaba">Alibaba</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="text-slate-500">Code type</label>
                  <select
                    className="select select-primary w-full mt-2 shadow-lg"
                    name="CodeType"
                    id="CodeType"
                  >
                    <option disabled selected>
                      Pick Code Type
                    </option>
                    <option value="ASIN">ASIN</option>
                    <option value="UPC">UPC</option>
                  </select>
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
                  <label className="text-slate-500">Shipping Label</label>
                  <div className="flex items-center w-full mt-2">
                    <label
                      htmlFor="shippingLabel-dropzone"
                      className="flex justify-between items-center px-4 w-full h-fit border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 shadow-lg"
                    >
                      <div className="flex items-center gap-5 py-[6.5px]">
                        <svg
                          className="w-6 h-6 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-700 dark:text-gray-400 font-semibold">
                            Select a file or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG or PDF, file size no more than 10MB
                          </p>
                        </div>
                      </div>
                      <input
                        id="shippingLabel-dropzone"
                        name="shippingLabel-dropzone"
                        type="file"
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
                          className="btn btn-outline btn-primary btn-xs"
                        >
                          select file
                        </button>
                      </div>
                    </label>
                  </div>
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
              </div>
            </div>

            <div className="flex items-center justify-center mt-8">
              <button className="bg-[#4a07da] flex py-3 justify-center items-center text-white capitalize rounded-lg w-72 ">
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