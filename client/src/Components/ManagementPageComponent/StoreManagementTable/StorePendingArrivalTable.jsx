<<<<<<< HEAD
import { useContext, useState } from "react";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
import { LiaGreaterThanSolid } from "react-icons/lia";
import { GlobalContext } from "../../../Providers/GlobalProviders";
=======
import { useState } from "react";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
>>>>>>> 2e9db3508a05cd7365c8a78178db439779237df8
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { format } from 'date-fns'
import Swal from "sweetalert2";
<<<<<<< HEAD

export default function StorePendingArrivalTable() {
  const [singleData, setSingleData] = useState({})
  const { user } = useAuth()
  const { isSidebarOpen } = useContext(GlobalContext);
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";

  const { data = [], refetch } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/pending_arrival_api/get_all_pending_arrival_data?admin_id=${user.admin_id}`)
        if (res.status === 200) {
          return res.data.data;
        }
      } catch (error) {
        console.log(error)
=======
import { BsCheck2Circle } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import Loading from "../../Shared/Loading";
import ReactPaginate from "react-paginate";
import { DateRange } from "react-date-range";
import useGlobal from "../../../hooks/useGlobal";

export default function StorePendingArrivalTable() {
  const [singleData, setSingleData] = useState({})
  const [isEditable, setIsEditable] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState()
  const { user } = useAuth()
  const { isSidebarOpen, setCountsRefetch } = useGlobal()
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";
  const [filterDays, setFilterDays] = useState('')
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredDataPage, setFilteredDataPage] = useState(0);
  const [rangeDate, setRangeDate] = useState([{
    startDate: new Date(),
    endDate: new Date(),  //addDays(new Date(), 7)
    key: 'selection'
  }]);

  const handleKeyDown = (event) => {
    const alphabetKeys = /^[0-9\b]+$/; // regex pattern to match alphabet keys
    if (!alphabetKeys.test(event.key) && event.key != "Backspace") {
      event.preventDefault();
    }
  };

  const { data = [], refetch, isLoading } = useQuery({
    queryKey: ['pending_arrival_data'],
    queryFn: async () => {
      try {
        const res = await axios.post('/api/v1/pending_arrival_api/get_all_pending_arrival_data', { user })
        if (res.status === 200) {
          return res.data.data;
        }
        return []
      } catch (error) {
        console.log(error)
        return []
>>>>>>> 2e9db3508a05cd7365c8a78178db439779237df8
      }
    }
  })

<<<<<<< HEAD
=======
  const handleSearch = (e) => {
    e.preventDefault()
    setSearchError("")
    if (!searchText) {
      return
    }
    const filteredData = data.filter(item =>
    (item.asin_upc_code?.toLowerCase().includes(searchText) ||
      item.product_name?.toLowerCase().includes(searchText) ||
      item.store_name?.toLowerCase().includes(searchText) ||
      item.upin?.toLowerCase().includes(searchText) ||
      item.code_type?.toLowerCase().includes(searchText))
    );
    if (!filteredData.length) {
      setFilterDays(null)
      setSearchError(`No data found for "${searchText}"`)
      return
    }
    setFilterDays(null)
    setSearchResults(filteredData)
  }

  const handleCustomDateSearch = () => {
    setSearchError("")
    const startDate = rangeDate[0].startDate
    const endDate = rangeDate[0].endDate
    if (startDate !== endDate) {
        const filteredDateResults = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });

      if (!filteredDateResults.length) {
        return setSearchError(`No data found for selected date range`)
      }
      if (filteredDateResults.length) {
        setSearchResults(filteredDateResults);
      }
    }

  }

  const handleDateSearch = (day) => {
    setSearchError("")
    const currentDate = new Date();
    const endDate = new Date();
    let startDate;


    if (day === "today") {
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0); // Set to midnight
    }
    else {
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
  }

>>>>>>> 2e9db3508a05cd7365c8a78178db439779237df8
  const handleDelete = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8633FF',
      cancelButtonColor: '#d33',
<<<<<<< HEAD
      confirmButtonText: 'Yes, delete it!'
=======
      confirmButtonText: 'Delete'
>>>>>>> 2e9db3508a05cd7365c8a78178db439779237df8
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/v1/pending_arrival_api/delete_pending_arrival_data?id=${_id}`)
          .then(res => {
<<<<<<< HEAD
            console.log(res)
            if (res.status === 200) {
              refetch()
=======
            if (res.status === 200) {
              refetch()
              setCountsRefetch(true)
>>>>>>> 2e9db3508a05cd7365c8a78178db439779237df8
              Swal.fire(
                'Deleted!',
                'A pending arrival entry has been deleted.',
                'success'
              )
            }
          })
<<<<<<< HEAD
      }
    })
  }
=======
          .catch(error => console.log(error))
      }
    })
  }

  const handleUpdate = (event, _id) => {
    event.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    const form = event.target;
    const productName = form.productName.value;
    const quantity = form.quantity.value;
    const eda = form.eda.value;
    const courier = form.courier.value;
    const supplierTracking = form.supplierTracking.value;


    const updatedData = {
      product_name: productName,
      quantity: quantity,
      eda: eda ? new Date(eda).toISOString() : '',
      courier: courier,
      supplier_tracking: supplierTracking
    }

    if (!productName && !quantity && !eda && !courier && !supplierTracking) {
      return setErrorMessage('No data entered')
    }

    axios.put(`/api/v1/pending_arrival_api/update_store_pending_arrival_data?id=${_id}`, updatedData)
      .then(res => {
        if (res.status === 200) {
          setLoading(false)
          form.reset()
          refetch()
          setCountsRefetch(true)
          setSuccessMessage('Data update successful!')
          setTimeout(() => {
            setSuccessMessage('')
          }, 2000);
        }

        if (res.status === 203) {
          setLoading(false)
        }
      })
      .catch(error => {
        setLoading(false)
        setErrorMessage('Something went wrong while updating data!')

        setTimeout(() => {
          setErrorMessage('')
        }, 2000);
        console.log(error)
      })
  }
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
  }
  const generatePageNumbersFilter = (currentPage, pageCount, maxVisiblePages) => {
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
  }
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
  const displayedDataFilter = searchResults.slice(startIndexFilter, endIndexFilter);


  //  ALl data pagination calculation
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayAllData = data.slice(startIndex, endIndex);


>>>>>>> 2e9db3508a05cd7365c8a78178db439779237df8

  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">Pending Arrival: {data.length}</h3>

<<<<<<< HEAD
      <div className="overflow-x-auto mt-8">
=======
      <div className="relative flex justify-between items-center mt-4">
        <div>
          <div className="flex gap-4 text-sm items-center">
            <p onClick={() => {
              setSearchResults([])
              setSearchText("")
              setSearchError("")
              setFilterDays("all")
            }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 'all' && 'bg-[#8633FF] text-white'}`}>
              All
            </p>
            <p onClick={() => {
              handleDateSearch("today")
              setFilterDays('today')
            }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 'today' && 'bg-[#8633FF] text-white'}`}>
              Today
            </p>
            <p onClick={() => {
              handleDateSearch(7)
              setFilterDays(7)
            }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 7 && 'bg-[#8633FF] text-white'}`}>
              7 Days
            </p>
            <p onClick={() => {
              handleDateSearch(15)
              setFilterDays(15)
            }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 15 && 'bg-[#8633FF] text-white'}`}>
              15 Days
            </p>
            <p onClick={() => {
              handleDateSearch(30)
              setFilterDays(1)
            }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 1 && 'bg-[#8633FF] text-white'}`}>
              1 Month
            </p>
            <p onClick={() => {
              handleDateSearch(365)
              setFilterDays('year')
            }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 'year' && 'bg-[#8633FF] text-white'}`}>
              Year
            </p>
            <p onClick={() => {
              setFilterDays('custom')
              document.getElementById("date_range_modal").showModal()
            }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${filterDays === 'custom' && 'bg-[#8633FF] text-white'}`}>
              Custom
            </p>
          </div>
        </div>
        <form onSubmit={handleSearch} className="w-1/4  flex items-center justify-between">
          <input
            className="border bg-white shadow-md border-[#8633FF] outline-none w-[60%]   py-2 rounded-md px-2 text-sm"
            placeholder="Search Here"
            value={searchText}
            type="text"
            onChange={(e) => setSearchText(e.target.value.toLocaleLowerCase())}
          />
          <div className="w-[40%] flex items-center justify-evenly">
            <button type="submit" onClick={handleSearch} className="py-[6px] px-4 bg-[#8633FF] text-white rounded">
              <AiOutlineSearch size={24} />
            </button>
            <button onClick={() => {
              setSearchResults([])
              setSearchText("")
              setSearchError("")
              setFilterDays("all")
            }} className="py-[6px] px-4 bg-[#8633FF] text-white rounded">
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto mt-8 min-h-[calc(100vh-288px)] max-h-full">
>>>>>>> 2e9db3508a05cd7365c8a78178db439779237df8
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
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Courier</th>
              <th>Supplier Tracking</th>
              <th>EDA</th>
              <th></th>
            </tr>
          </thead>
<<<<<<< HEAD
          <tbody>
            {data?.map((d, index) => {
              return (
                <tr
                  className={`${index % 2 == 1 && "bg-gray-200"}`}
                  key={index}
                >
                  <th>{format(new Date(d.date), 'yyyy/MM/dd')}</th>
                  <th className="font-normal">{d.store_name}</th>
                  <td>{d.asin_upc_code}</td>
                  <td>{d.code_type}</td>
                  <td>{d.product_name}</td>
                  <td>{d.order_ID ? d.order_ID : '-'}</td>
                  <td>{d.upin}</td>
                  <td>{d.unit_price}</td>
                  <td>{d.quantity}</td>
                  <td>{d.courier ? d.courier : '-'}</td>
                  <td>{d.supplier_tracking ? d.supplier_tracking : '-'}</td>
                  <td>{format(new Date(d.eda), 'yyyy/MM/dd')}</td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0}>
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
                          <button onClick={() => handleDelete(d._id)}>Delete</button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* pagination  */}
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
=======
          <tbody className="relative">
            {searchError ? <p className="absolute top-[260px] flex items-center justify-center w-full text-rose-500 text-xl font-medium">{searchError}</p> : <>
              {
                searchResults.length ? displayedDataFilter.map((d, index) => {
                  return (
                    <tr
                      className={`${index % 2 == 1 && ""}`}
                      key={index}
                    >
                      <th>{format(new Date(d.date), 'yyyy/MM/dd')}</th>
                      <th className="font-normal">{d.store_name}</th>
                      <td>{d.asin_upc_code}</td>
                      <td>{d.code_type}</td>
                      <td>{d.product_name}</td>
                      <td>{d.order_id ? d.order_id : '-'}</td>
                      <td>{d.upin}</td>
                      <td>{d.unit_price}</td>
                      <td>{d.quantity}</td>
                      <td>{d.courier ? d.courier : '-'}</td>
                      <td>{d.supplier_tracking ? d.supplier_tracking : '-'}</td>
                      <td>{format(new Date(d.eda), 'yyyy/MM/dd')}</td>
                      <td>
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0}>
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
                            {
                              user.role === 'Admin' || user.role === 'Admin VA' ? <li>
                                <button onClick={() => handleDelete(d._id)}>Delete</button>
                              </li> : ''
                            }
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )
                })

                  :

                  isLoading ? <Loading /> : displayAllData?.map((d, index) => {
                    return (
                      <tr
                        className={`${index % 2 == 1 && ""}`}
                        key={index}
                      >
                        <th>{format(new Date(d.date), 'yyyy/MM/dd')}</th>
                        <th className="font-normal">{d.store_name}</th>
                        <td>{d.asin_upc_code}</td>
                        <td>{d.code_type}</td>
                        <td>{d.product_name}</td>
                        <td>{d.order_id ? d.order_id : '-'}</td>
                        <td>{d.upin}</td>
                        <td>{d.unit_price}</td>
                        <td>{d.quantity}</td>
                        <td>{d.courier ? d.courier : '-'}</td>
                        <td>{d.supplier_tracking ? d.supplier_tracking : '-'}</td>
                        <td>{format(new Date(d.eda), 'yyyy/MM/dd')}</td>
                        <td>
                          <div className="dropdown dropdown-end">
                            <label tabIndex={0}>
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
                              {
                                user.role === 'Admin' || user.role === 'Admin VA' ? <li>
                                  <button onClick={() => handleDelete(d._id)}>Delete</button>
                                </li> : ''
                              }
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </>}
          </tbody>
        </table>

        {/* pagination */}
        {!isLoading && !searchError && !searchResults.length && data?.length > 15 && < div >
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
>>>>>>> 2e9db3508a05cd7365c8a78178db439779237df8
        </div>
        }
        {!isLoading && !searchError && searchResults.length > 15 && <ReactPaginate
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
        />}
      </div>

      {/* modal content  */}
      <dialog id="my_modal_2" className="modal">
        <div style={{ marginLeft, maxWidth: '750px' }} className="modal-box py-10 px-10">
          <form onSubmit={(event) => handleUpdate(event, singleData._id)} className="flex gap-10">
            <div className="w-1/2">
              <div className="flex items-center mb-6 gap-2">
                {user.role === 'Admin' || user.role === 'Admin VA' ? <BiSolidEdit onClick={() => setIsEditable(!isEditable)} size={24} className="cursor-pointer" /> : null}
                <h3 className="text-2xl font-medium">Details</h3>
              </div>
<<<<<<< HEAD
              <p className="mt-2">
                <span className="font-bold">Date: </span>
                <span>{singleData.date && format(new Date(singleData.date), 'yyyy/MM/dd')}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Store Name: </span>
                <span>{singleData.store_name}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">ASIN: </span>
                <span>{singleData.asin_upc_code}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Quantity: </span>
                <span>{singleData.quantity}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Received Qnt: </span>
                <span>{singleData.received_quantity ? singleData.received_quantity : 'null'}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Missing Qnt: </span>
                <span>{singleData.missing_quantity ? singleData.missing_quantity : 'null'}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Courier: </span>
                <span>{singleData.courier ? singleData.courier : 'null'}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Team Code: </span>
                <span>{singleData.team_code ? singleData.team_code : 'null'}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Product Name: </span>
                <span>{singleData.product_name}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">EDA: </span>
                <span>{singleData.eda && format(new Date(singleData.eda), 'yyyy/MM/dd')}</span>
              </p>
              <p className="mt-2">
                <span className="font-bold">Supplier Tracking: </span>
                <span>{singleData.supplier_tracking ? singleData.supplier_tracking : 'Not Added'}</span>
              </p>
=======
              <div className={`flex items-center ${isEditable && 'justify-between'}`}>
                <label className="font-bold">Product Name: </label>
                <input type="text" defaultValue={singleData.product_name}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="productName" name="productName" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">Quantity: </label>
                <input onKeyDown={handleKeyDown} type="text" defaultValue={singleData.quantity}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="quantity" name="quantity" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">EDA: </label>
                <input type={isEditable ? 'date' : 'text'} defaultValue={isEditable ? '' : singleData.eda && format(new Date(singleData.eda), 'yyyy/MM/dd')}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} w-[191px] py-1 pl-2 rounded`} id="eda" name="eda" readOnly={!isEditable} />
              </div>
>>>>>>> 2e9db3508a05cd7365c8a78178db439779237df8
            </div>

            <div className="w-1/2">
              <h3 className="text-2xl font-medium mb-6">Update</h3>
              <div>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Courier</label>
                  <select
                    className="border border-[#8633FF] outline-[#8633FF] py-1 pl-2 rounded"
                    id="courier"
                    name="courier"
                  >
                    <option defaultValue="Select Courier">
                      Select Courier
                    </option>
                    <option value="Courier-1">Courier-1</option>
                    <option value="Courier-2">Courier-2</option>
                    <option value="Courier-3">Courier-3</option>
                  </select>
                </div>
                <div className="flex flex-col mt-2">
                  <label className="font-bold mb-1">Supplier Tracking</label>
                  <input
                    type="text"
                    placeholder="Supplier Tracking"
                    className="border border-[#8633FF] outline-[#8633FF] py-1 pl-2 rounded"
                    id="supplierTracking"
                    name="supplierTracking"
                  />
                </div>

                <div className="mt-3">
                  {successMessage && <p className="w-full flex gap-2 items-center justify-center text-center text-sm font-medium text-green-600 bg-green-100 border py-1 px-4 rounded"><BsCheck2Circle size={20} /> {successMessage}</p>}

                  {errorMessage && <p className="w-full flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-1 px-4 rounded"><MdErrorOutline size={20} /> {errorMessage}</p>}
                </div>

                <button type="submit" className="bg-[#8633FF] flex gap-2 items-center justify-center mt-5 w-full py-[6px] rounded text-white font-medium">
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
        <div style={{ marginLeft, maxWidth: '750px' }} className="modal-box">
          <div className='mb-10'>
            <DateRange
              editableDateInputs={true}
              onChange={item => {

                setRangeDate([item.selection])
              }}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={rangeDate}
              direction="horizontal"
              rangeColors={["#8633FF"]}
              color="#8633FF"
            />
          </div>
          <button onClick={() => {
            handleCustomDateSearch()
            document.getElementById("date_range_modal").close()
          }} className="block mx-auto bg-[#8633FF] text-white px-10 py-2 rounded">Select</button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
