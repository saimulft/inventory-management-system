import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Shared/Sidebar";
import Navbar from "../Components/Shared/Navbar";
import Container from "../Components/Shared/Container";
import { useContext } from "react";
import { GlobalContext } from "../Providers/GlobalProviders";
import ChatBox from "../Components/Shared/ChatBox/ChatBox";
import NotificationBox from "../Components/Shared/NotificationBox/NotificationBox";

export default function DashboardLayout() {
  const { isSidebarOpen } = useContext(GlobalContext);

  return (
    <div className="flex bg-[#fafbfc]">
      <div
        className={`transition-all ease-out duration-300 delay-0 ${isSidebarOpen ? "w-[18.5%]" : "w-[6%]"
          }`}
      >
        <Sidebar />
      </div>
      <div className={`transition-all ease-out duration-300 delay-0 ${isSidebarOpen ? "w-[81.5%]" : "w-[94%]"}`}>
        <Container>
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>
          <div>
            <Outlet />
            {/* message box  */}
            <ChatBox />
            <NavLink to={menu.link} className={({ isActive }) => isActive ? "text-blue-500 border-b-blue-500" : "flex items-center justify-center lg:px-4 lg:py-3 pl-3 pr-4 text-gray-700 md:p-0 md:w-auto transition duration-150 border-b-[3px] border-white hover:text-blue-500 hover:border-b-blue-500"}>{menu.name}</NavLink>
          </li>
          <NotificationBox />
      </div>
    </Container>
      </div >
    </div >
  );
}
