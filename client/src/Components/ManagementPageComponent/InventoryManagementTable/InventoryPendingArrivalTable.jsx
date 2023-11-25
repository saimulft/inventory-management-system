import { useContext, useState } from "react";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { FaSpinner } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import Loading from "../../Shared/Loading";
import ReactPaginate from "react-paginate";
import { DateRange } from "react-date-range";
import useGlobal from "../../../hooks/useGlobal";
import { GlobalContext } from "../../../Providers/GlobalProviders";
import { NotificationContext } from "../../../Providers/NotificationProvider";

export default function InventoryPendingArrivalTable() {
  const { socket } = useContext(GlobalContext);
  const { currentUser } = useContext(NotificationContext);
  const [singleData, setSingleData] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState();
  const { user } = useAuth();
  const { isSidebarOpen, setCountsRefetch } = useGlobal();
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";
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
    queryKey: ["pending_arrival_data"],
    queryFn: async () => {
      try {
        const res = await axios.post(
          "/api/v1/pending_arrival_api/get_all_pending_arrival_data",
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
        item.store_name?.toLowerCase().includes(searchText) ||
        item.upin?.toLowerCase().includes(searchText) ||
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
      console.log(filteredDateResults);
      if (!filteredDateResults.length) {
        return setSearchError(`No data found for selected date range`);
      }
      if (filteredDateResults.length) {
        setSearchResults(filteredDateResults);
      }
    }
  };

  const handleDelete = (_id) => {
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
            `/api/v1/pending_arrival_api/delete_pending_arrival_data?id=${_id}`
          )
          .then((res) => {
            if (res.status === 200) {
              refetch();
              setCountsRefetch(true);
              Swal.fire(
                "Deleted!",
                "A pending arrival entry has been deleted.",
                "success"
              );
            }
          })
          .catch((error) => console.log(error));
      }
    });
  };

  const handleUpdate = (event, _id) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const form = event.target;
    const productName = form.productName.value;
    const quantity = form.quantity.value;
    const eda = form.eda.value;
    const receivedQnt = form.receivedQnt.value;
    const remark = form.remark.value;

    if (parseInt(receivedQnt) > parseInt(quantity)) {
      setLoading(false);
      setErrorMessage(
        `Recieved quanity must be less than ${singleData.quantity}`
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    if (!productName && !quantity && !eda && !receivedQnt && !remark) {
      setLoading(false);
      return setErrorMessage("No data entered");
    }

    const updatedData = {
      product_name: productName,
      quantity: quantity,
      eda: eda ? new Date(eda).toISOString() : "",
      received_quantity: receivedQnt,
      remark: remark,
    };

    axios
      .put(
        `/api/v1/pending_arrival_api/update_inventory_pending_arrival_data?id=${_id}`,
        updatedData
      )
      .then((res) => {
        if (res.status === 201) {
          const status = "Update pending arrival request.";
          axios
            .post(`/api/v1/notifications_api/send_notification`, {
              currentUser,
              status,
              notification_links: ["http://localhost:5173/dashboard/management","http://localhost:5173/dashboard/management/store/pending-arrival","http://localhost:5173/dashboard/management/inventory/pending-arrival"]
            })
            .then((res) => {
              console.log(res.data)
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
          setLoading(false);
          form.reset();
          refetch();
          setCountsRefetch(true);
          setSuccessMessage("Data update successful!");
          setTimeout(() => {
            setSuccessMessage("");
          }, 2000);
        }

        if (res.status === 203) {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage("Something went wrong while updating data!");

        setTimeout(() => {
          setErrorMessage("");
        }, 2000);
        console.log(error);
      });
  };

  // pagination code
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

  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">
        Pending Arrival: {data?.length}
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
          </div>
        </div>
        <form
          onSubmit={handleSearch}
          className="w-1/4  flex items-center justify-between"
        >
          <input
            className="border bg-white shadow-md border-[#8633FF] outline-none w-[60%]   py-2 rounded-md px-2 text-sm"
            placeholder="Search Here"
            value={searchText}
            type="text"
            onChange={(e) => setSearchText(e.target.value.toLocaleLowerCase())}
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
              <th>Supplier ID</th>
              <th>UPIN</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Courier</th>
              <th>Supplier Tracking</th>
              <th>EDA</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="relative">
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
                        <th>{format(new Date(d.date), "yyyy/MM/dd")}</th>
                        <th className="font-normal">{d.store_name}</th>
                        <td>{d.asin_upc_code}</td>
                        <td>{d.code_type}</td>
                        <td>{d.product_name}</td>
                        <td>{d.supplier_id}</td>
                        <td>{d.upin}</td>
                        <td>{d.unit_price}</td>
                        <td>{d.quantity}</td>
                        <td>{d.courier ? d.courier : "-"}</td>
                        <td>
                          {d.supplier_tracking ? d.supplier_tracking : "-"}
                        </td>
                        <td>{format(new Date(d.eda), "yyyy/MM/dd")}</td>
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
                                  <button onClick={() => handleDelete(d._id)}>
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
                ) : isLoading ? (
                  <Loading />
                ) : (
                  displayAllData?.map((d, index) => {
                    return (
                      <tr className={`${index % 2 == 1 && ""}`} key={index}>
                        <th>{format(new Date(d.date), "yyyy/MM/dd")}</th>
                        <th className="font-normal">{d.store_name}</th>
                        <td>{d.asin_upc_code}</td>
                        <td>{d.code_type}</td>
                        <td>{d.product_name}</td>
                        <td>{d.supplier_id}</td>
                        <td>{d.upin}</td>
                        <td>{d.unit_price}</td>
                        <td>{d.quantity}</td>
                        <td>{d.courier ? d.courier : "-"}</td>
                        <td>
                          {d.supplier_tracking ? d.supplier_tracking : "-"}
                        </td>
                        <td>{format(new Date(d.eda), "yyyy/MM/dd")}</td>
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
                                  <button onClick={() => handleDelete(d._id)}>
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
          <form
            onSubmit={(event) => handleUpdate(event, singleData._id)}
            className="flex gap-10"
          >
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
                  isEditable && "justify-between"
                }`}
              >
                <label className="font-bold">Product Name: </label>
                <input
                  type="text"
                  defaultValue={singleData.product_name}
                  className={`${
                    isEditable
                      ? "border border-[#8633FF] outline-[#8633FF] mt-1"
                      : "outline-none"
                  } py-1 pl-2 rounded`}
                  id="productName"
                  name="productName"
                  readOnly={!isEditable}
                />
              </div>
              <div
                className={`flex items-center ${
                  isEditable && "justify-between mt-2"
                }`}
              >
                <label className="font-bold">Quantity: </label>
                <input
                  onKeyDown={handleKeyDown}
                  type="text"
                  defaultValue={singleData.quantity}
                  className={`${
                    isEditable
                      ? "border border-[#8633FF] outline-[#8633FF] mt-1"
                      : "outline-none"
                  } py-1 pl-2 rounded`}
                  id="quantity"
                  name="quantity"
                  readOnly={!isEditable}
                />
              </div>
              <div
                className={`flex items-center ${
                  isEditable && "justify-between mt-2"
                }`}
              >
                <label className="font-bold">EDA: </label>
                <input
                  type={isEditable ? "date" : "text"}
                  defaultValue={
                    isEditable
                      ? ""
                      : singleData.eda &&
                        format(new Date(singleData.eda), "yyyy/MM/dd")
                  }
                  className={`${
                    isEditable
                      ? "border border-[#8633FF] outline-[#8633FF] mt-1"
                      : "outline-none"
                  } w-[191px] py-1 pl-2 rounded`}
                  id="eda"
                  name="eda"
                  readOnly={!isEditable}
                />
              </div>
            </div>

            <div className="w-1/2">
              <h3 className="text-2xl font-medium mb-6">Update</h3>
              <div>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Received Qnt</label>
                  <input
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Enter Received Qnt"
                    className="border border-[#8633FF] outline-[#8633FF] py-1 pl-2 rounded"
                    id="receivedQnt"
                    name="receivedQnt"
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Remark</label>
                  <input
                    type="text"
                    placeholder="Enter Remark"
                    className="border border-[#8633FF] outline-[#8633FF] py-1 pl-2 rounded"
                    id="remark"
                    name="remark"
                  />
                </div>

                <div className="mt-3">
                  {successMessage && (
                    <p className="w-full flex gap-2 items-center justify-center text-center text-sm font-medium text-green-600 bg-green-100 border py-1 px-4 rounded">
                      <BsCheck2Circle size={20} /> {successMessage}
                    </p>
                  )}

                  {errorMessage && (
                    <p className="w-full flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-1 px-4 rounded">
                      <MdErrorOutline size={20} /> {errorMessage}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-[#8633FF] flex gap-2 items-center justify-center mt-5 w-full py-[6px] rounded text-white font-medium"
                >
                  {loading && <FaSpinner size={20} className="animate-spin" />}
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {/* Date range modal */}
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
