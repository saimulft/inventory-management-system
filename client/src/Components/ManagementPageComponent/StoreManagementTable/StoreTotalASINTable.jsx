import axios from "axios";
import { format } from "date-fns";
import { useContext, useState } from "react";
import { AiOutlineCloudUpload, AiOutlineSearch } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import { LiaGreaterThanSolid } from "react-icons/lia";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import FileDownload from "../../Shared/FileDownload";
import Swal from "sweetalert2";
import Compressor from "compressorjs";
import { FaSpinner } from "react-icons/fa";
import ToastMessage from "../../Shared/ToastMessage";
import { GlobalContext } from "../../../Providers/GlobalProviders";
import Loading from "../../Shared/Loading";


export default function InventoryTotalASINTable() {
  const [photoUploadType, setPhotoUploadType] = useState(null);
  const [imageSrc, setImageSrc] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState('')
  const [singleData, setSingleData] = useState()
  const [loading, setLoding] = useState(false)
  const [success, setSuccess] = useState()
  const { user } = useAuth()
  const { isSidebarOpen } = useContext(GlobalContext);
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";
  const [filterDays, setFilterDays] = useState('')
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const { data = [], refetch, isLoading } = useQuery({
    queryKey: ['get_all_asin_upc'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/asin_upc_api/get_all_asin_upc?id=${user.admin_id}`)
        if (res.status === 200) {

          return res.data.data;
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    }
  })

  const handleSearch = () => {
    setSearchError("")
    const filteredData = data.filter(item =>
    (item.asin_upc_code?.toLowerCase().includes(searchText) ||
      item.product_name?.toLowerCase().includes(searchText) ||
      item.code_type?.toLowerCase().includes(searchText))
    );
    if (!filteredData.length) {

      console.log("no data found")
      setSearchError("No data found")
      return
    }
    setSearchResults(filteredData)
  }
  const handleDelete = (id, product_image) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8633FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/v1/asin_upc_api/delete_asin_upc?id=${id}&product_image=${product_image}`,)
          .then(res => {
            if (res.status === 200) {
              Swal.fire(
                'Deleted!',
                'Data has been deleted.',
                'success'
              )
              refetch()
            }
          }).catch(err => console.log(err))
      }
    })
  }

  const handleAsinUpcUpdate = async (event) => {
    event.preventDefault()
    setImageError("")
    const form = event.target;
    const minPrice = form.minPrice.value
    const inputUrl = form.inputImageUrl?.value
    async function checkImageUrlValidity(url) {
      try {
        setLoding(true)
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.startsWith('image/')) {
            const asinInfo = {
              productImage: url, minPrice
            }
            axios.put(`/api/v1/asin_upc_api/update_asin_upc?id=${singleData._id}`, asinInfo)
              .then(res => {
                if (res.status === 200) {
                  setImageSrc(null)
                  setImageFile(null)
                  form.reset()
                  setLoding(false)
                  refetch()
                  setSuccess("Updated")
                  setTimeout(() => {
                    setSuccess("")
                  }, 2000);
                }
              })
              .catch(() => {
                setLoding(false)
              })
            return; // It's a valid image URL
          }
        }
        setImageError("Image url is not valid")
        setLoding(false)
        return
      } catch (error) {
        setLoding(false)
        setImageError("Image url is not valid")
      }
    }
    if (form?.inputImageUrl?.value) {

      checkImageUrlValidity(form?.inputImageUrl.value)
    }
    if (imageFile) {
      setLoding(true)
      const formData = new FormData()
      await new Promise((resolve, reject) => {
        new Compressor(imageFile, {
          quality: 0.5,
          success: (result) => {
            const compressed = new File([result], result.name, { type: 'image/jpeg' });
            formData.append('file', compressed);
            resolve(compressed);
          },
          error: (error) => {
            reject(error);
          },
        });
      });

      await axios.post('/api/v1/asin_upc_api/asin_upc_image_upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(res => {
          if (res.status === 201) {
            const productImage = res.data.imageURL;
            const asinInfo = {
              productImage: productImage, minPrice
            }
            console.log(asinInfo)
            axios.put(`/api/v1/asin_upc_api/update_asin_upc?id=${singleData._id}`, asinInfo)

              .then(res => {
                if (res.status === 200) {
                  form.reset()
                  setImageSrc(null)
                  setImageFile(null)
                  refetch()
                  setLoding(false)
                  setSuccess("Updated")
                  setTimeout(() => {
                    setSuccess("")
                  }, 2000);
                }
              })
              .catch(() => {
                setLoding(false)
              })
          }
        })
        .catch(() => {
          setLoding(false)
        })
    }

    if (!imageFile && !inputUrl && minPrice) {
      const asinInfo = {
        minPrice
      }
      setLoding(true)
      axios.put(`/api/v1/asin_upc_api/update_asin_upc?id=${singleData._id}`, asinInfo)
        .then(res => {
          if (res.status === 200) {
            setImageSrc(null)
            setImageFile(null)
            form.reset()
            setLoding(false)
            refetch()
            setSuccess("Updated")
            setTimeout(() => {
              setSuccess("")
            }, 2000);
          }
        })
        .catch(() => {
          setLoding(false)
        })

    }
  }

  const handleImage = (e) => {
    if (e.target.files[0]) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (e.target.files[0].size > maxSizeInBytes) {
        setImageError("Image file size must be less than 5 MB")
        return;

      } else {
        setImageError('')
        setImageSrc(URL.createObjectURL(e.target.files[0]))
        setImageFile(e.target.files[0])
      }
    }
  }
  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">
        Total ASIN/UPC: {data?.length}
      </h3>

      <div className="relative flex justify-between items-center mt-4">
        <div>
          <div className="flex gap-4 text-sm items-center">
            <p onClick={() => setFilterDays('today')} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 'today' && 'bg-[#8633FF] text-white'}`}>
              Today
            </p>
            <p onClick={() => setFilterDays(7)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 7 && 'bg-[#8633FF] text-white'}`}>
              7 Days
            </p>
            <p onClick={() => setFilterDays(15)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 15 && 'bg-[#8633FF] text-white'}`}>
              15 Days
            </p>
            <p onClick={() => setFilterDays(1)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 1 && 'bg-[#8633FF] text-white'}`}>
              1 Month
            </p>
            <p onClick={() => setFilterDays('year')} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 'year' && 'bg-[#8633FF] text-white'}`}>
              Year
            </p>
            <p onClick={() => setFilterDays('custom')} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 'custom' && 'bg-[#8633FF] text-white'}`}>
              Custom
            </p>
          </div>
        </div>

        <div className="w-1/4  flex items-center justify-between">
          <input
            className="border bg-white shadow-md border-[#8633FF] outline-none w-[60%]   py-2 rounded-md px-2 text-sm"
            placeholder="Search Here"
            value={searchText}
            type="text"
            onChange={(e) => setSearchText(e.target.value.toLocaleLowerCase())}
          />
          <div className="w-[40%] flex items-center justify-evenly">
            <button onClick={handleSearch} className="py-[6px] px-4 bg-[#8633FF] text-white rounded">
              <AiOutlineSearch size={24} />
            </button>
            <button onClick={() => {
              setSearchResults([])
              setSearchText("")
              setSearchError("")
            }} className="py-[6px] px-4 bg-[#8633FF] text-white rounded">
              Clear
            </button>

          </div>
        </div>
      </div>

      <div className="overflow-x-auto  mt-8 min-h-[calc(100vh-288px)] max-h-full">
        <table className="table table-sm">
          <thead>
            <tr className="bg-gray-200">
              <th>Date</th>
              <th>ASIN/UPC</th>
              <th>Product Name</th>
              <th>Min Price</th>
              <th>Code Type</th>
              <th>Store Manager</th>
              <th>Product Image</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="relative">
            {searchError ? searchError : <>
              {
                searchResults.length ? searchResults.map((d, index) => {
                  return (
                    <tr
                      className={`${index % 2 == 1 && "bg-gray-200"}`} key={index} >
                      <th>{d.date && format(new Date(d.date), "y/MM/d")}</th>
                      <td>{d.asin_upc_code}</td>
                      <td className="text-[#8633FF]">{d.product_name}</td>
                      <td>{d.min_price}</td>
                      <td>{d.code_type}</td>
                      <td>{d.store_manager_name}</td>
                      <td>{d.product_image && <FileDownload fileName={d.product_image} />}</td>
                      <td><div className="dropdown dropdown-end">
                        <label
                          tabIndex={0}
                        >
                          <BiDotsVerticalRounded onClick={() => setSingleData(d)} cursor="pointer" />

                        </label>
                        <ul
                          tabIndex={0}
                          className="mt-3 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black"
                        >

                          <li>
                            <button onClick={() => {
                              document.getElementById("my_modal_2").showModal()

                            }
                            }>Edit</button>
                          </li>
                          <li>
                            <button onClick={() => handleDelete(d._id, d.product_image)}>Delete</button>
                          </li>
                        </ul>
                      </div></td>
                    </tr>
                  )
                })

                  :

                  isLoading ? <Loading /> : data?.map((d, index) => {
                    return (
                      <tr
                        className={`${index % 2 == 1 && "bg-gray-200"}`} key={index} >
                        <th>{d.date && format(new Date(d.date), "y/MM/d")}</th>
                        <td>{d.asin_upc_code}</td>
                        <td className="text-[#8633FF]">{d.product_name}</td>
                        <td>{d.min_price}</td>
                        <td>{d.code_type}</td>
                        <td>{d.store_manager_name}</td>
                        <td>{d.product_image && <FileDownload fileName={d.product_image} />}</td>
                        <td><div className="dropdown dropdown-end">
                          <label
                            tabIndex={0}
                          >
                            <BiDotsVerticalRounded onClick={() => setSingleData(d)} cursor="pointer" />

                          </label>
                          <ul
                            tabIndex={0}
                            className="mt-3 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black"
                          >

                            <li>
                              <button onClick={() => {
                                document.getElementById("my_modal_2").showModal()

                              }
                              }>Edit</button>
                            </li>
                            <li>
                              <button onClick={() => handleDelete(d._id, d.product_image)}>Delete</button>
                            </li>
                          </ul>
                        </div></td>
                      </tr>
                    );
                  })
              }
            </>}
          </tbody>
        </table>

        {/* pagination */}
        {!isLoading &&
          <div className="flex justify-between mt-4">
            <p>Showing 1 to 20 of 2,000 entries</p>
            <div className="flex items-center gap-2">
              <div className="rotate-180 border px-[2px] py-[3px] border-gray-400">
                <LiaGreaterThanSolid size={13} />
              </div>
              <div className="border px-1 py-[2px]  border-gray-400 text-xs">
                1
              </div>
              <div className="border px-1 py-[2px]  border-gray-400 text-xs">
                2
              </div>
              <div className="border px-1 py-[2px]  border-gray-400 text-xs">
                ...
              </div>
              <div className="border px-1 py-[2px]  border-gray-400 text-xs">
                9
              </div>
              <div className="border px-1 py-[2px]  border-gray-400 text-xs">
                10
              </div>
              <div className="border px-[2px] py-[3px] border-gray-400">
                <LiaGreaterThanSolid size={13} />
              </div>
            </div>
          </div>
        }
      </div>

      {/* modal content  */}
      <dialog id="my_modal_2" className="modal">
        <div style={{ marginLeft, maxWidth: '750px' }} className="modal-box">
          <div className="flex">
            <div className="w-1/2">
              <div className="flex items-center mb-4 gap-2">
                <BiSolidEdit size={24} />
                <h3 className="text-2xl font-medium">Details</h3>
              </div>
              {/* <p className="mt-2">
                <span className="font-medium">Data : </span>
                <span>{singleData?.date && format(new Date(singleData.date), "y/MM/d")}</span>
              </p> */}

              <p className="mt-2">
                <span className="font-medium">Product Name : </span>
                <span>{singleData?.product_name}</span>
              </p>
              {/* <p className="mt-2">
                <span className="font-medium">ASIN : </span>
                <span>{singleData?.asin_upc_code}</span>
              </p> */}
              <p className="mt-2">
                <span className="font-medium">Store Manager: </span>
                <span>{singleData?.store_manager_name}</span>
              </p>

              <p className="mt-2">
                <span className="font-medium">Old Min Price : </span>
                <span>${singleData?.min_price}</span>
              </p>
            </div>
            <div className="w-1/2 px-4">
              <h3 className="text-2xl font-medium">Update</h3>
              <form onSubmit={handleAsinUpcUpdate}>
                <div className="flex flex-col mt-4">
                  <label className="text-slate-500">New Min Price</label>
                  <input
                    type="number"
                    placeholder="Enter new min price"
                    className="input input-bordered input-primary w-full input-sm mt-2"
                    id="minPrice"
                    name="minPrice"
                  />
                </div>

                <div className="mt-4">
                  <div className="mt-4">
                    <label className="text-slate-500">Product Image</label>
                    <select disabled={imageSrc}
                      onChange={(e) => {
                        setPhotoUploadType(e.target.value);
                      }}
                      className="select select-primary w-full mt-2 shadow-lg"
                    >
                      <option defaultValue="Select Upload Option"> Select Upload Option </option>
                      <option value="url"> Image URL</option>
                      <option value="file">Upload image</option>
                    </select>
                  </div>

                  {photoUploadType == "url" && (
                    <div className="mt-4">
                      <label className="text-slate-500">Image URL</label>
                      <input required
                        type="text"
                        placeholder="Enter your image URL link"
                        className="input input-bordered input-primary w-full mt-2 shadow-lg"
                        id="inputImageUrl"
                        name="inputImageUrl"
                      />
                      {imageError && <p className="text-xs mt-2 font-medium text-rose-500">{imageError}</p>}
                    </div>

                  )}

                  {photoUploadType == "file" && (
                    <div className="mt-4">
                      <label className="text-slate-500">Add Photo</label>
                      <div className="flex items-center w-full mt-2">
                        <label
                          htmlFor="invoice-dropzone"
                          className="flex justify-between items-center px-5 w-full h-[70px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 shadow-lg"
                        >
                          <div className="flex items-center gap-5 py-[6.5px]">
                            {imageSrc ? <img src={imageSrc} className="h-8" alt="" /> :
                              <AiOutlineCloudUpload size={26} />}
                            <div>
                              {imageFile && <p className="text-md font-semibold">{imageFile.name.slice(0, 32)}</p>}

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
                            accept='image/*'
                            onChange={handleImage}
                          />

                        </label>
                      </div>
                      {imageError && <p className="text-xs mt-2 font-medium text-rose-500">{imageError}</p>}
                      {imageSrc && <button onClick={() => {
                        setImageSrc(null)
                        setImageFile(null)
                      }} className="btn btn-outline btn-primary btn-xs mx-2 mt-2">Cancel image</button>}

                    </div>
                  )}
                  <ToastMessage successMessage={success} errorMessage={imageError} />
                </div>
                <button type="submit" className="flex gap-2 justify-center items-cente bg-[#8633FF] mt-5 w-full py-[6px] rounded text-white font-medium">
                  {loading && <FaSpinner size={20} className="animate-spin" />}
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
