import { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import Loading from "../../Shared/Loading";
import ReactPaginate from "react-paginate";
import useGlobal from "../../../hooks/useGlobal";
import { NotificationContext } from "../../../Providers/NotificationProvider";
import { GlobalContext } from "../../../Providers/GlobalProviders";
import { useLocation } from "react-router-dom";

export default function InventoryMissingArrivalTable() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const notificationSearchValue = queryParams.get("notification_search");
  const missingArrivalStatus = queryParams.get("missing_arrival_status");

  const { socket } = useContext(GlobalContext);
  const { currentUser } = useContext(NotificationContext);
  const [activeTab, setActiveTab] = useState('active');
  console.log("🚀 ~ file: InventoryMissingArrivalTable.jsx:28 ~ InventoryMissingArrivalTable ~ activeTab:", activeTab)

  useEffect(() => {
    if (!missingArrivalStatus || missingArrivalStatus == "active") {
      setActiveTab("active")
    }
    if (missingArrivalStatus == "solved") {
      setActiveTab("solved")
    }
  }, [missingArrivalStatus])

  const [singleData, setSingleData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { isSidebarOpen, setCountsRefetch } = useGlobal();
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredDataPage, setFilteredDataPage] = useState(0);

  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["missing_arrival_data"],
    queryFn: async () => {
      try {
        const res = await axios.post(
          `/api/v1/missing_arrival_api/get_all_missing_arrival_data?status=${activeTab}`,
          { user }
        );
        if (res.status === 200) {
          setSearchResults([]);
          setSearchText("");
          setSearchError("");
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

  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

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
      setSearchError(`No data found for "${searchText}"`);
      return;
    }
    setSearchResults(filteredData);
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
            `/api/v1/missing_arrival_api/delete_missing_arrival_data?id=${_id}`
          )
          .then((res) => {
            if (res.status === 200) {
              const notification_link =
                "/dashboard/management/store/missing-arrival";
              const notification_search = [res.data?.result?.insertedId];
              const status = "A missing arrival entry has been deleted.";
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
              refetch();
              setCountsRefetch(true);
              Swal.fire(
                "Deleted!",
                "A missing arrival entry has been deleted.",
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
    const missingStatus = form.missingStatus.value;
    const notes = form.notes.value;

    const updatedData = {
      missing_status: missingStatus,
      notes: notes,
    };

    if (singleData.missing_status === "solved") {
      setLoading(false);
      setErrorMessage("Already solved, It cannot be changed again!");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    if (singleData.missing_status === "active" && missingStatus === "active") {
      setLoading(false);
      setErrorMessage("This missing arrival status already active!");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    if (missingStatus === "Select Status" && !notes) {
      setLoading(false);
      return setErrorMessage("No data entered");
    }

    axios
      .put(
        `/api/v1/missing_arrival_api/update_missing_arrival_data?id=${data?._id}`,
        updatedData
      )
      .then((res) => {
        if (res.status === 200) {
          const notification_link =
            "/dashboard/management/store/missing-arrival";
          const notification_search = [data?._id];
          const status = "Solved missing arrival item.";
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

  const itemsPerPage = 15;
  const maxVisiblePages = 10; // Adjust the number of maximum visible pages as needed

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
        Missing Arrival Item
        <span className={`${notificationSearchValue && "hidden"}`}>
          : {data.length}
        </span>
      </h3>
      <div className="relative flex justify-between items-center mt-4">
        <div className="flex text-center w-1/2 ">
          <div
            onClick={() => {
              setActiveTab("active");
            }}
            className={`px-3 rounded-s-md py-2 cursor-pointer ${activeTab === "active"
              ? "bg-[#8633FF] text-white"
              : "border-2 border-[#8633FF] text-[#8633FF]"
              }  `}
          >
            Active
          </div>
          <div
            onClick={() => {
              setActiveTab("solved");
            }}
            className={`px-3 rounded-e-md py-2 cursor-pointer ${activeTab === "solved"
              ? "bg-[#8633FF] text-white"
              : "border-2 border-[#8633FF] text-[#8633FF]"
              }  `}
          >
            Solved
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
                }}
                className="py-[6px] px-4 bg-[#8633FF] text-white rounded"
              >
                Clear
              </button>
            </div>
          </form>
        )}
      </div>

      <div className=" mt-8 min-h-[calc(100vh-294px)] max-h-full">
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
              <th>Expected Qnt.</th>
              <th>Receive Qnt.</th>
              <th>Missing Qnt.</th>
              <th>Supplier Tracking</th>
              <th>EDA</th>
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
                        {/* <th>{format(new Date(d.date), 'yyyy/MM/dd')}</th> */}
                        <th className="font-normal">{d.store_name}</th>
                        <td>{d.asin_upc_code}</td>
                        <td>{d.code_type}</td>
                        <td>{d.product_name}</td>
                        <td>{d.supplier_id}</td>
                        <td>{d.upin}</td>
                        <td>{d.quantity}</td>
                        <td>{d.received_quantity}</td>
                        <td>{d.missing_quantity}</td>
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
                ) : !notificationSearchValue ? (
                  isLoading ? (
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
                          <td>{d.quantity}</td>
                          <td>{d.received_quantity}</td>
                          <td>{d.missing_quantity}</td>
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
                  )
                ) : (
                  (notificationSearchData && <tr>
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
                    <td>{notificationSearchData?.supplier_id}</td>
                    <td>{notificationSearchData?.upin}</td>
                    <td>{notificationSearchData?.quantity}</td>
                    <td>{notificationSearchData?.received_quantity}</td>
                    <td>{notificationSearchData?.missing_quantity}</td>
                    <td>
                      {notificationSearchData?.supplier_tracking
                        ? notificationSearchData?.supplier_tracking
                        : "-"}
                    </td>
                    <td>
                      {notificationSearchData?.eda &&
                        format(
                          new Date(notificationSearchData?.eda),
                          "yyyy/MM/dd"
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
                  </tr>)
                )}
              </>
            )}
          </tbody>
        </table>

        {/* pagination */}
        {!notificationSearchValue && !isLoading &&
          !searchError &&
          !searchResults.length &&
          data?.length > 15 && !notificationSearchValue && (
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

      {/* modal content */}
      <dialog id="my_modal_2" className="modal">
        <div
          style={{ marginLeft, maxWidth: "450px" }}
          className="modal-box py-10 px-10"
        >
          <form
            onSubmit={(event) => handleUpdate(event, singleData)}
            className="flex gap-10"
          >
            <div className="w-full">
              <h3 className="text-2xl font-medium mb-6">Update</h3>
              <div>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Status</label>
                  <select
                    className="border border-[#8633FF] outline-[#8633FF] py-2 text-xs pl-2 rounded"
                    id="missingStatus"
                    name="missingStatus"
                  >
                    <option defaultValue="Select Status">Select Status</option>
                    <option value="active">Active</option>
                    <option value="solved">Solved</option>
                  </select>
                </div>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Note</label>
                  <input
                    type="text"
                    placeholder="Enter Note"
                    className="border border-[#8633FF] outline-[#8633FF] py-2 text-xs pl-2 rounded"
                    id="notes"
                    name="notes"
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
    </div>
  );
}
