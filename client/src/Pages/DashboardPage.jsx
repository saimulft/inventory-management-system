import { BiSolidFoodMenu, BiSolidStore, BiTable } from "react-icons/bi";
import { BsFileBarGraphFill, BsGraphUp } from "react-icons/bs";
import { AiTwotoneTag } from "react-icons/ai";
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart, LineChart, Line } from "recharts";
import { useState } from "react";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function DashboardPage() {
  const [analyticsDays, setAnalyticsDays] = useState()
  const [view, setView] = useState('Graph')

  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
  };
  return (
    <div className="p-10">
      {/* analytics  */}
      <div style={boxShadowStyle} className="bg-white p-5  rounded-xl">
        <div className="flex gap-28 items-center">
          <div>
            <p className="text-lg font-medium">Analytics</p>
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
            <h6 className="mt-2 text-xl font-medium">$ 1k</h6>
            <p className="my-1 text-sm">Total Sales</p>
            <p className="text-xs text-rose-500">+8 from yesterday</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg w-40">
            <div className="h-8 w-8 flex justify-center items-center rounded-full bg-yellow-400 text-white">
              <BiSolidFoodMenu />
            </div>
            <h6 className="mt-2 text-xl font-medium">10</h6>
            <p className="my-1 text-sm">Total Store</p>
            <p className="text-xs text-yellow-500">+3 from yesterday</p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg w-40">
            <div className="h-8 w-8 flex justify-center items-center rounded-full bg-green-400 text-white">
              <AiTwotoneTag />
            </div>
            <h6 className="mt-2 text-xl font-medium">42</h6>
            <p className="my-1 text-sm">Product Sold</p>
            <p className="text-xs text-green-500">+12 from yesterday</p>
          </div>

          <div className="bg-purple-100 p-4 rounded-lg w-40">
            <div className="h-8 w-8 flex justify-center items-center rounded-full bg-purple-400 text-white">
              <BiSolidStore />
            </div>
            <h6 className="mt-2 text-xl font-medium">15</h6>
            <p className="my-1 text-sm">New Customers</p>
            <p className="text-xs text-purple-500">+6 from yesterday</p>
          </div>
        </div>
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
              <Bar dataKey="pv" fill="#3D9CF0" />
              <Bar dataKey="uv" fill="#4ADE80" />
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
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
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
                dataKey="uv"
                stackId="1"
                stroke="#3D9CF0"
                fill="#3D9CF0"
              />
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
              <Bar dataKey="uv" stackId="a" fill="#4ADE80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>}
      {view === "Table" && <div style={boxShadowStyle} className="mt-10">

        <div className="overflow-x-auto mt-8 min-h-[calc(100vh-288px)] max-h-full">
          <table className="table table-sm">
            <thead>
              <tr className="bg-gray-200">
                <th>Date</th>
                <th>Amazon Order ID</th>
                <th>Amazon Quantity</th>
                <th>CWalmart Quantity</th>
                <th>Customer Name</th>
                <th>Amazon Price</th>
                <th>Amazon Shipping</th>
                <th>Amazon Fee</th>
                <th>Average Price</th>
                <th>Supplier Price</th>
                <th>Shipping Cost</th>
                <th>EDAverage TaxA</th>
                <th>Tax</th>
                <th>Handling Cost</th>
                <th>Cost of Goods</th>
                <th>Cash Profit</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody className="relative">

              <tr className="bg-gray-200" >
                {/* <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th> */}
              </tr>


            </tbody>
          </table>


        </div>
      </div>}

    </div>
  );
}
