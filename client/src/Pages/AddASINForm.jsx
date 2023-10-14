import { useState } from "react";
import { AiOutlineCloudUpload } from 'react-icons/ai';

const AddASINForm = () => {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };
  const [photoUploadType, setPhotoUploadType] = useState(null);
  const [imageSrc, setImageSrc] = useState()
  const [imageFile, setImageFile] = useState()
  const [imageError, setImageError] = useState('')

  // handler function for adding ASIN or UPC
  const handleAdd = (event) => {
    event.preventDefault()

    const form = event.target;
    const date = form.date.value;
    const upin = form.upin.value;
    const storeManagerName = form.storeManagerName.value;
    const productName = form.productName.value;
    const productImage = photoUploadType == "url" ? form?.imageUrl.value : imageSrc;
    const minPrice = form.minPrice.value;
    const codeType = form.codeType.value;

    const asinInfo = { date, upin, storeManagerName, productName, productImage, minPrice, codeType }
    console.log(asinInfo)
  }

  const handleImage = (e) => {
    if (e.target.files[0]) {
      const maxSizeInBytes = 1 * 1024 * 1024; // 2MB
      if (e.target.files[0].size > maxSizeInBytes) {
        setImageError("Image file size must be less than 10 MB")
      } else {
        setImageError('')
        setImageFile(e.target.files[0])
        setImageSrc(URL.createObjectURL(e.target.files[0]))
      }
    }
  }

  return (
    <div className="mt-20 rounded-lg h-screen">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] shadow-lg  w-fit m-auto rounded-xl"
      >
        <div className="text-center mt-10">
          <p className="text-2xl font-bold">Add ASIN or UPC</p>
        </div>
        <div className="px-20 py-10 w-full">
          <form onSubmit={handleAdd}>
            <div className="flex gap-7">
              <div className="w-full">
                <div>
                  <label className="text-slate-500">Date</label>
                  <input
                    type="date"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="date"
                    name="date"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Store Manager Name</label>
                  <input
                    type="text"
                    placeholder="Enter your store manager name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="storeManagerName"
                    name="storeManagerName"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Product Image</label>
                  <select
                    onChange={(e) => {
                      setPhotoUploadType(e.target.value);
                    }}
                    className="select select-primary w-full mt-2 shadow-lg"
                  >
                    <option disabled selected>
                      Select Upload Option
                    </option>
                    <option value="url">Add URL</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>
              </div>

              <div className="w-full">
                <div>
                  <label className="text-slate-500">ASIN or UPIN Code</label>
                  <input
                    type="text"
                    placeholder="Enter ASIN or UPIN"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="upin"
                    name="upin"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Product Name</label>
                  <input
                    type="text"
                    placeholder="Enter your product name"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="productName"
                    name="productName"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Min Price</label>
                  <input
                    type="text"
                    placeholder="Enter min price"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="minPrice"
                    name="minPrice"
                  />
                </div>
              </div>
            </div>

            {photoUploadType == "url" && (
              <div className="mt-4">
                <label className="text-slate-500">Add Photo</label>
                <input
                  type="text"
                  placeholder="Enter your photo link"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="imageUrl"
                  name="imageUrl"
                />
              </div>
            )}

            {photoUploadType == "file" && (
              <div className="mt-4">
                <label className="text-slate-500">Add Photo</label>
                <div className="flex items-center w-full mt-2">
                  <label
                    htmlFor="invoice-dropzone"
                    className="flex justify-between items-center px-5 w-full h-fit border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 shadow-lg"
                  >
                    <div className="flex items-center gap-5 py-[6.5px]">
                      {imageSrc ? <img src={imageSrc} className="h-8" alt="" /> :
                        <AiOutlineCloudUpload size={26} />}
                      <div>
                        <p className="text-xs text-gray-700 dark:text-gray-400 font-semibold">
                          Select a file or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG or JPG file size no more than 10MB
                        </p>
                      </div>
                    </div>
                    <input
                      id="invoice-dropzone"
                      name="invoice-dropzone"
                      type="file"
                      className="hidden"
                      accept='image/*'
                      onChange={handleImage}
                    />
                    <div>
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
                {imageError && <p className="text-xs mt-2 font-medium text-rose-500">{imageError}</p>}
              </div>
            )}

            <div className="mt-4">
              <label className="text-slate-500">Code type</label>
              <select
                className="select select-primary w-full mt-2 shadow-lg"
                name="codeType"
                id="codeType"
              >
                <option disabled selected>
                  Pick Code Type
                </option>
                <option value="ASIN">ASIN</option>
                <option value="UPC">UPC</option>
              </select>
            </div>

            <div className="flex items-center justify-center mt-8"></div>
            <div className="flex items-center justify-center mt-8">
              <button className="bg-[#8633FF] flex py-3 justify-center items-center text-white capitalize rounded-lg w-72 ">
                Preparing Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddASINForm;
