import { useContext, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { MdErrorOutline } from "react-icons/md";
import Compressor from "compressorjs";
import useGlobal from "../hooks/useGlobal";
import { GlobalContext } from "../Providers/GlobalProviders";
import { NotificationContext } from "../Providers/NotificationProvider";
import handlePriceKeyDown from "../Utilities/handlePriceKeyDown";

const AddASINForm = () => {
  const { socket } = useContext(GlobalContext);
  const { currentUser } = useContext(NotificationContext);
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };
  const [photoUploadType, setPhotoUploadType] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [loading, setLoding] = useState(false);
  const [inputError, setInputError] = useState("");

  const { user } = useAuth();
  const { setCountsRefetch } = useGlobal();

  // handler function for adding ASIN or UPC
  const handleAsinUpcForm = async (event) => {
    setImageError("");
    setInputError("");
    event.preventDefault();
    const form = event.target;
    const date = new Date().toISOString();
    const asinUpc = form.upin.value;
    const storeManagerName = form.storeManagerName.value;
    const productName = form.productName.value;
    const minPrice = form.minPrice.value;
    const codeType = form.codeType.value;
    const url = form?.inputImageUrl?.value;

    if (url) {
      try {
        setLoding(true);
        const asinInfo = {
          adminId: user?.admin_id,
          creatorEmail: user?.email,
          date,
          asinUpc,
          storeManagerName,
          productName,
          productImage: url,
          minPrice,
          codeType,
        };
        axios
          .post("/api/v1/asin_upc_api/insert_asin_upc", asinInfo)
          .then((res) => {
            if (res.status === 201) {
              const notification_link = "/dashboard/management/store/total-asin";
              const notification_search = [res?.data?.result?.insertedId];
              const status = "Submit a ASIN/UPC form.";
              axios
                .post(`/api/v1/notifications_api/send_notification`, {
                  currentUser,
                  status,
                  notification_link,
                  notification_search
                })
                .then((res) => {
                  if (res.data?.finalResult?.acknowledged) {
                    // send real time notification data
                    const notificationData = res.data?.notificationData;
                    if (notificationData) {
                      socket?.current?.emit("sendNotification", {
                        user,
                        notificationData,
                      });
                    }
                  }
                })
                .catch((err) => console.log(err));

              setCountsRefetch(true);
              setImageSrc(null);
              setImageFile(null);
              form.reset();
              setLoding(false);
              setInputError("");
              Swal.fire("Added", "ASIN or UPC has been added.", "success");
            }
          })
          .catch((err) => {
            setLoding(false);
            console.log(err);
          });
      } catch (error) {
        setLoding(false);
        console.log(error);
      }
    }

    if (photoUploadType === "Select Upload Option" || !photoUploadType) {
      setInputError("Select image option");
      setLoding(false);
      return;
    }
    if (photoUploadType === "file" && !imageFile) {
      setInputError("Select image");
      setLoding(false);
      return;
    }

    if (codeType === "Pick Code Type" || !codeType) {
      setInputError("Select code type");
      setLoding(false);
      return;
    }

    if (
      !date ||
      !asinUpc ||
      !storeManagerName ||
      !productName ||
      !minPrice ||
      !codeType
    ) {
      setLoding(false);
      return;
    }

    if (imageFile) {
      setLoding(true);
      const formData = new FormData();
      await new Promise((resolve, reject) => {
        new Compressor(imageFile, {
          quality: 0.5,
          success: (result) => {
            const compressed = new File([result], result.name, {
              type: "image/jpeg",
            });
            formData.append("file", compressed);
            resolve(compressed);
          },
          error: (error) => {
            reject(error);
          },
        });
      });

      await axios
        .post("/api/v1/asin_upc_api/asin_upc_image_upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 201) {
            const productImage = res.data.imageURL;
            const asinInfo = {
              adminId: user?.admin_id,
              creatorEmail: user?.email,
              date,
              asinUpc,
              storeManagerName,
              productName,
              productImage,
              minPrice,
              codeType,
            };
            axios
              .post("/api/v1/asin_upc_api/insert_asin_upc", asinInfo)
              .then((res) => {
                if (res.status === 201) {
                  const notification_link = "/dashboard/management/store/total-asin";
                  const notification_search = [res?.data?.result?.insertedId];
                  const status = "Submit a ASIN/UPC form.";
                  axios
                    .post(`/api/v1/notifications_api/send_notification`, {
                      currentUser,
                      status,
                      notification_link,
                      notification_search
                    })
                    .then((res) => {
                      if (res.data?.finalResult?.acknowledged) {
                        // send real time notification data
                        const notificationData = res.data?.notificationData;
                        if (notificationData) {
                          socket?.current?.emit("sendNotification", {
                            user,
                            notificationData,
                          });
                        }
                      }
                    })
                    .catch((err) => console.log(err));

                  setCountsRefetch(true);
                  form.reset();
                  setImageSrc(null);
                  setImageFile(null);
                  setInputError("");
                  setLoding(false);
                  Swal.fire("Added", "ASIN or UPC has been added.", "success");
                }
              })
              .catch(() => {
                setLoding(false);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setLoding(false);
        });
    }
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (e.target.files[0].size > maxSizeInBytes) {
        setImageError("Image file size must be less than 5 MB");
        return;
      } else {
        setImageError("");
        setImageSrc(URL.createObjectURL(e.target.files[0]));
        setImageFile(e.target.files[0]);
      }
    }
  };

  return (
    <div className="my-20 rounded-lg mx-auto w-[60%] h-full">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] shadow-lg  m-auto rounded-xl"
      >
        <div className="text-center mt-10">
          <p className="text-2xl font-bold">Add ASIN or UPC</p>
        </div>
        <div className="px-20 py-10 w-full">
          <form className="w-full" onSubmit={handleAsinUpcForm}>
            <div className="flex gap-7">
              <div className="w-full">
                <div>
                  <label className="text-slate-500">Code type</label>
                  <select
                    className="select select-primary w-full mt-2 shadow-lg"
                    name="codeType"
                    id="codeType"
                  >
                    <option defaultValue="Pick Code Type">
                      Pick Code Type{" "}
                    </option>
                    <option value="ASIN">ASIN</option>
                    <option value="UPC">UPC</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-slate-500">Store Manager Name</label>
                  <input
                    required
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
                    disabled={imageSrc}
                    onChange={(e) => {
                      setPhotoUploadType(e.target.value);
                    }}
                    className="select select-primary w-full mt-2 shadow-lg"
                  >
                    <option defaultValue="Select Upload Option">
                      {" "}
                      Select Upload Option{" "}
                    </option>
                    <option value="url"> Image URL</option>
                    <option value="file">Upload image</option>
                  </select>
                </div>
              </div>

              <div className="w-full">
                <div>
                  <label className="text-slate-500">ASIN or UPC Code</label>
                  <input
                    required
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
                    required
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
                    onKeyDown={handlePriceKeyDown}
                    required
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
                <label className="text-slate-500">Image URL</label>
                <input
                  required
                  type="url"
                  placeholder="Enter your image URL link"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="inputImageUrl"
                  name="inputImageUrl"
                />
                {imageError && (
                  <p className="text-xs mt-2 font-medium text-rose-500">
                    {imageError}
                  </p>
                )}
              </div>
            )}

            {photoUploadType == "file" && (
              <div className="mt-4">
                <label className="text-slate-500">Add Photo</label>
                <div className="flex items-center w-full mt-2">
                  <label
                    htmlFor="invoice-dropzone"
                    className="flex justify-between items-center px-5 w-full h-[70px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100 shadow-lg"
                  >
                    <div className="flex items-center gap-5 py-[6.5px]">
                      {imageSrc ? (
                        <img src={imageSrc} className="h-8" alt="" />
                      ) : (
                        <AiOutlineCloudUpload size={26} />
                      )}
                      <div>
                        {imageFile && (
                          <p className="text-md font-semibold">
                            {imageFile.name.slice(0, 32)}
                          </p>
                        )}
                        {!imageFile && (
                          <p className="text-xs text-gray-700 dark:text-gray-400 font-semibold">
                            Select a file or drag and drop
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG or JPG file size no more than 5MB
                        </p>
                      </div>
                    </div>
                    <input
                      id="invoice-dropzone"
                      name="invoice-dropzone"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImage}
                    />
                    <div>
                      {imageSrc && (
                        <button
                          onClick={() => {
                            setImageSrc(null);
                            setImageFile(null);
                          }}
                          className="btn btn-outline btn-primary btn-xs mx-2"
                        >
                          Cancel image
                        </button>
                      )}
                      <button
                        onClick={() => {
                          document.getElementById("invoice-dropzone").click();
                        }}
                        type="button"
                        className="btn btn-outline btn-primary btn-xs"
                      >
                        Select image
                      </button>
                    </div>
                  </label>
                </div>
                {imageError && (
                  <p className="text-xs mt-2 font-medium text-rose-500">
                    {imageError}
                  </p>
                )}
              </div>
            )}

            <div>
              {inputError && (
                <p className="w-[100%] flex gap-1 items-center justify-center text-center mt-5 text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded">
                  <MdErrorOutline size={20} /> {inputError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center mt-8">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#8633FF] flex gap-2 py-3 justify-center items-center text-white rounded-lg w-full"
              >
                {loading && <FaSpinner size={20} className="animate-spin" />}
                Add ASIN/UPC
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddASINForm;
