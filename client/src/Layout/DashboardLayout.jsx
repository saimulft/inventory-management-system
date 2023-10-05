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
    <div className="flex bg-[#fafbfc] ">
      <div
        className={`transition-all ease-out duration-300 delay-0 ${
          isSidebarOpen ? "lg:w-[18.5%] md:w-[32%]" : "lg:w-[6%] md:w-[9%]"
        }`}
      >
        <Sidebar />
      </div>
      <div className="w-full">
        <Container>
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>
          <div>
            <Outlet />
          </div>
        </Container>
      </div>
    </div>
  );
}
