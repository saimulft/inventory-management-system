import { useEffect, useState } from "react";
import { BiEdit, BiSolidFoodMenu, BiTable } from "react-icons/bi";
import { BsFileBarGraphFill, BsGraphUp } from "react-icons/bs";
import { AiTwotoneTag } from "react-icons/ai";
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart, LineChart, Line } from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import Loading2 from "../Components/Shared/Loading2";
import { FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";


const ProfitTrackerStatsPage = () => {
    const [analyticsDays, setAnalyticsDays] = useState(1)
    const [analyticsDaysTable, setAnalyticsDaysTable] = useState("all")
    const [view, setView] = useState('Graph')
    const [storeName, setStoreName] = useState('')
    const [storeData, setStoreData] = useState([])
    const [initialLoading, setInitialLoading] = useState(false)
    const [isRefetch, setIsRefetch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [searchError, setSearchError] = useState('');
    const { id } = useParams()
    const [totalOrder, setTotalOrder] = useState(null)
    const [updateData, setUpdateData] = useState(null)
    const [refetchData, setRefetchData] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [syncLoading, setSyncLoading] = useState(false)
    const [localData, setLocalData] = useState([])
    const [allStockData, setAllStockData] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [lastSync, setLastSync] = useState(null)

    useEffect(() => {
        setInitialLoading(true)
        axios.get(`/api/v1/profit_tracker_api/single_store_data?storeId=${id}`)
            .then(res => {
                if (res.status === 200) {
                    setInitialLoading(false)
                    setAllStockData(res.data.allStockData)
                    setStoreName(res.data.store_name)
                    if (res.data?.last_sync) {
                        const lastSync = res.data.last_sync.replace('Z', '')
                        const formatDate = format(new Date(lastSync), 'y/MM/d')
                        const time = format(new Date(res.data.last_sync), 'h:mm a')
                        setLastSync({ date: formatDate, time: time })
                    }
                    setTotalOrder(res.data.total_order)
                    if (res.data.profitTrackerData.length) {
                        setLocalData(res.data.profitTrackerData)
                        setStoreData(res.data.profitTrackerData)
                    }
                }
                if (res.status === 204) {
                    setInitialLoading(false)
                }
            })
            .catch(error => {
                setInitialLoading(false)
                console.log(error);
            })
    }, [id, refetchData])

    const { data: storeGraphData = [], refetch, isLoading } = useQuery({
        queryKey: ['single_store_graph_data'],
        queryFn: async () => {
            try {
                const res = await axios.get(`/api/v1/profit_tracker_api/single_store_graph_data?storeId=${id}&day=${analyticsDays}`)

                if (res.status === 200) {
                    setLoading(false)
                    return res.data.data;
                }
                if (res.status === 204) {
                    setLoading(false)
                    return []
                }
            } catch (error) {
                setLoading(false)
                console.log(error);
                return [];
            }
        }
    })

    useEffect(() => {
        if (isRefetch) {
            setLoading(true)
            refetch()
            setIsRefetch(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analyticsDays])

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

        const filteredDateResults = localData.filter((item) => {
            const itemDate = new Date(item.purchase_date);
            return itemDate >= startDate && itemDate <= endDate;
        });

        if (!filteredDateResults.length) {
            setStoreData([]);
            if (day === "today") {
                return setSearchError("No data found for today");
            } else if (day === 365) {
                return setSearchError("No data found for the past 1 year");
            } else if (day === 30) {
                return setSearchError("No data found for the past 1 month");
            }
        }

        setStoreData(filteredDateResults);
    }

    const boxShadowStyle = {
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
    };

    const totalSales = storeData.reduce((sum, d) => sum + parseFloat(d?.sold_price), 0);
    const totalSold = storeData.reduce((sum, d) => sum + parseFloat(d?.total_sold), 0);
    const handleUpdateProfit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = {
            supplier_id: formData.get('supplier_id'),
            quantity: parseFloat(formData.get('quantity')),
            source_quantity: parseFloat(formData.get('source_quantity')),
            customer_name: formData.get('customer_name'),
            average_price: parseFloat(formData.get('average_price')),
            selling_price: parseFloat(formData.get('selling_price')),
            shipping_cost: parseFloat(formData.get('shipping_cost')),
            tax: parseFloat(formData.get('tax')),
            handling_cost: parseFloat(formData.get('handling_cost')),
        }
        // if (!data.average_price) delete data.average_price
        setUpdateLoading(true)
        axios.put(`/api/v1/sales_form_api/update_profit_tracker?id=${updateData._id}`, data)
            .then(res => {
                if (res.status === 200) {
                    setRefetchData(!refetchData)
                    setUpdateData(null)
                    Swal.fire(
                        "Updated",
                        "",
                        "success"
                    )
                }
                if (res.status === 204) {
                    Swal.fire(
                        "Something went wrong",
                        "",
                        "error"
                    )
                }
            })
            .catch(err => console.log(err))
            .finally(() => setUpdateLoading(false))
    }

    const handleLiveSync = () => {
        setSyncLoading(true)
        axios.get(`/api/v1/profit_tracker_api/live_sync?storeId=${id}`)
            .then(res => {
                if (res.status === 200) {
                    setRefetchData(!refetchData)
                    Swal.fire(
                        "Synced",
                        "",
                        "success"
                    )
                }
                if (res.status === 204) {
                    Swal.fire(
                        "Something went wrong",
                        "",
                        "error"
                    )
                }
            })
            .catch(err => console.log(err))
            .finally(() => setSyncLoading(false))
    }
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };
    const itemsPerPage = 15;
    const offset = currentPage * itemsPerPage;
    const currentPageData = storeData?.slice(offset, offset + itemsPerPage) || [];

    console.log(lastSync);
    return (
        <>
            <div className={`${initialLoading ? 'p-0' : 'p-10'} relative`}>
                {loading && <div className="absolute left-0 top-5 w-full items-center justify-center"><div className="text-center text-xs font-medium text-[#8533ff] bg-purple-100 border border-[#8533ff] py-2 px-3 rounded flex gap-2 w-fit mx-auto"><FaSpinner className="animate-spin text-[#8633FF]" size={16} />Prepering Graph Data</div></div>}

                {
                    initialLoading ? <Loading2 contentHeight="74px" /> : <>
                        {/* analytics  */}
                        <div style={boxShadowStyle} className="bg-white p-10 rounded-xl">
                            <div className="flex gap-28 items-center">
                                <div>
                                    <p className="text-lg font-medium">Analytics of {storeName && storeName}</p>
                                    <p className="text-gray-400">All Report</p>
                                </div>
                                {view === "Graph" && <div className="flex gap-4 text-sm">
                                    <p onClick={() => {
                                        setAnalyticsDays(1)
                                        setIsRefetch(true)
                                    }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 1 && 'bg-[#8633FF] text-white'}`}>
                                        Daily
                                    </p>
                                    <p onClick={() => {
                                        setAnalyticsDays(7)
                                        setIsRefetch(true)
                                    }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 7 && 'bg-[#8633FF] text-white'}`}>
                                        7 Days
                                    </p>
                                    <p onClick={() => {
                                        setAnalyticsDays(15)
                                        setIsRefetch(true)
                                    }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 15 && 'bg-[#8633FF] text-white'}`}>
                                        15 Days
                                    </p>
                                    <p onClick={() => {
                                        setAnalyticsDays(30)
                                        setIsRefetch(true)
                                    }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 30 && 'bg-[#8633FF] text-white'}`}>
                                        1 Month
                                    </p>
                                    <p onClick={() => {
                                        setAnalyticsDays(365)
                                        setIsRefetch(true)
                                    }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 365 && 'bg-[#8633FF] text-white'}`}>
                                        Year
                                    </p>

                                </div>}
                                {view === "Table" &&
                                    <div className="flex gap-4 text-sm">
                                        <p onClick={() => {
                                            setStoreData(localData)
                                            setSearchError("")
                                            setAnalyticsDaysTable("all")
                                        }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDaysTable === "all" && 'bg-[#8633FF] text-white'}`}>
                                            All
                                        </p>
                                        <p onClick={() => {
                                            setAnalyticsDaysTable(1)
                                            handleDateSearch("today")
                                        }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDaysTable === 1 && 'bg-[#8633FF] text-white'}`}>
                                            Today
                                        </p>
                                        <p onClick={() => {
                                            setAnalyticsDaysTable(7)
                                            handleDateSearch(7)
                                        }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDaysTable === 7 && 'bg-[#8633FF] text-white'}`}>
                                            7 Days
                                        </p>
                                        <p onClick={() => {
                                            setAnalyticsDaysTable(15)
                                            handleDateSearch(15)
                                        }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDaysTable === 15 && 'bg-[#8633FF] text-white'}`}>
                                            15 Days
                                        </p>
                                        <p onClick={() => {
                                            setAnalyticsDaysTable(30)
                                            handleDateSearch(30)
                                        }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 30 && 'bg-[#8633FF] text-white'}`}>
                                            1 Month
                                        </p>
                                        <p onClick={() => {
                                            setAnalyticsDaysTable(365)
                                            handleDateSearch(365)
                                        }} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDaysTable === 365 && 'bg-[#8633FF] text-white'}`}>
                                            Year
                                        </p>

                                    </div>
                                }
                                <div className="flex gap-5 ml-auto">
                                    <button onClick={() => setView('Graph')} className={`flex items-center gap-1.5 px-3 rounded-md py-2 cursor-pointer ${view === 'Graph' ? "bg-[#8633FF] text-white"
                                        : "border border-slate-500 text-black"}`}><BsGraphUp size={18} /><span>Graph View</span></button>
                                    <button onClick={() => setView('Table')} className={`flex items-center gap-1.5 px-3 rounded py-2 cursor-pointer ${view === 'Table' ? "bg-[#8633FF] text-white"
                                        : "border border-slate-500 text-black"}`}><BiTable size={20} />Table View</button>
                                </div>
                            </div>

                            {view === "Graph" && <div className="mt-10 flex gap-5 items-center">
                                <div className="bg-rose-100 p-4 rounded-lg w-40">
                                    <div className="h-8 w-8 flex justify-center items-center rounded-full bg-rose-400 text-white">
                                        <BsFileBarGraphFill />
                                    </div>
                                    <h6 className="mt-2 text-xl font-medium">${totalSales ? totalSales : "0"}</h6>
                                    <p className="my-1 text-sm">Total Sales</p>
                                </div>

                                <div className="bg-purple-100 p-4 rounded-lg w-40">
                                    <div className="h-8 w-8 flex justify-center items-center rounded-full bg-purple-400 text-white">
                                        <BiSolidFoodMenu />
                                    </div>
                                    <h6 className="mt-2 text-xl font-medium">{totalOrder ? totalOrder : "0"}</h6>
                                    <p className="my-1 text-sm">Total Order</p>
                                </div>

                                <div className="bg-green-100 p-4 rounded-lg w-40">
                                    <div className="h-8 w-8 flex justify-center items-center rounded-full bg-green-400 text-white">
                                        <AiTwotoneTag />
                                    </div>
                                    <h6 className="mt-2 text-xl font-medium">{totalSold == 'NaN' || !totalSold ? '-' : totalSold}</h6>
                                    <p className="my-1 text-sm">Product Sold</p>
                                </div>
                            </div>}
                            {view === "Table" &&
                                <div>
                                    <button disabled={syncLoading} onClick={handleLiveSync} className="bg-[#8633FF] px-5 text-sm my-5 block ml-auto py-2 text-white rounded">{
                                        syncLoading ? <FaSpinner className="animate-spin" size={16} /> : "Live Sync"}

                                    </button>
                                    {lastSync && <p className="text-right text-gray-700">Last sync : <span className="ml-3 text-right">{lastSync && lastSync.date}</span> <span className="ml-3 text-right">at : {lastSync && lastSync.time}</span>  </p>}

                                    <div className="mt-4 overflow-x-scroll overflow-y-hidden">

                                        <div className=" mt-8 min-h-[calc(100vh-335px)] max-h-full">

                                            <table className="table table-sm border border-gray-300 border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-200 text-black">
                                                        <th className="border border-gray-300">Date</th>
                                                        <th className="border border-gray-300">Supplier id</th>
                                                        <th className="border border-gray-300">UPIN</th>
                                                        <th className="border border-gray-300">Quantity</th>
                                                        <th className="border border-gray-300">Source Quantity</th>
                                                        <th className="border border-gray-300">Customer Name</th>
                                                        <th className="border border-gray-300">Selling Price</th>
                                                        <th className="border border-gray-300">Amazon Fee</th>
                                                        <th className="border border-gray-300">Average Price</th>
                                                        <th className="border border-gray-300">Supplier Price</th>
                                                        <th className="border border-gray-300">Shipping Cost</th>
                                                        <th className="border border-gray-300">Tax</th>
                                                        <th className="border border-gray-300">Average Tax</th>
                                                        <th className="border border-gray-300">Handling Cost</th>
                                                        <th className="border border-gray-300">Cost of Goods</th>
                                                        <th className="border border-gray-300">Net Profit</th>
                                                        <th className="border border-gray-300">ROI</th>
                                                        <th className="border border-gray-300">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="relative">
                                                    {searchError ? <p className="absolute top-[260px] flex items-center justify-center w-full text-rose-500 text-xl font-medium">{searchError}</p> : <>
                                                        {
                                                            currentPageData?.map((d, index) => {
                                                                let average_price = allStockData.filter(item => item.upin === d.upin)[0]?.average_price
                                                                average_price = d.average_price || average_price
                                                                let amazonFee = (parseFloat(d.selling_price)) * 0.15
                                                                let supplierPrice = parseFloat(d.quantity) * parseFloat(average_price)
                                                                let tax = d.tax
                                                                let costOfGoods = supplierPrice + parseFloat(d.shipping_cost) + tax + parseFloat(d.handling_cost)
                                                                let cashProfit = (parseFloat(d.selling_price)) - (supplierPrice + amazonFee + parseFloat(d.shipping_cost) + tax + parseFloat(d.handling_cost))
                                                                let roi = ((cashProfit / costOfGoods) * 100).toFixed(2);
                                                                let handling_cost = d.handling_cost
                                                                let supplier_id = d.supplier_id
                                                                let selling_price = d.selling_price
                                                                let shipping_cost = d.shipping_cost
                                                                let average_tax = d.tax / d.quantity
                                                                let quantity = d.quantity
                                                                let source_quantity = d.source_quantity


                                                                if (isNaN(amazonFee)) amazonFee = '-'
                                                                else amazonFee = `$${amazonFee.toFixed(2)}`
                                                                if (isNaN(average_price) || !average_price) average_price = '-'
                                                                else average_price = `$${average_price}`
                                                                if (isNaN(supplierPrice)) supplierPrice = '-'
                                                                else supplierPrice = `$${supplierPrice.toFixed(2)}`
                                                                if (isNaN(tax)) tax = '-'
                                                                else tax = `$${tax.toFixed(2)}`
                                                                if (isNaN(costOfGoods)) costOfGoods = '-'
                                                                else costOfGoods = `$${costOfGoods.toFixed(2)}`
                                                                if (isNaN(cashProfit)) cashProfit = '-'
                                                                else cashProfit = `$${cashProfit.toFixed(2)}`
                                                                if (roi === 'Infinity' || isNaN(roi)) roi = 'Pending'
                                                                else roi = `${roi}%`
                                                                if (isNaN(source_quantity) || !source_quantity) source_quantity = '-'
                                                                else source_quantity = `${source_quantity}`
                                                                if (isNaN(quantity) || !quantity) quantity = '-'
                                                                else quantity = `${quantity}`
                                                                if (isNaN(handling_cost) || !handling_cost) handling_cost = '-'
                                                                else handling_cost = `$${handling_cost}`
                                                                if (!supplier_id) supplier_id = '-'
                                                                else supplier_id = `${supplier_id}`
                                                                if (isNaN(selling_price) || !selling_price) selling_price = '-'
                                                                else selling_price = `$${selling_price}`
                                                                if (isNaN(shipping_cost) || !shipping_cost) shipping_cost = '-'
                                                                else shipping_cost = `$${shipping_cost}`
                                                                if (isNaN(average_tax) || !average_tax) average_tax = '-'
                                                                else average_tax = `$${average_tax.toFixed(2)}`
                                                                let date = d.purchase_date
                                                                date = date.replace('Z', '')
                                                                return <tr key={d._id} className={`${index % 2 == 1 && ""}`} >
                                                                    <td className="font-bold border border-gray-300">{d.purchase_date && format(new Date(date), 'y/MM/d')}</td>
                                                                    <td className="border border-gray-300">{supplier_id}</td>
                                                                    <td className="border border-gray-300">{d.upin}</td>
                                                                    <td className="border border-gray-300">{quantity}</td>
                                                                    <td className="border border-gray-300">{source_quantity}</td>
                                                                    <td className="border border-gray-300">{d.customer_name}</td>
                                                                    <td className="border border-gray-300">{selling_price}</td>
                                                                    <td className="border border-gray-300">{amazonFee}</td>
                                                                    <td className="border border-gray-300">{average_price}</td>
                                                                    <td className="border border-gray-300">{supplierPrice}</td>
                                                                    <td className="border border-gray-300">{shipping_cost}</td>
                                                                    <td className="border border-gray-300">{tax}</td>
                                                                    <td className="border border-gray-300">{average_tax}</td>
                                                                    <td className="border border-gray-300">{handling_cost}</td>
                                                                    <td className="border border-gray-300">{costOfGoods}</td>
                                                                    <td className="border border-gray-300">{cashProfit}</td>
                                                                    <td className="border border-gray-300">{roi}</td>
                                                                    <td className="border border-gray-300">    <button onClick={() => setUpdateData(d)} className="mx-auto block"><BiEdit size={20} /></button></td>
                                                                </tr>
                                                            })
                                                        }
                                                    </>}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                    {storeData?.length > 15 && <ReactPaginate
                                        previousLabel={'Previous'}
                                        nextLabel={'Next'}
                                        breakLabel={'...'}
                                        pageCount={Math.ceil((storeData?.length || 0) / itemsPerPage)}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={10}
                                        onPageChange={handlePageClick}
                                        containerClassName={'pagination'}
                                        activeClassName={'active'}
                                        pageClassName={'page-item'}
                                        pageLinkClassName={'page-link'}
                                        previousClassName={'page-item'}
                                        previousLinkClassName={'page-link'}
                                        nextClassName={'page-item'}
                                        nextLinkClassName={'page-link'}
                                        breakClassName={'page-item'}
                                        breakLinkClassName={'page-link'}
                                    />}
                                </div>
                            }
                        </div>


                        <div className="relative">
                            {isLoading ? <div className="absolute flex justify-center items-center h-[calc(100vh-470px)] w-full"><FaSpinner size={28} className="animate-spin text-[#8633FF]" /></div> : <>
                                {view === "Graph" && <div className="grid grid-cols-2 gap-8 mt-10">
                                    <div style={boxShadowStyle} className=" bg-white p-5  rounded-xl">
                                        <h6 className="text-lg font-medium my-4 ml-8">Net Profit</h6>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={storeGraphData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="Net Profit" fill="#8633FF" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div style={boxShadowStyle} className=" bg-white p-5  rounded-xl">
                                        <h6 className="text-lg font-medium my-4 ml-8">Total Expenses</h6>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart
                                                width={500}
                                                height={300}
                                                data={storeGraphData}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="Total Expenses"
                                                    stroke="#8884d8"
                                                    activeDot={{ r: 8 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>}


                                {view === "Graph" && <div className="grid grid-cols-2 gap-8 mt-10">
                                    {/* sales Chart */}
                                    <div style={boxShadowStyle} className=" bg-white p-5  rounded-xl">
                                        <h6 className="text-lg font-medium my-4 ml-8">Sales</h6>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart
                                                width={500}
                                                height={300}
                                                data={storeGraphData}
                                                margin={{
                                                    top: 10,
                                                    right: 30,
                                                    left: 0,
                                                    bottom: 0,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Area
                                                    type="monotone"
                                                    dataKey="Total Sales"
                                                    stackId="1"
                                                    stroke="#4ADE80"
                                                    fill="#4ADE80"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div style={boxShadowStyle} className="bg-white p-5  rounded-xl">
                                        <h6 className="text-lg font-medium my-4 ml-8">ROI</h6>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart
                                                width={500}
                                                height={300}
                                                data={storeGraphData}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="ROI" stackId="a" fill="#3D9CF0" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>}
                            </>}
                        </div></>
                }
            </div >

            {/* create update modal with inital field  */}
            {
                updateData && <div onClick={() => setUpdateData(null)} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div data-aos="fade-up" className="bg-white p-10 w-1/3 rounded-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-medium">Update Data</h4>
                            <button onClick={() => setUpdateData(null)} className=""><IoMdClose size={26} /></button>
                        </div>
                        <form onSubmit={handleUpdateProfit}>
                            <div className="grid grid-cols-2 gap-5 mt-5">
                                <div>
                                    <label htmlFor="handling_cost" className="text-sm font-medium">Supplier id</label>
                                    <input type="text" defaultValue={updateData.supplier_id} name="supplier_id" id="supplier_id" className="border border-gray-300 rounded-md w-full px-3 py-1" />
                                </div>
                                <div>
                                    <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                                    <input type="text" defaultValue={updateData.quantity} name="quantity" id="quantity" className="border border-gray-300 rounded-md w-full px-3 py-1" />
                                </div>
                                <div>
                                    <label htmlFor="source_quantity" className="text-sm font-medium">Source Quantity</label>
                                    <input type="text" defaultValue={updateData.source_quantity} name="source_quantity" id="source_quantity" className="border border-gray-300 rounded-md w-full px-3 py-1" />
                                </div>
                                <div>
                                    <label htmlFor="customer_name" className="text-sm font-medium">Customer Name</label>
                                    <input type="text" defaultValue={updateData.customer_name} name="customer_name" id="customer_name" className="border border-gray-300 rounded-md w-full px-3 py-1" />
                                </div>
                                <div>
                                    <label htmlFor="selling_price" className="text-sm font-medium">Selling Price</label>
                                    <input type="text" defaultValue={updateData.selling_price} name="selling_price" id="selling_price" className="border border-gray-300 rounded-md w-full px-3 py-1" />
                                </div>
                                <div>
                                    <label htmlFor="source_quantity" className="text-sm font-medium">Average Price</label>
                                    <input type="text" defaultValue={updateData.average_price} name="average_price" id="average_price" className="border border-gray-300 rounded-md w-full px-3 py-1" />
                                </div>

                                <div>
                                    <label htmlFor="shipping_cost" className="text-sm font-medium">Shipping Cost</label>
                                    <input type="text" defaultValue={updateData.shipping_cost} name="shipping_cost" id="shipping_cost" className="border border-gray-300 rounded-md w-full px-3 py-1" />
                                </div>
                                <div>
                                    <label htmlFor="average_tax" className="text-sm font-medium">Tax</label>
                                    <input type="text" defaultValue={updateData.tax} name="tax" id="tax" className="border border-gray-300 rounded-md w-full px-3 py-1" />
                                </div>
                                <div>
                                    <label htmlFor="handling_cost" className="text-sm font-medium">Handling Cost</label>
                                    <input type="text" defaultValue={updateData.handling_cost} name="handling_cost" id="handling_cost" className="border border-gray-300 rounded-md w-full px-3 py-1" />
                                </div>

                            </div>
                            <div className="mt-5">
                                <button disabled={updateLoading} className="bg-[#8633FF] ml-auto text-white rounded-md px-5 py-2 flex items-center gap-x-2">Update {updateLoading && <FaSpinner className="animate-spin" size={16} />} </button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    );
};

export default ProfitTrackerStatsPage;