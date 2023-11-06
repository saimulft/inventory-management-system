import { AiOutlineMessage, AiOutlineSearch } from "react-icons/ai";
import { BsBell } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth()

  return (
    <div className="flex items-center px-8 ps-3 pe-3 bg-[#2e2e30]  text-white shadow-sm py-3">
      <div className="text-lg font-medium w-full ">Dashboard</div>
      <div className="w-full px-8 relative lg:block hidden">
        <div className="form-control w-full">
          <div className="input-group w-full">
            <input
              type="text"
              placeholder="Search here…"
              className="input input-bordered w-full bg-transparent border-[#454547] focus:outline-none focus:ring-1 focus:ring-[#8633FF]"
            />
            <button className="btn btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* notification, messeage and profile  */}
      <div className="w-full flex justify-end items-center gap-4  z-[1]">
        <div className="bg-[#454547] p-3 rounded relative hidden">
          <AiOutlineSearch size={20} />
        </div>
        <div className="bg-[#454547] hover:bg-[#3f3f41]  transition-all duration-15 p-3 rounded relative">
          <BsBell size={20} />
          <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
          <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span>
        </div>
        <div className="bg-[#454547] hover:bg-[#3f3f41] transition-all duration-15 p-3 rounded relative">
          <AiOutlineMessage size={20} />
          <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
          <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span>
        </div>
        <div className="flex gap-3">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar w-12 border-2 border-[#8633FF]"
            >
              <div className="w-10 rounded-full">
                <img src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png" />
              </div>
            </label>
           
          </div>
          <div>
            <p>{user?.full_name}</p>
            <p className="text-[#767678]">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
