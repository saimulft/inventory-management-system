import { useState } from "react";
import { BiSolidFoodMenu, BiSolidStore, BiTable } from "react-icons/bi";
import { BsFileBarGraphFill, BsGraphUp } from "react-icons/bs";
import { AiTwotoneTag } from "react-icons/ai";
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart, LineChart, Line } from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const data = [
    {
        name: "Week 1",
        "Net Profit": 2400,
    },
    {
        name: "Week 2",
        "Net Profit": 1398,
    },
    {
        name: "Week 3",
        "Net Profit": 9800,
    },
    {
        name: "Week 4",
        "Net Profit": 3908,
    },
    {
        name: "Week 5",
        "Net Profit": 4800,
    },
    {
        name: "Week 6",
        "Net Profit": 3800,
    },
    {
        name: "Week 7",
        "Net Profit": 4300,
    },
];

const ProfitTrackerStatsPage = () => {
    const [analyticsDays, setAnalyticsDays] = useState(7)
    const [view, setView] = useState('Graph')
    const [storeName, setStoreName] = useState('')

    const { id } = useParams()

    const { data: storeData = [] } = useQuery({
        queryKey: ['single_store_data'],
        queryFn: async () => {
            try {
                const res = await axios.get(`/api/v1/profit_tracker_api/single_store_data?storeId=${id}`)

                if (res.status === 200) {
                    setStoreName(res.data.store_name)
                    if (res.data.data) {
                        return res.data.data;
                    }
                    else {
                        return []
                    }
                }
                if (res.status === 204) {
                    return []
                }
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    })

    const { data: storeGraphData = [] } = useQuery({
        queryKey: ['single_store_graph_data'],
        queryFn: async () => {
            try {
                const res = await axios.get(`/api/v1/profit_tracker_api/single_store_graph_data?storeId=${id}`)

                if (res.status === 200) {
                    return res.data.data;
                }
                if (res.status === 204) {
                    return []
                }
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    })

    const boxShadowStyle = {
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
    };

    console.log(storeGraphData)

    return (
        <div className="p-10">
            {/* analytics  */}
            <div style={boxShadowStyle} className="bg-white p-10 rounded-xl">
                <div className="flex gap-28 items-center">
                    <div>
                        <p className="text-lg font-medium">Analytics of {storeName && storeName}</p>
                        <p className="text-gray-400">All Report</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <p onClick={() => setAnalyticsDays(7)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 7 && 'bg-[#8633FF] text-white'}`}>
                            7 Days
                        </p>
                        <p onClick={() => setAnalyticsDays(15)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 15 && 'bg-[#8633FF] text-white'}`}>
                            15 Days
                        </p>
                        <p onClick={() => setAnalyticsDays(1)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 1 && 'bg-[#8633FF] text-white'}`}>
                            1 Month
                        </p>
                        <p onClick={() => setAnalyticsDays('year')} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 'year' && 'bg-[#8633FF] text-white'}`}>
                            Year
                        </p>
                        <p onClick={() => setAnalyticsDays('custom')} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 'custom' && 'bg-[#8633FF] text-white'}`}>
                            Custom
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
                    <div className="bg-blue-100 p-4 rounded-lg w-40">
                        <div className="h-8 w-8 flex justify-center items-center rounded-full bg-sky-400 text-white">
                            <BiSolidStore />
                        </div>
                        <h6 className="mt-2 text-xl font-medium">10</h6>
                        <p className="my-1 text-sm">Total Store</p>
                        <p className="text-xs text-sky-500">+3% from yesterday</p>
                    </div>

                    <div className="bg-rose-100 p-4 rounded-lg w-40">
                        <div className="h-8 w-8 flex justify-center items-center rounded-full bg-rose-400 text-white">
                            <BsFileBarGraphFill />
                        </div>
                        <h6 className="mt-2 text-xl font-medium">$1k</h6>
                        <p className="my-1 text-sm">Total Sales</p>
                        <p className="text-xs text-rose-500">+8 from yesterday</p>
                    </div>

                    <div className="bg-purple-100 p-4 rounded-lg w-40">
                        <div className="h-8 w-8 flex justify-center items-center rounded-full bg-purple-400 text-white">
                            <BiSolidFoodMenu />
                        </div>
                        <h6 className="mt-2 text-xl font-medium">10</h6>
                        <p className="my-1 text-sm">Total Order</p>
                        <p className="text-xs text-purple-500">+3 from yesterday</p>
                    </div>

                    <div className="bg-green-100 p-4 rounded-lg w-40">
                        <div className="h-8 w-8 flex justify-center items-center rounded-full bg-green-400 text-white">
                            <AiTwotoneTag />
                        </div>
                        <h6 className="mt-2 text-xl font-medium">42</h6>
                        <p className="my-1 text-sm">Product Sold</p>
                        <p className="text-xs text-green-500">+12 from yesterday</p>
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

            {view === "Graph" && <div className="grid grid-cols-2 gap-8 mt-10">

                <div style={boxShadowStyle} className=" bg-white p-5  rounded-xl">
                    <h6 className="text-lg font-medium my-4 ml-8">Net Profit</h6>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
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
                            data={data}
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
                                dataKey="pv"
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
                            data={data}
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
                            <Area
                                type="monotone"
                                dataKey="pv"
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
                            data={data}
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
                            <Bar dataKey="pv" stackId="a" fill="#3D9CF0" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>}
        </div>
    );
};

export default ProfitTrackerStatsPage;