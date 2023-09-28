// import { Outlet, RouterProvider } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Shared/Sidebar";
import Navbar from "../Components/Shared/Navbar";
import Container from "../Components/Shared/Container";
// import { router } from "../Routes/router";

export default function DashboardPage() {
  return (
    <div className="flex bg-[#F6F6F6]  ">
      {/* <div className="w-[18%] h-screen bg-white "> */}
      <div className=" w-[18%] relative">
        <Sidebar />
      </div>
      {/* </div> */}
      <div className="w-[82%]">
        <Container>
          <div className="sticky top-0">
            <Navbar />
          </div>
          <div className="bg-white h-[2000px] mt-8 rounded-lg p-6">
            <Outlet />
          </div>
        </Container>
      </div>
    </div>
  );
}
