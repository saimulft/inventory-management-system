import { BiSolidFoodMenu, BiSolidStore } from "react-icons/bi";
import { BsFileBarGraphFill } from "react-icons/bs";
import { AiTwotoneTag } from "react-icons/ai";
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart, LineChart, Line } from "recharts";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { FaSpinner } from "react-icons/fa";
import Loading from "../Components/Shared/Loading";


export default function DashboardPage() {
    const [analyticsDays, setAnalyticsDays] = useState(1)

    const { user } = useAuth()

    const { data: storeGraphData = [], refetch, isLoading } = useQuery({
        queryKey: ['all_store_graph_data'],
        queryFn: async () => {
            try {
                const res = await axios.get(`/api/v1/profit_tracker_api/single_store_graph_data?adminId=${user.admin_id}&day=${analyticsDays}&view=dashboard`)

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
    useEffect(() => {

        refetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analyticsDays])
    const boxShadowStyle = {
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
    };
    return (
        <div className="p-10 relative">
            {/* analytics  */}
            <div style={boxShadowStyle} className="bg-white p-10 rounded-xl">
                <div className="flex gap-28 items-center">
                    <div>
                        <p className="text-lg font-medium">Analytics</p>
                        <p className="text-gray-400">All Report</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <p onClick={() => setAnalyticsDays(1)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 1 && 'bg-[#8633FF] text-white'}`}>
                            Daily
                        </p>
                        <p onClick={() => setAnalyticsDays(7)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 7 && 'bg-[#8633FF] text-white'}`}>
                            7 Days
                        </p>
                        <p onClick={() => setAnalyticsDays(15)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 15 && 'bg-[#8633FF] text-white'}`}>
                            15 Days
                        </p>
                        <p onClick={() => setAnalyticsDays(30)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 30 && 'bg-[#8633FF] text-white'}`}>
                            1 Month
                        </p>
                        <p onClick={() => setAnalyticsDays(365)} className={`border border-gray-300 cursor-pointer hover:bg-[#8633FF] hover:text-white transition-all  py-1 px-6 rounded ${analyticsDays === 365 && 'bg-[#8633FF] text-white'}`}>
                            Year
                        </p>

                    </div>

                </div>

                <div className="mt-10 flex gap-5 items-center">
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
                </div>

            </div>


            {isLoading ? <Loading /> : <>
                <div className="grid grid-cols-2 gap-8 mt-10">

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

                </div>

                <div className="grid grid-cols-2 gap-8 mt-10">
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

                </div>
            </>}

        </div>
    );
}
