// import { Outlet, RouterProvider } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Shared/Sidebar";
import Navbar from "../Components/Shared/Navbar";
import Container from "../Components/Shared/Container";
import { useContext } from "react";
import { GlobalContext } from "../Providers/GlobalProviders";
// import { router } from "../Routes/router";

export default function DashboardLayout() {
  const { isSidebarOpen } = useContext(GlobalContext);
  return (
    <div className="flex bg-[#eee8e8] ">
      <div className={`transition-all duration-500 relative `}>
        <Sidebar />
      </div>
      <div className={`${isSidebarOpen ? "w-[82%]" : "w-[93%]"} `}>
        <Container>
          <div className="sticky top-0">
            <Navbar />
          </div>
          <div className=" mt-8  ">
            <Outlet />
          </div>
        </Container>
      </div>
    </div>
  );
}
