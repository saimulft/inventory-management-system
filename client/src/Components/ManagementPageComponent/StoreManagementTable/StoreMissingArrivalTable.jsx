import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVerticalRounded, BiSolidEdit } from "react-icons/bi";
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

export default function StoreMissingArrivalTable() {
  const [activeTab, setActiveTab] = useState('active');
  const [singleData, setSingleData] = useState({})
  const [isEditable, setIsEditable] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState()
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { isSidebarOpen, setCountsRefetch } = useGlobal()
  const marginLeft = isSidebarOpen ? "18.5%" : "6%";
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredDataPage, setFilteredDataPage] = useState(0);

  const { data = [], refetch, isLoading } = useQuery({
    queryKey: ['missing_arrival_data'],
    queryFn: async () => {
      try {
        const res = await axios.post(`/api/v1/missing_arrival_api/get_all_missing_arrival_data?status=${activeTab}`,{user})
        if (res.status === 200) {
          setSearchResults([])
          setSearchText("")
          setSearchError("")
          return res.data.data;
        }
        return []
      } catch (error) {
        console.log(error)
        return []
      }
    }
  })

  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  const handleSearch = () => {
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
      setSearchError(`No data found for "${searchText}"`)
      return
    }
    setSearchResults(filteredData)
  }

  const handleDelete = (_id) => {
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
        axios.delete(`/api/v1/missing_arrival_api/delete_missing_arrival_data?id=${_id}`)
          .then(res => {
            if (res.status === 200) {
              refetch()
              setCountsRefetch(true)
              Swal.fire(
                'Deleted!',
                'A missing arrival entry has been deleted.',
                'success'
              )
            }
          })
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
    const upin = form.upin.value;
    const eda = form.eda.value;
    const missingStatus = form.missingStatus.value;
    const notes = form.notes.value;


    const updatedData = {
      product_name: productName,
      quantity: quantity,
      upin: upin,
      eda: eda ? new Date(eda).toISOString() : '',
      missing_status: missingStatus,
      notes: notes
    }

    if (singleData.missing_status === 'solved') {
      setLoading(false)
      setErrorMessage("Already solved, It cannot be changed again!")
      setTimeout(() => {
        setErrorMessage('')
      }, 2000);
      return;
    }

    if (!productName && !quantity && !upin && !eda && !missingStatus && !notes) {
      return setErrorMessage('No data entered')
    }

    axios.put(`/api/v1/missing_arrival_api/update_missing_arrival_data?id=${_id}`, updatedData)
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
  const itemsPerPage = 5;
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
  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">
        Missing Arrival Item: {data.length}
      </h3>
      <div className="relative flex justify-between items-center mt-4">
        <div className="flex text-center w-1/2 ">
          <div
            onClick={() => setActiveTab('active')}
            className={`px-3 rounded-s-md py-2 cursor-pointer ${activeTab === 'active'
              ? "bg-[#8633FF] text-white"
              : "border-2 border-[#8633FF] text-[#8633FF]"
              }  `}
          >
            Active
          </div>
          <div
            onClick={() => setActiveTab('solved')}
            className={`px-3 rounded-e-md py-2 cursor-pointer ${activeTab === 'solved'
              ? "bg-[#8633FF] text-white"
              : "border-2 border-[#8633FF] text-[#8633FF]"
              }  `}
          >
            Solved
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

      <div className="overflow-x-auto mt-8 min-h-[calc(100vh-294px)] max-h-full">
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
              <th>Expected Qnt.</th>
              <th>Receive Qnt.</th>
              <th>Missing Qnt.</th>
              <th>Supplier Tracking</th>
              <th>EDA</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="relative">
            {searchError ? <p className="text-red-500 text-xl my-16">{searchError}</p> : <>
              {
                searchResults.length ? displayedDataFilter.map((d, index) => {
                  return (
                    <tr
                      className={`${index % 2 == 1 && "bg-gray-200"}`}
                      key={index}>
                      <th>{format(new Date(d.date), 'yyyy/MM/dd')}</th>
                      <th className="font-normal">{d.store_name}</th>
                      <td>{d.asin_upc_code}</td>
                      <td>{d.code_type}</td>
                      <td>{d.product_name}</td>
                      <td>{d.order_id ? d.order_id : '-'}</td>
                      <td>{d.upin}</td>
                      <td>{d.quantity}</td>
                      <td>{d.received_quantity}</td>
                      <td>{d.missing_quantity}</td>
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
                              <button onClick={() => document.getElementById("my_modal_2").showModal()}>Edit</button>
                            </li>
                            <li>
                              <button onClick={() => handleDelete(d._id)}>Delete</button>
                            </li>
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
                        className={`${index % 2 == 1 && "bg-gray-200"}`}
                        key={index}>
                        <th>{format(new Date(d.date), 'yyyy/MM/dd')}</th>
                        <th className="font-normal">{d.store_name}</th>
                        <td>{d.asin_upc_code}</td>
                        <td>{d.code_type}</td>
                        <td>{d.product_name}</td>
                        <td>{d.order_id ? d.order_id : '-'}</td>
                        <td>{d.upin}</td>
                        <td>{d.quantity}</td>
                        <td>{d.received_quantity}</td>
                        <td>{d.missing_quantity}</td>
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
                                <button onClick={() => document.getElementById("my_modal_2").showModal()}>Edit</button>
                              </li>
                              <li>
                                <button onClick={() => handleDelete(d._id)}>Delete</button>
                              </li>
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
        {!isLoading && !searchError && !searchResults.length && data?.length > 5 && < div >
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
        {!isLoading && !searchError && searchResults.length > 5 && <ReactPaginate
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

      {/* modal content */}
      <dialog id="my_modal_2" className="modal">
        <div style={{ marginLeft, maxWidth: '750px' }} className="modal-box py-10 px-10">
          <form onSubmit={(event) => handleUpdate(event, singleData._id)} className="flex gap-10">
            <div className="w-1/2">
              <div className="flex items-center mb-6 gap-2">
                {user.role === 'Admin' || user.role === 'Admin VA' ? <BiSolidEdit onClick={() => setIsEditable(!isEditable)} size={24} className="cursor-pointer" /> : null}
                <h3 className="text-2xl font-medium">Details</h3>
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between'}`}>
                <label className="font-bold">Product Name: </label>
                <input type="text" defaultValue={singleData.product_name}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="productName" name="productName" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">Quantity: </label>
                <input type="text" defaultValue={singleData.quantity}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} py-1 pl-2 rounded`} id="quantity" name="quantity" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">UPIN: </label>
                <input type="text" defaultValue={singleData.upin}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none w-full'} py-1 pl-2 rounded`} id="upin" name="upin" readOnly={!isEditable} />
              </div>
              <div className={`flex items-center ${isEditable && 'justify-between mt-2'}`}>
                <label className="font-bold">EDA: </label>
                <input type={isEditable ? 'date' : 'text'} defaultValue={isEditable ? '' : singleData.eda && format(new Date(singleData.eda), 'yyyy/MM/dd')}
                  className={`${isEditable ? 'border border-[#8633FF] outline-[#8633FF] mt-1' : 'outline-none'} w-[191px] py-1 pl-2 rounded`} id="eda" name="eda" readOnly={!isEditable} />
              </div>
            </div>

            <div className="w-1/2">
              <h3 className="text-2xl font-medium mb-6">Update</h3>
              <div>
                <div className="flex flex-col mt-2">
                  <label className=" font-bold mb-1">Status</label>
                  <select
                    className="border border-[#8633FF] outline-[#8633FF] py-2 text-xs pl-2 rounded"
                    id="missingStatus"
                    name="missingStatus"
                  >
                    <option defaultValue="Select Status">
                      Select Status
                    </option>
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
    </div>
  );
} 0