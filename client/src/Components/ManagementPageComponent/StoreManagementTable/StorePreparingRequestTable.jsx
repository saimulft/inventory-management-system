import { useContext, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { format } from "date-fns";
import Swal from "sweetalert2";
import ToastMessage from "../../Shared/ToastMessage";
import { FaSpinner } from "react-icons/fa";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import FileDownload from "../../Shared/FileDownload";
import Loading from "../../Shared/Loading";
import ReactPaginate from "react-paginate";
import { DateRange } from "react-date-range";
import useGlobal from "../../../hooks/useGlobal";
import { GlobalContext } from "../../../Providers/GlobalProviders";
import { NotificationContext } from "../../../Providers/NotificationProvider";
import { useLocation } from "react-router-dom";

export default function StorePreparingRequestTable() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const notificationSearchValue = queryParams.get("notification_search");

  const { isSidebarOpen, setCountsRefetch } = useGlobal();
  const { socket } = useContext(GlobalContext);
  const { currentUser } = useContext(NotificationContext);
  const [filterDays, setFilterDays] = useState("all");
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [InvoiceImageFile, setInvoiceImageFile] = useState(null);
  const [shippingImageFile, setShippingImageFile] = useState(null);
  const [InvoiceImageError, setInvoiceImageError] = useState("");
  const [shippingImageError, setShippingImageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [productName, setProductName] = useState("");
  const { user } = useAuth();
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

  const handleKeyDown = (event) => {
    const alphabetKeys = /^[0-9\b]+$/; // regex pattern to match alphabet keys
    if (!alphabetKeys.test(event.key) && event.key != "Backspace") {
      event.preventDefault();
    }
  };

  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["preparing_request_data"],
    queryFn: async () => {
      try {
        const res = await axios.post(
          "/api/v1/preparing_form_api/get_all_preparing_request_data",
          { user }
        );
        if (res.status === 200) {
          return res?.data?.data;
        }
        return [];
      } catch (error) {
        return [];
      }
    },
  });

  const notificationSearchData = data?.find(
    (d) => d._id == notificationSearchValue
  );

  const handleDelete = (_id, invoice_file, shipping_file) => {
    const deleteData = {
      id: _id,
      invoice_file,
      shipping_file,
    };
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
          .delete(`/api/v1/preparing_form_api/delete_preparing_request_data`, {
            data: deleteData,
          })
          .then((res) => {
            if (res.status === 200) {
              refetch();
              setCountsRefetch(true);
              Swal.fire("Deleted!", "Data has been deleted.", "success");
            }
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const handleUpdateRequestForm = (event) => {
    setSuccessMessage("");
    event.preventDefault();
    const form = event.target;
    const courier = form.courier.value;
    const supplierTracker = form.supplierTracker.value;
    const note = form.note.value;

    let preparingFormvalue = {
      courier,
      trackingNumber: supplierTracker,
      notes: note,
      id: singleData._id,
      quantity,
      productName,
    };

    const formData = new FormData();
    for (const key in preparingFormvalue) {
      formData.append(key, preparingFormvalue[key]);
    }
    const Invoice = InvoiceImageFile?.name.split(".").pop();
    const shipping = shippingImageFile?.name.split(".").pop();

    if (InvoiceImageFile && !shippingImageFile) {
      formData.append("file", InvoiceImageFile, `invoice.${Invoice}`);
    }
    if (shippingImageFile && !InvoiceImageFile) {
      formData.append("file", shippingImageFile, `shipping.${shipping}`);
    }
    if (InvoiceImageFile && shippingImageFile) {
      formData.append("file", InvoiceImageFile, `invoice.${Invoice}`);
      formData.append("file", shippingImageFile, `shipping.${shipping}`);
    }
    setLoading(true);
    axios
      .put("/api/v1/preparing_form_api/preparing_form_update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          const status = "Update preparing request data.";
          axios
            .post(`/api/v1/notifications_api/send_notification`, {
              currentUser,
              status,
              notification_links: [
                "http://localhost:5173/dashboard/management",
                "http://localhost:5173/dashboard/management/store/pending-arrival",
                "http://localhost:5173/dashboard/management/inventory/pending-arrival",
              ],
            })
            .then((res) => {
              console.log(res.data);
              // send real time notification data
              if (res.data?.finalResult?.acknowledged) {
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
          form.reset();
          setInvoiceImageFile(null);
          setShippingImageFile(null);
          setLoading(false);
          setSuccessMessage("Data Updated");
          refetch();
          setCountsRefetch(true);
          setTimeout(() => {
            setSuccessMessage("");
          }, 1000);
        } else {
          setLoading(false);
          setFormError("Already up to date");
          setTimeout(() => {
            setFormError("A");
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setFormError("Already up to date");
        setTimeout(() => {
          setFormError("");
        }, 1000);
      });
  };
  const handleInvoiceImage = (e) => {
    if (e.target.files[0]) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (e.target.files[0].size > maxSizeInBytes) {
        setInvoiceImageError("Max 5 MB");
        return;
      } else {
        setInvoiceImageError("");
        setInvoiceImageFile(e.target.files[0]);
      }
    }
  };
  const handleShippingImage = (e) => {
    if (e.target.files[0]) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (e.target.files[0].size > maxSizeInBytes) {
        setShippingImageError("Max 5 MB");
        return;
      } else {
        setShippingImageError("");
        setShippingImageFile(e.target.files[0]);
      }
    }
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
        item.upin?.toLowerCase().includes(searchText) ||
        item.courier?.toLowerCase().includes(searchText) ||
        item.store_name?.toLowerCase().includes(searchText) ||
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
  const generatePageNumbers = (currentPage, pageCount, maxVisiblePages) => {
    if (pageCount <= maxVisiblePages) {
      // If the total page count is less than or equal to the maximum visible pages, show all pages.
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      const firstPage = Math.max(currentPage - halfVisible, 1);
      const lastPage = Math.min(currentPage + halfVisible, pageCount);

      const pageNumbers = [];

      if (firstPage > 1) {
        pageNumbers.push(1);
        if (firstPage > 2) {
          pageNumbers.push("..."); // Show ellipsis
        }
      }

      for (let i = firstPage; i <= lastPage; i++) {
        pageNumbers.push(i);
      }

      if (lastPage < pageCount) {
        if (lastPage < pageCount - 1) {
          pageNumbers.push("..."); // Show ellipsis
        }
        pageNumbers.push(pageCount);
      }

      return pageNumbers;
    }
  };
  const generatePageNumbersFilter = (
    currentPage,
    pageCount,
    maxVisiblePages
  ) => {
    if (pageCount <= maxVisiblePages) {
      // If the total page count is less than or equal to the maximum visible pages, show all pages.
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      const firstPage = Math.max(currentPage - halfVisible, 1);
      const lastPage = Math.min(currentPage + halfVisible, pageCount);

      const pageNumbers = [];

      if (firstPage > 1) {
        pageNumbers.push(1);
        if (firstPage > 2) {
          pageNumbers.push("..."); // Show ellipsis
        }
      }

      for (let i = firstPage; i <= lastPage; i++) {
        pageNumbers.push(i);
      }

      if (lastPage < pageCount) {
        if (lastPage < pageCount - 1) {
          pageNumbers.push("..."); // Show ellipsis
        }
        pageNumbers.push(pageCount);
      }

      return pageNumbers;
    }
  };
  const itemsPerPage = 15;
  const maxVisiblePages = 10; // Adjust the number of maximum visible pages as needed
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const pageCountFilter = Math.ceil(searchResults.length / itemsPerPage);

  generatePageNumbers(currentPage + 1, pageCount, maxVisiblePages);
  generatePageNumbersFilter(currentPage + 1, pageCountFilter, maxVisiblePages);

  // pagination code

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
        Preparing Request
        <span className={`${notificationSearchValue && "hidden"}`}>
          : {data.length}
        </span>
      </h3>

      <div className="relative flex justify-between items-center mt-4">
        <div>
          <div className="flex gap-4 text-sm items-center">
            <p
              onClick={() => {
                setSearchResults([]);
                setSearchText("");
                setSearchError("");
                setFilterDays("all");
              }}
              className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${
                filterDays === "all" && "bg-[#8633FF] text-white"
              }`}
            >
              All
            </p>
            {!notificationSearchValue && (
              <>
                <p
                  onClick={() => {
                    handleDateSearch("today");
                    setFilterDays("today");
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${
                    filterDays === "today" && "bg-[#8633FF] text-white"
                  }`}
                >
                  Today
                </p>
                <p
                  onClick={() => {
                    handleDateSearch(7);
                    setFilterDays(7);
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${
                    filterDays === 7 && "bg-[#8633FF] text-white"
                  }`}
                >
                  7 Days
                </p>
                <p
                  onClick={() => {
                    handleDateSearch(15);
                    setFilterDays(15);
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${
                    filterDays === 15 && "bg-[#8633FF] text-white"
                  }`}
                >
                  15 Days
                </p>
                <p
                  onClick={() => {
                    handleDateSearch(30);
                    setFilterDays(1);
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${
                    filterDays === 1 && "bg-[#8633FF] text-white"
                  }`}
                >
                  1 Month
                </p>
                <p
                  onClick={() => {
                    handleDateSearch(365);
                    setFilterDays("year");
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${
                    filterDays === "year" && "bg-[#8633FF] text-white"
                  }`}
                >
                  Year
                </p>
                <p
                  onClick={() => {
                    setFilterDays("custom");
                    document.getElementById("date_range_modal").showModal();
                  }}
                  className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${
                    filterDays === "custom" && "bg-[#8633FF] text-white"
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

      <div className="overflow-x-auto mt-8 min-h-[calc(100vh-288px)] max-h-full">
        <table className="table table-sm">
          <thead>
            <tr className="bg-gray-200">
              <th>Date</th>
              <th>Store Name</th>
              <th>ASIN/UPC</th>
              <th>Code Type</th>
              <th>Product Name</th>
              <th>Order ID</th>
              <th>UPIN</th>
              <th>Quantity</th>
              <th>Courier</th>
              <th>Supplier Tracking</th>
              <th>Invoice level</th>
              <th>Shipping level</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notificationSearchData == undefined && notificationSearchValue && (
              <p className="absolute top-[260px] flex items-center justify-center w-full text-rose-500 text-xl font-medium">
                Preparing request notified data not available!
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
                      <tr
                        className={`${index % 2 == 1 && ""} py-2`}
                        key={index}
                      >
                        <th>{format(new Date(d.date), "y/MM/d")}</th>
                        <th className="font-normal">{d.store_name}</th>
                        <td>{d.asin_upc_code}</td>
                        <td>{d.code_type}</td>
                        <td>{d.product_name}</td>
                        <td>{d.order_id}</td>
                        <td>{d.upin}</td>
                        <td>{d.quantity}</td>
                        <td>{d.courier}</td>
                        <td>{d.tracking_number}</td>
                        <td>
                          {d.invoice_file && (
                            <FileDownload fileName={d.invoice_file} />
                          )}
                        </td>
                        <td>
                          {d.shipping_file && (
                            <FileDownload fileName={d.shipping_file} />
                          )}
                        </td>
                        <td>{d.notes}</td>
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
                                    document
                                      .getElementById("my_modal_2")
                                      .showModal();
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
                                      handleDelete(
                                        d._id,
                                        d.invoice_file,
                                        d.shipping_file
                                      )
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
                        <tr
                          className={`${index % 2 == 1 && ""} py-2`}
                          key={index}
                        >
                          <th>{format(new Date(d.date), "y/MM/d")}</th>
                          <th className="font-normal">{d.store_name}</th>
                          <td>{d.asin_upc_code}</td>
                          <td>{d.code_type}</td>
                          <td>{d.product_name}</td>
                          <td>{d.order_id}</td>
                          <td>{d.upin}</td>
                          <td>{d.quantity}</td>
                          <td>{d.courier}</td>
                          <td>{d.tracking_number}</td>
                          <td>
                            {d.invoice_file && (
                              <FileDownload fileName={d.invoice_file} />
                            )}
                          </td>
                          <td>
                            {d.shipping_file && (
                              <FileDownload fileName={d.shipping_file} />
                            )}
                          </td>
                          <td>{d.notes}</td>
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
                                      document
                                        .getElementById("my_modal_2")
                                        .showModal();
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
                                        handleDelete(
                                          d._id,
                                          d.invoice_file,
                                          d.shipping_file
                                        )
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
                  notificationSearchData && (
                    <tr>
                      <th>
                        {notificationSearchData?.date &&
                          format(
                            new Date(notificationSearchData?.date),
                            "y/MM/d"
                          )}
                      </th>
                      <th className="font-normal">
                        {notificationSearchData?.store_name}
                      </th>
                      <td>{notificationSearchData?.asin_upc_code}</td>
                      <td>{notificationSearchData?.code_type}</td>
                      <td>{notificationSearchData?.product_name}</td>
                      <td>{notificationSearchData?.order_id}</td>
                      <td>{notificationSearchData?.upin}</td>
                      <td>{notificationSearchData?.quantity}</td>
                      <td>{notificationSearchData?.courier}</td>
                      <td>{notificationSearchData?.tracking_number}</td>
                      <td>
                        {notificationSearchData?.invoice_file && (
                          <FileDownload
                            fileName={notificationSearchData?.invoice_file}
                          />
                        )}
                      </td>
                      <td>
                        {notificationSearchData?.shipping_file && (
                          <FileDownload
                            fileName={notificationSearchData?.shipping_file}
                          />
                        )}
                      </td>
                      <td>{notificationSearchData?.notes}</td>
                      <td>
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0}>
                            <BiDotsVerticalRounded
                              onClick={() => setSingleData()}
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
                                    .getElementById("my_modal_2")
                                    .showModal();
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
                                    handleDelete(
                                      notificationSearchValue?._id,
                                      notificationSearchData?.invoice_file,
                                      notificationSearchData?.shipping_file
                                    )
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
                  )
                )}
              </>
            )}
          </tbody>
        </table>

        {/* pagination */}
        {!isLoading &&
          !searchError &&
          !searchResults.length &&
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
        {!isLoading && !searchError && searchResults.length > 15 && (
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
      <dialog id="my_modal_2" className="modal">
        <div
          style={{ marginLeft, maxWidth: "750px" }}
          className="modal-box py-10 px-10"
        >
          <div className="flex gap-10">
            <div className="w-1/2">
              <div className="flex items-center mb-6 gap-2">
                {user.role === "Admin" || user.role === "Admin VA" ? (
                  <BiSolidEdit
                    onClick={() => setIsEditable(!isEditable)}
                    size={24}
                    className="cursor-pointer"
                  />
                ) : null}
                <h3 className="text-2xl font-medium">Details</h3>
              </div>

              <div
                className={`flex items-center ${
                  isEditable && "justify-between mt-2"
                }`}
              >
                <label className="font-bold ">Quantity : </label>
                <input
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number"
                  defaultValue={singleData?.quantity}
                  className={`${
                    isEditable
                      ? "border border-[#8633FF] outline-[#8633FF] mt-1"
                      : "outline-none"
                  } py-1 pl-2 rounded`}
                  id="date"
                  name="date"
                  readOnly={!isEditable}
                />
              </div>
              <div
                className={`flex items-center ${
                  isEditable && "justify-between mt-2"
                }`}
              >
                <label className="font-bold ">Product name : </label>
                <input
                  onChange={(e) => setProductName(e.target.value)}
                  type="text"
                  defaultValue={singleData?.product_name}
                  className={`${
                    isEditable
                      ? "border border-[#8633FF] outline-[#8633FF] mt-1"
                      : "outline-none"
                  } py-1 pl-2 rounded`}
                  id="date"
                  name="date"
                  readOnly={!isEditable}
                />
              </div>
            </div>
            <div className="w-1/2">
              <h3 className="text-2xl mb-6 font-medium">Update</h3>
              <form onSubmit={handleUpdateRequestForm}>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Courier</label>
                  <select
                    className="border border-[#8633FF] outline-[#8633FF] py-2 text-xs pl-2 rounded"
                    id="courier"
                    name="courier"
                  >
                    <option value="Select courier">Select courier</option>
                    <option value="Courier-1">Courier-1</option>
                    <option value="Courier-2">Courier-2</option>
                    <option value="Courier-3">Courier-3</option>
                  </select>
                </div>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Supplier Tracker</label>
                  <input
                    type="text"
                    placeholder="Enter Supplier Tracker"
                    className="border border-[#8633FF] outline-[#8633FF] py-2 text-xs pl-2 rounded"
                    id="supplierTracker"
                    name="supplierTracker"
                  />
                </div>

                <div className="mt-2">
                  <label className="font-bold mb-1">Invoice </label>
                  <div className="flex items-center w-full mt-2">
                    <label
                      htmlFor="invoice-dropzone"
                      className="flex justify-between items-center px-4 w-full h-fit border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 shadow-lg"
                    >
                      <div className="flex items-center gap-5 py-[4px]">
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
                      </div>
                      <input
                        id="invoice-dropzone"
                        name="invoice-dropzone"
                        accept="image/*,application/pdf"
                        type="file"
                        onChange={handleInvoiceImage}
                        className="hidden"
                      />
                      <div className="ml-5">
                        {InvoiceImageFile && (
                          <p className="font-bold text-lg">
                            {InvoiceImageFile.name}
                          </p>
                        )}
                        {!InvoiceImageFile && (
                          <p className=" text-sm">Select PNG , JPEG or PDF</p>
                        )}
                      </div>
                    </label>
                  </div>
                  {InvoiceImageError && (
                    <p className="text-xs mt-2 font-medium text-rose-500">
                      {InvoiceImageError}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <label className="font-bold mb-1">Shipping Label</label>
                  <div className="flex items-center w-full mt-2">
                    <label
                      htmlFor="shippingLabel-dropzone"
                      className="flex justify-between items-center px-4 w-full h-fit border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 shadow-lg"
                    >
                      <div className="flex items-center gap-5 py-[4px]">
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
                      </div>
                      <input
                        id="shippingLabel-dropzone"
                        name="shippingLabel-dropzone"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleShippingImage}
                        className="hidden"
                      />
                      <div className="ml-5">
                        {shippingImageFile && (
                          <p className="font-bold text-lg">
                            {shippingImageFile.name}
                          </p>
                        )}
                        {!shippingImageFile && (
                          <p className=" text-sm">Select PNG , JPEG or PDF</p>
                        )}
                      </div>
                    </label>
                  </div>
                  {shippingImageError && (
                    <p className="text-xs mt-2 font-medium text-rose-500">
                      {shippingImageError}
                    </p>
                  )}
                </div>

                <div className="flex flex-col mt-2 mb-2">
                  <label className=" font-bold mb-1">Note</label>
                  <input
                    type="text"
                    placeholder="Enter Your Note"
                    className="border border-[#8633FF] outline-[#8633FF] py-2 pl-2 rounded text-xs"
                    id="note"
                    name="note"
                  />
                </div>
                <ToastMessage
                  errorMessage={formError}
                  successMessage={successMessage}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#8633FF] mt-4 flex gap-2 py-2 justify-center items-center text-white rounded-lg w-full"
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
      </dialog>
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
