import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import FileDownload from "../../Shared/FileDownload";
import { useState } from "react";
import Loading from "../../Shared/Loading";
import ReactPaginate from "react-paginate";
import { DateRange } from "react-date-range";
import { FiCheckCircle } from "react-icons/fi";
import Swal from "sweetalert2";
import useGlobal from "../../../hooks/useGlobal";

export default function InventoryReadyToShipTable() {
  // const [RTSdata ,setRTSdata] = useState({})
  const { user } = useAuth()
  const [filterDays, setFilterDays] = useState('')
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredDataPage, setFilteredDataPage] = useState(0);
  const { isSidebarOpen, setCountsRefetch } = useGlobal()
  const [rangeDate, setRangeDate] = useState([{
    startDate: new Date(),
    endDate: new Date(),  //addDays(new Date(), 7)
    key: 'selection'
  }]);

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['ready_to_ship_data'],
    queryFn: async () => {
      try {
        const res = await axios.post(`/api/v1/ready_to_ship_api/get_all_RTS_data`, { user })
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
  const handleShipment = (_id) => {
    Swal.fire({
      title: 'Confirm complete shipment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8633FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/v1/shipped_api/shipped?id=${_id}`)
          .then(res => {
            if (res.status === 200) {
              Swal.fire(
                'Shipped!',
                'Completed shipment.',
                'success'
              )
              refetch()
              setCountsRefetch(true)
            }
          }).catch(err => console.log(err))
      }
    })
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
  const handleCustomDateSearch = () => {
    setSearchError("")
    const startDate = rangeDate[0].startDate
    const endDate = rangeDate[0].endDate
    if (startDate !== endDate) {
      const filteredDateResults = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      console.log(filteredDateResults)
      if (!filteredDateResults.length) {

        return setSearchError(`No data found for selected date range`)
      }
      if (filteredDateResults.length) {
        setSearchResults(filteredDateResults);
      }
    }

  }

  function generatePageNumbers(currentPage, pageCount, maxVisiblePages) {
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
  function generatePageNumbersFilter(currentPage, pageCount, maxVisiblePages) {
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
  const displayedDataFilter = searchResults.slice(startIndexFilter, endIndexFilter);


  //  ALl data pagination calculation
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayAllData = data.slice(startIndex, endIndex);
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";
  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">
        Ready to ship : {data?.length}
      </h3>

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
            {searchError ? <p className="absolute top-[260px] flex items-center justify-center w-full text-rose-500 text-xl font-medium">{searchError}</p> : <>
              {
                searchResults.length ? displayedDataFilter.map((d, index) => {
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
                      <td>{d.shipping_file && <FileDownload fileName={d.shipping_file} />}</td>
                      <td className="flex gap-2">
                        <button onClick={() => {
                          handleShipment(d._id)
                        }} className="text-xs border border-[#8633FF] px-2 rounded-[3px] flex items-center gap-1 hover:bg-[#8633FF] transition whitespace-nowrap py-1 hover:text-white text-[#8633FF]">
                          <FiCheckCircle />
                          <p>Complete Shipment</p>
                        </button>
                      </td>
                    </tr>
                  )
                })

                  :

                  isLoading ? <Loading /> : displayAllData?.map((d, index) => {
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
                        <td>{d.shipping_file && <FileDownload fileName={d.shipping_file} />}</td>
                        <td className="flex gap-2">
                          <button onClick={() => {
                            handleShipment(d._id)
                          }} className="text-xs border border-[#8633FF] px-2 rounded-[3px] flex items-center gap-1 hover:bg-[#8633FF] transition whitespace-nowrap py-1 hover:text-white text-[#8633FF]">
                            <FiCheckCircle />
                            <p>Complete Shipment</p>
                          </button>
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
      {/* date range modal */}
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
