import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import FileDownload from "../../Shared/FileDownload";
import { useContext, useState } from "react";
import Loading from "../../Shared/Loading";
import ReactPaginate from "react-paginate";
import { DateRange } from "react-date-range";
import Swal from "sweetalert2";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import useGlobal from "../../../hooks/useGlobal";
import { GlobalContext } from "../../../Providers/GlobalProviders";
import { NotificationContext } from "../../../Providers/NotificationProvider";
import { useLocation } from "react-router-dom";

export default function InventoryShippedTable() {
  const { socket } = useContext(GlobalContext);
  const { currentUser } = useContext(NotificationContext);
  const { user } = useAuth();
  const [filterDays, setFilterDays] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredDataPage, setFilteredDataPage] = useState(0);
  const { isSidebarOpen, setCountsRefetch } = useGlobal();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const notificationSearchValue = queryParams.get("notification_search");
  const [rangeDate, setRangeDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(), //addDays(new Date(), 7)
      key: "selection",
    },
  ]);

  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["ready_to_ship_data"],
    queryFn: async () => {
      try {
        const res = await axios.post(
          `/api/v1/shipped_api/get_all_shipped_data`,
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

  const notificationSearchData = data?.find(
    (d) => d._id == notificationSearchValue
  );

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
          .delete(`/api/v1/shipped_api/delete_shipped_data?id=${_id}`)
          .then((res) => {
            const notification_link = "/dashboard/management/store/shipped";
            const notification_search = [data?._id];
            const status = "A shipped entry has been deleted.";
            axios
              .post(`/api/v1/notifications_api/send_notification`, {
                currentUser,
                status,
                notification_link,
                notification_search,
                storeId: data?.store_id,
                warehouseId: data?.warehouse_id
              })
              .then((res) => {
                const notificationData = res.data?.notificationData;
                if (res.data?.finalResult?.acknowledged) {
                  // send real time notification data
                  socket?.current?.emit("sendNotification", {
                    user,
                    notificationData,
                  });
                }
              })
              .catch((err) => console.log(err));
            if (res.status === 200) {
              refetch();
              setCountsRefetch(true);
              Swal.fire(
                "Deleted!",
                "A shipped entry has been deleted.",
                "success"
              );
            }
          })
          .catch((error) => console.log(error));
      }
    });
  };

  const handleUpdate = (event, data) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const form = event.target;
    const resaleableQuantity = form.resaleableQuantity.value;
    const remark = form.remark.value;

    if (!resaleableQuantity && !remark) {
      setLoading(false);
      return setErrorMessage("No data entered");
    }

    if (parseInt(resaleableQuantity) > parseInt(singleData.quantity)) {
      setLoading(false);
      setErrorMessage(`Quantity must be less than ${singleData.quantity}`);
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    const updatedData = {
      resaleable_quantity: resaleableQuantity,
      remark: remark,
    };
    axios
      .put(`/api/v1/shipped_api/update_shipped_data?id=${data?._id}`, updatedData)
      .then((res) => {
        if (res.status === 201) {
          const notification_link = "/dashboard/management/store/shipped";
          const notification_search = [data?._id];
          const status = "Updated resaleable quantity.";
          axios
            .post(`/api/v1/notifications_api/send_notification`, {
              currentUser,
              status,
              notification_link,
              notification_search,
              storeId: data?.store_id,
              warehouseId: data?.warehouse_id
            })
            .then((res) => {
              const notificationData = res.data?.notificationData;
              if (res.data?.finalResult?.acknowledged) {
                // send real time notification data
                socket?.current?.emit("sendNotification", {
                  user,
                  notificationData,
                });
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

  const handleKeyDown = (event) => {
    const alphabetKeys = /^[0-9\b]+$/; // regex pattern to match alphabet keys
    if (!alphabetKeys.test(event.key) && event.key != "Backspace") {
      event.preventDefault();
    }
  };
  const itemsPerPage = 15;
  const maxVisiblePages = 10; // Adjust the number of maximum visible pages as needed

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
        Shipped
        <span className={`${notificationSearchValue && "hidden"}`}>
          : {data.length}
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
              <th>Shipping level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="relative">
            {/* {notificationSearchData == undefined && notificationSearchValue && (
              <p className="absolute top-[260px] flex items-center justify-center w-full text-rose-500 text-xl font-medium">
                Pending arrival notified data not available!
              </p>
            )} */}
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
                        <th>{d.date && format(new Date(d.date), "y/MM/d")}</th>
                        <td className="font-normal">{d.store_name}</td>
                        <td>{d.asin_upc_code}</td>
                        <td>{d.code_type}</td>
                        <td>{d.product_name}</td>
                        <td>{d.order_id}</td>
                        <td>{d.upin}</td>
                        <td>{d.quantity}</td>
                        <td>{d.courier}</td>
                        <td className="text-[#8633FF]">{d.tracking_number}</td>
                        <td>
                          {d.shipping_file && (
                            <FileDownload fileName={d.shipping_file} />
                          )}
                        </td>
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
                                  onClick={() =>
                                    document
                                      .getElementById("my_modal_2")
                                      .showModal()
                                  }
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
                ) : !notificationSearchValue ? (
                  displayAllData?.map((d, index) => {
                    return (
                      <tr className={`${index % 2 == 1 && ""}`} key={index}>
                        <th>{d.date && format(new Date(d.date), "y/MM/d")}</th>
                        <td className="font-normal">{d.store_name}</td>
                        <td>{d.asin_upc_code}</td>
                        <td>{d.code_type}</td>
                        <td>{d.product_name}</td>
                        <td>{d.order_id}</td>
                        <td>{d.upin}</td>
                        <td>{d.quantity}</td>
                        <td>{d.courier}</td>
                        <td className="text-[#8633FF]">{d.tracking_number}</td>
                        <td>
                          {d.shipping_file && (
                            <FileDownload fileName={d.shipping_file} />
                          )}
                        </td>
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
                                  onClick={() =>
                                    document
                                      .getElementById("my_modal_2")
                                      .showModal()
                                  }
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
                ) : (
                  <tr>
                    <th>
                      {notificationSearchData?.date &&
                        format(
                          new Date(notificationSearchData?.date),
                          "y/MM/d"
                        )}
                    </th>
                    <td className="font-normal">
                      {notificationSearchData?.store_name}
                    </td>
                    <td>{notificationSearchData?.asin_upc_code}</td>
                    <td>{notificationSearchData?.code_type}</td>
                    <td>{notificationSearchData?.product_name}</td>
                    <td>{notificationSearchData?.order_id}</td>
                    <td>{notificationSearchData?.upin}</td>
                    <td>{notificationSearchData?.quantity}</td>
                    <td>{notificationSearchData?.courier}</td>
                    <td className="text-[#8633FF]">
                      {notificationSearchData?.tracking_number}
                    </td>
                    <td>
                      {notificationSearchData?.shipping_file && (
                        <FileDownload
                          fileName={notificationSearchData?.shipping_file}
                        />
                      )}
                    </td>
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
                              onClick={() =>
                                document
                                  .getElementById("my_modal_2")
                                  .showModal()
                              }
                            >
                              Edit
                            </button>
                          </li>
                          {user.role === "Admin" || user.role === "Admin VA" ? (
                            <li>
                              <button
                                onClick={() =>
                                  handleDelete(notificationSearchData?._id)
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

        {/* pagination */}
        {!notificationSearchValue && !isLoading &&
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

      <dialog id="my_modal_2" className="modal">
        <div
          style={{ marginLeft, maxWidth: "750px" }}
          className="modal-box py-10 px-10"
        >
          <form
            onSubmit={(event) => handleUpdate(event, singleData)}
            className="flex gap-10"
          >
            <div className="w-1/2">
              <div className="flex items-center mb-6 gap-2">
                {/* <BiSolidEdit size={24} /> */}
                <h3 className="text-2xl font-medium">Details</h3>
              </div>
              <p className="mt-2">
                <span className="font-bold">Date: </span>
                <span>
                  {singleData.date &&
                    format(new Date(singleData.date), "yyyy/MM/dd")}
                </span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Store Name: </span>
                <span>{singleData.store_name}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Product Name: </span>
                <span>{singleData.product_name}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Quantity: </span>
                <span>{singleData.quantity}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Shipping Tracking: </span>
                <span className="text-[#8633FF] cursor-pointer">Click</span>
              </p>
            </div>

            <div className="w-1/2">
              <h3 className="text-2xl font-medium mb-6">Update</h3>
              <div className="flex flex-col mt-2">
                <label className=" font-bold mb-1">Resaleable Qnt</label>
                <input
                  type="number"
                  placeholder="Enter Resaleable Qnt"
                  className="border border-[#8633FF] outline-[#8633FF] py-2 pl-2 rounded text-xs"
                  id="resaleableQuantity"
                  name="resaleableQuantity"
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="flex flex-col mt-2">
                <label className=" font-bold mb-1">Remark</label>
                <input
                  type="text"
                  placeholder="Enter Remark"
                  className="border border-[#8633FF] outline-[#8633FF] py-2 pl-2 rounded text-xs "
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

              <button className="bg-[#8633FF] flex items-center gap-2 justify-center mt-5 w-full py-[6px] rounded text-white font-medium">
                {loading && <FaSpinner size={20} className="animate-spin" />}
                Update
              </button>
            </div>
          </form>
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
