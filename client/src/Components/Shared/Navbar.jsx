import { AiOutlineMessage, AiOutlineSearch } from "react-icons/ai";
import { BsBell } from "react-icons/bs";

export default function Navbar() {
  return (
    <div className="flex items-center px-8 bg-[#081229] text-white shadow-sm py-6 rounded-lg z-50 ">
      <div className="text-lg font-medium w-1/3 ">Dashboard</div>
      <div className="w-1/3 px-8 relative">
        <input
          type="text"
          placeholder="Search here..."
          className="border-2 border-[#8633FF] outline-[#8633FF] px-4 py-2 w-full rounded-3xl "
        />
        <button className="w-8 h-8 mt-[1px] bg-[#8633FF] hover:bg-[#812dff] transition-all duration-100 shadow-xl text-white rounded-full flex justify-center items-center absolute top-1 right-10">
          <AiOutlineSearch />
        </button>
      </div>
      <div className="w-1/3 flex justify-center items-center gap-4 ">
        <div className="bg-gray-800 p-3 rounded relative">
          <BsBell size={24} />
          <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
          <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span>
        </div>
        <div className="bg-gray-800 p-3 rounded relative">
          <AiOutlineMessage size={24} />
          <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
          <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span>
        </div>
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar w-12 border-2 border-[#8633FF]"
          >
            <div className="w-10 rounded-full">
              <img src="https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.webp?b=1&s=170667a&w=0&k=20&c=ahypUC_KTc95VOsBkzLFZiCQ0VJwewfrSV43BOrLETM=" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
