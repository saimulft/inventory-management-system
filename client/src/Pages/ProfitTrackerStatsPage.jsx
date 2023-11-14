import { useEffect, useState } from "react";
import { BiSolidFoodMenu, BiTable } from "react-icons/bi";
import { BsFileBarGraphFill, BsGraphUp } from "react-icons/bs";
import { AiTwotoneTag } from "react-icons/ai";
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart, LineChart, Line } from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import Loading2 from "../Components/Shared/Loading2";
import { FaSpinner } from "react-icons/fa";

const ProfitTrackerStatsPage = () => {
    const [analyticsDays, setAnalyticsDays] = useState(1)
    const [view, setView] = useState('Graph')
    const [storeName, setStoreName] = useState('')
    const [storeData, setStoreData] = useState([])
    const [initialLoading, setInitialLoading] = useState(false)
    const [isRefetch, setIsRefetch] = useState(false)
    const [loading, setLoading] = useState(false)

    const { id } = useParams()

    useEffect(() => {
        setInitialLoading(true)

        axios.get(`/api/v1/profit_tracker_api/single_store_data?storeId=${id}`)
            .then(res => {
                if (res.status === 200) {
                    setInitialLoading(false)
                    setStoreName(res.data.store_name)
                    if (res.data.data) {
                        setStoreData(res.data.data)
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
    }, [id])

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

    const boxShadowStyle = {
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
    };

    const totalSales = storeData.reduce((sum, d) => sum + parseFloat(d?.sold_price), 0);
    const totalSold = storeData.reduce((sum, d) => sum + parseFloat(d?.total_sold), 0);

    return (
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
                            <div className="flex gap-4 text-sm">
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

                            </div>
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
                                <h6 className="mt-2 text-xl font-medium">${totalSales}</h6>
                                <p className="my-1 text-sm">Total Sales</p>
                            </div>

                            <div className="bg-purple-100 p-4 rounded-lg w-40">
                                <div className="h-8 w-8 flex justify-center items-center rounded-full bg-purple-400 text-white">
                                    <BiSolidFoodMenu />
                                </div>
                                <h6 className="mt-2 text-xl font-medium">0</h6>
                                <p className="my-1 text-sm">Total Order</p>
                            </div>

                            <div className="bg-green-100 p-4 rounded-lg w-40">
                                <div className="h-8 w-8 flex justify-center items-center rounded-full bg-green-400 text-white">
                                    <AiTwotoneTag />
                                </div>
                                <h6 className="mt-2 text-xl font-medium">{totalSold}</h6>
                                <p className="my-1 text-sm">Product Sold</p>
                            </div>
                        </div>}

                        {view === "Table" && <div className="mt-12">
                            <div className="overflow-x-auto mt-8 min-h-[calc(100vh-335px)] max-h-full">
                                <table className="table table-sm border border-gray-300 border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200 text-black">
                                            <th className="border border-gray-300">Date</th>
                                            <th className="border border-gray-300">Amazon Order ID</th>
                                            <th className="border border-gray-300">Amazon Quantity</th>
                                            <th className="border border-gray-300">Walmart Quantity</th>
                                            <th className="border border-gray-300">Customer Name</th>
                                            <th className="border border-gray-300">Amazon Price</th>
                                            <th className="border border-gray-300">Amazon Shipping</th>
                                            <th className="border border-gray-300">Amazon Fee</th>
                                            <th className="border border-gray-300">Average Price</th>
                                            <th className="border border-gray-300">Supplier Price</th>
                                            <th className="border border-gray-300">Shipping Cost</th>
                                            <th className="border border-gray-300">Average Tax</th>
                                            <th className="border border-gray-300">Tax</th>
                                            <th className="border border-gray-300">Handling Cost</th>
                                            <th className="border border-gray-300">Cost of Goods</th>
                                            <th className="border border-gray-300">Net Profit</th>
                                            <th className="border border-gray-300">ROI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="relative">
                                        {storeData?.map((d, index) => {

                                            const amazonFee = (parseFloat(d.amazon_price) + parseFloat(d.amazon_shipping)) * 0.15
                                            const supplierPrice = parseFloat(d.walmart_quantity) * parseFloat(d.average_price)
                                            const tax = parseFloat(d.walmart_quantity) * parseFloat(d.average_tax)
                                            const costOfGoods = supplierPrice + parseFloat(d.shipping_cost) + tax + parseFloat(d.handling_cost)
                                            const cashProfit = (parseFloat(d.amazon_price) + parseFloat(d.amazon_shipping)) - (supplierPrice + amazonFee + parseFloat(d.shipping_cost) + tax + parseFloat(d.handling_cost))
                                            const roi = (cashProfit / costOfGoods) * 100;

                                            return <tr key={d._id} className={`${index % 2 == 1 && ""}`} >
                                                <td className="font-bold border border-gray-300">{format(new Date(d.date), 'y/MM/d')}</td>
                                                <td className="border border-gray-300">{d.supplier_id}</td>
                                                <td className="border border-gray-300">{d.amazon_quantity}</td>
                                                <td className="border border-gray-300">{d.walmart_quantity}</td>
                                                <td className="border border-gray-300">{d.customer_name}</td>
                                                <td className="border border-gray-300">${d.amazon_price}</td>
                                                <td className="border border-gray-300">${d.amazon_shipping}</td>
                                                <td className="border border-gray-300">${amazonFee.toFixed(2)}</td>
                                                <td className="border border-gray-300">${d.average_price}</td>
                                                <td className="border border-gray-300">${supplierPrice.toFixed(2)}</td>
                                                <td className="border border-gray-300">${d.shipping_cost}</td>
                                                <td className="border border-gray-300">${d.average_tax}</td>
                                                <td className="border border-gray-300">${tax.toFixed(2)}</td>
                                                <td className="border border-gray-300">${d.handling_cost}</td>
                                                <td className="border border-gray-300">${costOfGoods.toFixed(2)}</td>
                                                <td className="border border-gray-300">${cashProfit.toFixed(2)}</td>
                                                <td className="border border-gray-300">{roi.toFixed(2)}%</td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>}
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
    );
};

export default ProfitTrackerStatsPage;