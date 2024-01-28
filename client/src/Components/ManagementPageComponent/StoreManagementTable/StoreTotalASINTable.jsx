import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import { AiOutlineCloudUpload, AiOutlineSearch } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Compressor from "compressorjs";
import { FaSpinner } from "react-icons/fa";
import ToastMessage from "../../Shared/ToastMessage";
import Loading from "../../Shared/Loading";
import { DateRange } from "react-date-range";
import ReactPaginate from "react-paginate";
import useGlobal from "../../../hooks/useGlobal";
import { useLocation } from "react-router-dom";
import ViewImage from "../../Shared/ViewImage";
import handlePriceKeyDown from "../../../Utilities/handlePriceKeyDown";

export default function InventoryTotalASINTable() {
  const [photoUploadType, setPhotoUploadType] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [singleData, setSingleData] = useState({});
  const [loading, setLoding] = useState(false);
  const [success, setSuccess] = useState();
  const { user } = useAuth();
  const { isSidebarOpen, setCountsRefetch } = useGlobal();
  const [filterDays, setFilterDays] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredDataPage, setFilteredDataPage] = useState(0);
  const [rangeDate, setRangeDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(), //addDays(new Date(), 7)
      key: "selection",
    },
  ]);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // Get the value of the 'notification_search' parameter
  const notificationSearchValue = queryParams.get("notification_search");

  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["get_all_asin_upc"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `/api/v1/asin_upc_api/get_all_asin_upc?id=${user.admin_id}`
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

  const notificationSearchData = data?.find(
    (d) => d._id == notificationSearchValue
  );

  const handleCustomDateSearch = () => {
    setSearchError("");
    const startDate = rangeDate[0].startDate;
    const endDate = rangeDate[0].endDate;
    if (startDate !== endDate) {
      const filteredDateResults = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      if (!filteredDateResults.length) {
        return setSearchError(`No data found for selected date range`);
      }
      if (filteredDateResults.length) {
        setSearchResults(filteredDateResults);
      }
    }
  };

  const handleDateSearch = (day) => {
    setSearchError("");
    const currentDate = new Date();
    const endDate = new Date();
    let startDate;

    if (day === "today") {
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0); // Set to midnight
    } else {
      const previousDate = new Date();
      previousDate.setDate(currentDate.getDate() - day);
      startDate = previousDate;
    }

    const filteredDateResults = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    if (!filteredDateResults.length) {
      setSearchResults([]);
      if (day === "today") {
        return setSearchError("No data found for today");
      } else if (day === 365) {
        return setSearchError("No data found for the past 1 year");
      } else if (day === 30) {
        return setSearchError("No data found for the past 1 month");
      } else {
        return setSearchError(`No data found for the past ${day} days`);
      }
    }

    setSearchResults(filteredDateResults);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setSearchError("");
    if (!searchText) {
      return;
    }
    const filteredData = data.filter(
      (item) =>
        item.asin_upc_code?.toLowerCase().includes(searchText) ||
        item.product_name?.toLowerCase().includes(searchText) ||
        item.store_manager_name?.toLowerCase().includes(searchText) ||
        item.code_type?.toLowerCase().includes(searchText)
    );
    if (!filteredData.length) {
      setFilterDays(null);
      setSearchError(`No data found for "${searchText}"`);
      return;
    }
    setFilterDays(null);
    setSearchResults(filteredData);
  };

  const handleDelete = (id, product_image) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8633FF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `/api/v1/asin_upc_api/delete_asin_upc?id=${id}&product_image=${product_image}`
          )
          .then((res) => {
            if (res.status === 200) {
              Swal.fire("Deleted!", "Data has been deleted.", "success");
              refetch();
              setCountsRefetch(true);
            }
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const handleAsinUpcUpdate = async (event) => {
    event.preventDefault();
    setImageError("");
    const form = event.target;
    const minPrice = form.minPrice.value;
    const inputUrl = form.inputImageUrl?.value;

    try {
      setLoding(true);

      const asinInfo = {
        productImage: inputUrl,
        minPrice,
      };
      axios
        .put(
          `/api/v1/asin_upc_api/update_asin_upc?id=${singleData?._id}`,
          asinInfo
        )
        .then((res) => {
          if (res.status === 200) {
            setImageSrc(null);
            setImageFile(null);
            form.reset();
            setLoding(false);
            refetch();
            setCountsRefetch(true);
            setSuccess("Updated");
            setTimeout(() => {
              setSuccess("");
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoding(false);
        });
    } catch (error) {
      setLoding(false);
      console.log(error);
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
              productImage: productImage,
              minPrice,
            };
            axios
              .put(
                `/api/v1/asin_upc_api/update_asin_upc?id=${singleData._id}`,
                asinInfo
              )

              .then((res) => {
                if (res.status === 200) {
                  form.reset();
                  setImageSrc(null);
                  setImageFile(null);
                  refetch();
                  setLoding(false);
                  setSuccess("Updated");
                  setTimeout(() => {
                    setSuccess("");
                  }, 2000);
                }
              })
              .catch(() => {
                setLoding(false);
              });
          }
        })
        .catch(() => {
          setLoding(false);
        });
    }

    if (!imageFile && !inputUrl && minPrice) {
      const asinInfo = {
        minPrice,
      };
      setLoding(true);
      axios
        .put(
          `/api/v1/asin_upc_api/update_asin_upc?id=${singleData._id}`,
          asinInfo
        )
        .then((res) => {
          if (res.status === 200) {
            setImageSrc(null);
            setImageFile(null);
            form.reset();
            setLoding(false);
            refetch();
            setSuccess("Updated");
            setTimeout(() => {
              setSuccess("");
            }, 2000);
          }
        })
        .catch(() => {
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

  const itemsPerPage = 15;
  const maxVisiblePages = 10;

  const handleFilteredDataPageChange = ({ selected }) => {
    setFilteredDataPage(selected);
  };
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  // filter pagination calculation
  const startIndexFilter = filteredDataPage * itemsPerPage;
  const endIndexFilter = startIndexFilter + itemsPerPage;
  const displayedDataFilter = searchResults.slice(
    startIndexFilter,
    endIndexFilter
  );

  //  ALl data pagination calculation
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayAllData = data.slice(startIndex, endIndex);
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";
  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">
        Total ASIN/UPC
        <span className={`${notificationSearchValue && "hidden"}`}>
          : {searchError ? 0 : searchResults?.length ? searchResults?.length : data?.length}
        </span>
      </h3>
      <div className="relative flex justify-between items-center mt-4">
        <div>
          <div className="flex gap-4 text-sm items-center">

            {!notificationSearchValue && (
              <>
                <p
                  onClick={() => {
                    setSearchResults([]);
                    setSearchText("");
                    setSearchError("");
                    setFilterDays("all");
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === "all" && "bg-[#8633FF] text-white"
                    }`}
                >
                  All
                </p>
                <p
                  onClick={() => {
                    handleDateSearch("today");
                    setFilterDays("today");
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === "today" && "bg-[#8633FF] text-white"
                    }`}
                >
                  Today
                </p>
                <p
                  onClick={() => {
                    handleDateSearch(7);
                    setFilterDays(7);
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 7 && "bg-[#8633FF] text-white"
                    }`}
                >
                  7 Days
                </p>
                <p
                  onClick={() => {
                    handleDateSearch(15);
                    setFilterDays(15);
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 15 && "bg-[#8633FF] text-white"
                    }`}
                >
                  15 Days
                </p>
                <p
                  onClick={() => {
                    handleDateSearch(30);
                    setFilterDays(1);
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 1 && "bg-[#8633FF] text-white"
                    }`}
                >
                  1 Month
                </p>
                <p
                  onClick={() => {
                    handleDateSearch(365);
                    setFilterDays("year");
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === "year" && "bg-[#8633FF] text-white"
                    }`}
                >
                  Year
                </p>
                <p
                  onClick={() => {
                    setFilterDays("custom");
                    document.getElementById("date_range_modal").showModal();
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === "custom" && "bg-[#8633FF] text-white"
                    }`}
                >
                  Custom
                </p>
              </>
            )}
          </div>
        </div>

        {!notificationSearchValue && (
          <form
            onSubmit={handleSearch}
            className="w-1/4  flex items-center justify-between"
          >
            <input
              className="border bg-white shadow-md border-[#8633FF] outline-none w-[60%]   py-2 rounded-md px-2 text-sm"
              placeholder="Search Here"
              value={searchText}
              type="text"
              onChange={(e) =>
                setSearchText(e.target.value.toLocaleLowerCase())
              }
            />
            <div className="w-[40%] flex items-center justify-evenly">
              <button
                type="submit"
                onClick={handleSearch}
                className="py-[6px] px-4 bg-[#8633FF] text-white rounded"
              >
                <AiOutlineSearch size={24} />
              </button>
              <button
                onClick={() => {
                  setSearchResults([]);
                  setSearchText("");
                  setSearchError("");
                  setFilterDays("all");
                }}
                className="py-[6px] px-4 bg-[#8633FF] text-white rounded"
              >
                Clear
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="mt-8 min-h-[calc(100vh-288px)] max-h-full">
        <div className={`overflow-x-auto overflow-y-hidden ${(searchError || isLoading) ? 'h-[calc(100vh-288px)]' : 'h-full'}`}>
          <table className="table table-sm mb-[95px]">
            <thead>
              <tr className="bg-gray-200">
                <th>Product Image</th>
                <th>Date</th>
                <th>ASIN/UPC</th>
                <th>Product Name</th>
                <th>Min Price</th>
                <th>Code Type</th>
                <th>Store Manager</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="relative">
              {notificationSearchData == undefined && notificationSearchValue && (
                <p className="absolute top-[260px] flex items-center justify-center w-full text-rose-500 text-xl font-medium">
                  Data move to the next sequence!
                </p>
              )}
              {searchError ? (
                <p className="absolute top-[260px] flex items-center justify-center w-full text-rose-500 text-xl font-medium">
                  {searchError}
                </p>
              ) : (
                <>
                  {searchResults.length ? (
                    displayedDataFilter.map((d, index) => {
                      return (
                        <tr className={`${index % 2 == 1 && ""}`} key={index}>
                          <td>
                            {d.product_image && (
                              <ViewImage fileName={d.product_image} />
                            )}
                          </td>
                          <th>{d.date && format(new Date(d.date), "y/MM/d")}</th>
                          <td>{d.asin_upc_code}</td>
                          <td className="text-[#8633FF]">{d.product_name}</td>
                          <td>{d.min_price}</td>
                          <td>{d.code_type}</td>
                          <td>{d.store_manager_name}</td>
                          <td>
                            <div className="dropdown dropdown-end">
                              <label tabIndex={0}>
                                <BiDotsVerticalRounded
                                  onClick={() => setSingleData(d)}
                                  cursor="pointer"
                                />
                              </label>
                              <ul
                                tabIndex={0}
                                className="mt-3 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black"
                              >
                                <li>
                                  <button
                                    onClick={() => {
                                      setIsOpenUpdateModal(true)
                                    }}
                                  >
                                    Edit
                                  </button>
                                </li>
                                {user.role === "Admin" ||
                                  user.role === "Admin VA" ? (
                                  <li>
                                    <button
                                      onClick={() =>
                                        handleDelete(d._id, d.product_image)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </li>
                                ) : (
                                  ""
                                )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : !notificationSearchValue ? (
                    isLoading ? (
                      <Loading />
                    ) : (
                      displayAllData?.map((d, index) => {
                        return (
                          <tr className={`${index % 2 == 1 && ""}`} key={index}>
                            <td>
                              {d.product_image && (
                                <ViewImage fileName={d.product_image} />
                              )}
                            </td>
                            <th>
                              {d.date && format(new Date(d.date), "y/MM/d")}
                            </th>
                            <td>{d.asin_upc_code}</td>
                            <td className="text-[#8633FF]">{d.product_name}</td>
                            <td>{d.min_price}</td>
                            <td>{d.code_type}</td>
                            <td>{d.store_manager_name}</td>
                            <td>
                              <div className="dropdown dropdown-end">
                                <label tabIndex={0}>
                                  <BiDotsVerticalRounded
                                    onClick={() => setSingleData(d)}
                                    cursor="pointer"
                                  />
                                </label>
                                <ul
                                  tabIndex={0}
                                  className="mt-3 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black"
                                >
                                  <li>
                                    <button
                                      onClick={() => {
                                        setIsOpenUpdateModal(true)
                                      }}
                                    >
                                      Edit
                                    </button>
                                  </li>
                                  {user.role === "Admin" ||
                                    user.role === "Admin VA" ? (
                                    <li>
                                      <button
                                        onClick={() =>
                                          handleDelete(d._id, d.product_image)
                                        }
                                      >
                                        Delete
                                      </button>
                                    </li>
                                  ) : (
                                    ""
                                  )}
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )
                  ) : (
                    <tr>
                      <td>
                        {notificationSearchData?.product_image && (
                          <ViewImage
                            fileName={notificationSearchData?.product_image}
                          />
                        )}
                      </td>
                      <th>
                        {notificationSearchData?.date &&
                          format(
                            new Date(notificationSearchData?.date),
                            "y/MM/d"
                          )}
                      </th>
                      <td>{notificationSearchData?.asin_upc_code}</td>
                      <td className="text-[#8633FF]">
                        {notificationSearchData?.product_name}
                      </td>
                      <td>{notificationSearchData?.min_price}</td>
                      <td>{notificationSearchData?.code_type}</td>
                      <td>{notificationSearchData?.store_manager_name}</td>
                      <td>
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0}>
                            <BiDotsVerticalRounded
                              onClick={() =>
                                setSingleData(notificationSearchData)
                              }
                              cursor="pointer"
                            />
                          </label>
                          <ul
                            tabIndex={0}
                            className="mt-3 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black"
                          >
                            <li>
                              <button
                                onClick={() => {
                                  document
                                  setIsOpenUpdateModal(true)
                                }}
                              >
                                Edit
                              </button>
                            </li>
                            {user.role === "Admin" || user.role === "Admin VA" ? (
                              <li>
                                <button
                                  onClick={() =>
                                    handleDelete(notificationSearchData._id, notificationSearchData.product_image)
                                  }
                                >
                                  Delete
                                </button>
                              </li>
                            ) : (
                              ""
                            )}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {!isLoading &&
          !searchError &&
          !searchResults.length && !notificationSearchValue &&
          data?.length > 15 && (
            <div>
              <ReactPaginate
                pageCount={Math.ceil(data.length / itemsPerPage)}
                marginPagesDisplayed={1}
                pageRangeDisplayed={maxVisiblePages}
                onPageChange={handlePageChange}
                containerClassName="pagination"
                activeClassName="active"
                breakLabel={"..."}
                pageLinkClassName={(pageNumber) => {
                  return pageNumber === "..." ? "ellipsis" : "";
                }}
              />
            </div>
          )}
        {!isLoading && !searchError && searchResults.length > 15 && !notificationSearchValue && (
          <ReactPaginate
            pageCount={Math.ceil(searchResults.length / itemsPerPage)}
            pageRangeDisplayed={maxVisiblePages}
            marginPagesDisplayed={1}
            onPageChange={handleFilteredDataPageChange}
            containerClassName="pagination"
            activeClassName="active"
            breakLabel={"..."}
            pageLinkClassName={(pageNumber) => {
              return pageNumber === "..." ? "ellipsis" : "";
            }}
          />
        )}
      </div>

      {/* modal content  */}
      {isOpenUpdateModal && <div onClick={() => setIsOpenUpdateModal(false)} className="flex justify-center items-center overflow-hidden bg-[#00000040] fixed top-0 left-0 right-0 bottom-0 z-[100]">
        <div data-aos="fade-up" onClick={(e) => e.stopPropagation()} style={{ marginLeft, maxWidth: "750px" }} className=" py-10 px-10 bg-white rounded-lg">
          <div className="flex items-center justify-center">
            <div className="w-full px-4">
              <h3 className="text-2xl font-medium">Update</h3>
              <form onSubmit={handleAsinUpcUpdate}>
                <div className="flex flex-col mt-4">
                  <label className="text-slate-500">New Min Price</label>
                  <input
                    onKeyDown={handlePriceKeyDown}
                    type="text"
                    placeholder="Enter new min price"
                    className="input input-bordered input-primary w-full  mt-2"
                    id="minPrice"
                    name="minPrice"
                  />
                </div>

                <div className="mt-4">
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
                        </label>
                      </div>
                      {imageError && (
                        <p className="text-xs mt-2 font-medium text-rose-500">
                          {imageError}
                        </p>
                      )}
                      {imageSrc && (
                        <button
                          onClick={() => {
                            setImageSrc(null);
                            setImageFile(null);
                          }}
                          className="btn btn-outline btn-primary btn-xs mx-2 mt-2"
                        >
                          Cancel image
                        </button>
                      )}
                    </div>
                  )}
                  <ToastMessage
                    successMessage={success}
                    errorMessage={imageError}
                  />
                </div>
                <button
                  type="submit"
                  className="flex gap-2 justify-center items-cente bg-[#8633FF] mt-5 w-full py-[6px] rounded text-white font-medium"
                >
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
      </div>}
      {/* date range modal */}
      <dialog id="date_range_modal" className="modal">
        <div style={{ marginLeft, maxWidth: "750px" }} className="modal-box">
          <div className="mb-10">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => {
                setRangeDate([item.selection]);
              }}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={rangeDate}
              direction="horizontal"
              rangeColors={["#8633FF"]}
              color="#8633FF"
            />
          </div>
          <button
            onClick={() => {
              handleCustomDateSearch();
              document.getElementById("date_range_modal").close();
            }}
            className="block mx-auto bg-[#8633FF] text-white px-10 py-2 rounded"
          >
            Select
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
