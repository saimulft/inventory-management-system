// import { Outlet, RouterProvider } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Components/Shared/Sidebar";
import Navbar from "../Components/Shared/Navbar";
import Container from "../Components/Shared/Container";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../Providers/GlobalProviders";

export default function DashboardLayout() {
  const { isSidebarOpen } = useContext(GlobalContext);
  const url = useLocation();
  const settingActiveRoute = url?.pathname?.split("/")[3];
  const { setIsActiveSetting } = useContext(GlobalContext);

  useEffect(() => {
    setIsActiveSetting(settingActiveRoute);
  }, []);

  return (
    <div className="flex bg-[#fafbfc] ">
      <div
        className={`transition-all ease-out duration-300 delay-0 ${
          isSidebarOpen ? "w-[18.5%]" : "w-[6%] "
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
