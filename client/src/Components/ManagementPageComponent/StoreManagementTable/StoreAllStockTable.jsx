import { AiOutlineSearch } from "react-icons/ai";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../Shared/Loading";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { useLocation } from "react-router-dom";

export default function StoreAllStockTable() {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredDataPage, setFilteredDataPage] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const notificationSearchValue = queryParams.get("notification_search");
  const { data = [], isLoading } = useQuery({
    queryKey: ["all_stock_data"],
    queryFn: async () => {
      try {
        const res = await axios.post(
          "/api/v1/all_stock_api/get_all_stock_data",
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
        item.product_name?.toLowerCase().includes(searchText) ||
        item.store_name?.toLowerCase().includes(searchText) ||
        item.upin?.toLowerCase().includes(searchText)
    );
    if (!filteredData.length) {
      setSearchError(`No data found for "${searchText}"`);
      return;
    }
    setSearchResults(filteredData);
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

  return (
    <div className="px-8 py-12">
      <h3 className="text-center text-2xl font-medium">
        All Stocks
        <span className={`${notificationSearchValue && "hidden"}`}>
          : {searchError ? 0 : searchResults?.length ? searchResults?.length : data?.length}
        </span>
      </h3>

      {!notificationSearchValue && (
        <div className="relative flex justify-end mt-4">
          <form
            onSubmit={handleSearch}
            className="w-1/4  flex items-center justify-between"
          >
            <input
              className="border bg-white shadow-md border-[#8633FF] outline-none w-[60%]   py-2 rounded-md px-2 text-sm"
              placeholder="Search Here"
              value={searchText}
              type="text"
              onChange={(e) => setSearchText(e.target.value.toLowerCase())}
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
        </div>
      )}

      <div className="mt-8 min-h-[calc(100vh-288px)] max-h-full">
        <div className={`overflow-x-auto overflow-y-hidden ${(searchError || isLoading) ? 'h-[calc(100vh-288px)]' : 'h-full'}`}>
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
              {searchError ? (
                <p className="absolute top-[260px] flex items-center justify-center w-full text-rose-500 text-xl font-medium">
                  {searchError}
                </p>
              ) : (
                <>
                  {notificationSearchData == undefined &&
                    notificationSearchValue && (
                      <p className="absolute top-[260px] flex items-center justify-center w-full text-rose-500 text-xl font-medium">
                        Data move to the next sequence!
                      </p>
                    )}

                  {searchResults.length ? (
                    displayedDataFilter.map((d, index) => {
                      return (
                        <tr className={`${index % 2 == 1 && ""}`} key={index}>
                          <th>{d.store_name}</th>
                          <td>{d.upin}</td>
                          <td>{d.product_name}</td>
                          <td>{d.received_quantity}</td>
                          <td>{d.total_sold ? `${d.total_sold}` : "-"}</td>
                          <td>{d.stock}</td>
                          <td>${d.unit_price}</td>
                          <td>{d.sold_price ? `$${d.sold_price}` : "-"}</td>
                          <td>
                            {d.remaining_price ? `$${d.remaining_price}` : "-"}
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
                            <th>{d.store_name}</th>
                            <td>{d.upin}</td>
                            <td>{d.product_name}</td>
                            <td>{d.received_quantity}</td>
                            <td>{d.total_sold ? `${d.total_sold}` : "-"}</td>
                            <td>{d.stock}</td>
                            <td>${d.unit_price}</td>
                            <td>{d.sold_price ? `$${d.sold_price}` : "-"}</td>
                            <td>
                              {d.remaining_price ? `$${d.remaining_price}` : "-"}
                            </td>
                          </tr>
                        );
                      })
                    )
                  ) : (
                    <tr>
                      <th>{notificationSearchData?.store_name}</th>
                      <td>{notificationSearchData?.upin}</td>
                      <td>{notificationSearchData?.product_name}</td>
                      <td>{notificationSearchData?.received_quantity}</td>
                      <td>
                        {notificationSearchData?.total_sold
                          ? `${notificationSearchData?.total_sold}`
                          : "-"}
                      </td>
                      <td>{notificationSearchData?.stock}</td>
                      <td>${notificationSearchData?.unit_price}</td>
                      <td>
                        {notificationSearchData?.sold_price
                          ? `$${notificationSearchData?.sold_price}`
                          : "-"}
                      </td>
                      <td>
                        {notificationSearchData?.remaining_price
                          ? `$${notificationSearchData?.remaining_price}`
                          : "-"}
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
    </div>
  );
}
