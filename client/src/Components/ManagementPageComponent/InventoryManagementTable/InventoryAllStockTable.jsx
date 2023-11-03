import { AiOutlineSearch } from "react-icons/ai";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../Shared/Loading";
import { useState } from "react";
import ReactPaginate from "react-paginate";

export default function InventoryAllStockTable() {
  const { user } = useAuth()
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredDataPage, setFilteredDataPage] = useState(0);

  const { data = [], isLoading } = useQuery({
    queryKey: ['all_stock_data'],
    queryFn: async () => {
      try {
        const res = await axios.post('/api/v1/all_stock_api/get_all_stock_data', {user})
        if (res.status === 200) {
          return res.data.data;
        }
        return []
      } catch (error) {
        console.log(error)
        return []
      }
    }
  })
  const handleSearch = () => {
    setSearchError("")
    if (!searchText) {
      return
    }
    const filteredData = data.filter(item =>
    (
      item.product_name?.toLowerCase().includes(searchText) ||
      item.store_name?.toLowerCase().includes(searchText) ||
      item.upin?.toLowerCase().includes(searchText))
    );
    if (!filteredData.length) {
      setSearchError(`No data found for "${searchText}"`)
      return
    }
    setSearchResults(filteredData)
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
  const itemsPerPage = 5;
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
  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">All Stocks</h3>

      <div className="relative flex justify-end mt-4">
        <div className="w-1/4  flex items-center justify-between">
          <input
            className="border bg-white shadow-md border-[#8633FF] outline-none w-[60%]   py-2 rounded-md px-2 text-sm"
            placeholder="Search Here"
            value={searchText}
            type="text"
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
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

      <div className="overflow-x-auto mt-8 min-h-[calc(100vh-288px)] max-h-full">
        <table className="table table-sm">
          <thead>
            <tr className="bg-gray-200">
              <th>Store Name</th>
              <th>UPIN</th>
              <th>Product Name</th>
              <th>Total Received</th>
              <th>Total Sold</th>
              <th>Stock</th>
              <th>Purchase Price</th>
              <th>Sold Price</th>
              <th>Remaining Price</th>
            </tr>
          </thead>
          <tbody className="relative">
            {searchError ? <p className="text-red-500 text-xl my-16">{searchError}</p> : <>
              {
                searchResults.length ? displayedDataFilter.map((d, index) => {
                  return (
                    <tr
                      className={`${index % 2 == 1 && "bg-gray-200"}`}
                      key={index}
                    >
                      <th>{d.store_name}</th>
                      <td>{d.upin}</td>
                      <td>{d.product_name}</td>
                      <td>{d.received_quantity}</td>
                      <td>{d.total_sold ? `${d.total_sold}` : '-'}</td>
                      <td>{d.stock}</td>
                      <td>${d.unit_price}</td>
                      <td>{d.sold_price ? `$${d.sold_price}` : '-'}</td>
                      <td>{d.remaining_price ? `$${d.remaining_price}` : '-'}</td>
                    </tr>
                  )
                })

                  :

                  isLoading ? <Loading /> : displayAllData?.map((d, index) => {
                    return (
                      <tr
                        className={`${index % 2 == 1 && "bg-gray-200"}`}
                        key={index}
                      >
                        <th>{d.store_name}</th>
                        <td>{d.upin}</td>
                        <td>{d.product_name}</td>
                        <td>{d.received_quantity}</td>
                        <td>{d.total_sold ? `${d.total_sold}` : '-'}</td>
                        <td>{d.stock}</td>
                        <td>${d.unit_price}</td>
                        <td>{d.sold_price ? `$${d.sold_price}` : '-'}</td>
                        <td>{d.remaining_price ? `$${d.remaining_price}` : '-'}</td>
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
    </div>
  );
}
