// import { Outlet, RouterProvider } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Components/Shared/Sidebar";
import Navbar from "../Components/Shared/Navbar";
import Container from "../Components/Shared/Container";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../Providers/GlobalProviders";
import { AiOutlineClose } from "react-icons/ai";
import { BiSolidSend } from "react-icons/bi";

export default function DashboardLayout() {
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false)
  const [currentReciver, setCurrentReciver] = useState({})
  console.log(currentReciver)

  const { isSidebarOpen } = useContext(GlobalContext);
  const url = useLocation();
  const settingActiveRoute = url?.pathname?.split("/")[3];
  const { setIsActiveSetting } = useContext(GlobalContext);

  useEffect(() => {
    setIsActiveSetting(settingActiveRoute);
  }, []);


  const data = [
    {
      id:1,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id:2,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Nabil Newaz",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id:3,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Torikul Islam",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id:4,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id:5,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id:6,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id:7,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id:8,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id:9,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id:10,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id:11,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    }

  ]

  const handleCurrentReciver = (id) => {
    const reciver = data?.find((singleData) => singleData.id == id)
    setCurrentReciver(reciver)
  }


  return (
    <div className="flex bg-[#fafbfc] ">
      <div
        className={`transition-all ease-out duration-300 delay-0 ${isSidebarOpen ? "w-[18.5%]" : "w-[6%] "
          }`}
      >
        <Sidebar />
      </div>
      <div className={` ${isSidebarOpen ? "w-[81.5%]" : "w-[94%] "}`}>
        <Container>
          <div className="sticky top-0 z-50">
            <Navbar isMessageBoxOpen={isMessageBoxOpen} setIsMessageBoxOpen={setIsMessageBoxOpen} data={data} handleCurrentReciver={handleCurrentReciver} />
          </div>
          <div>
            <Outlet />
            {/* message box  */}
            {
              isMessageBoxOpen && <div className="h-[500px] w-[350px] fixed  bg-white shadow-2xl right-20 bottom-0 rounded-t-lg ">
                {/* message head  */}
                <div style={{ boxShadow: "0px 2px 20px 0px rgba(0,0,0,0.1)" }} className="flex justify-between items-center  px-3">
                  <div className="py-3">
                    <div className="flex items-center gap-2 font-medium">
                    <img className="w-10 h-10 rounded-full" src={currentReciver.img} alt="" />
                      <p>{currentReciver.name}</p>
                    </div>
                  </div>
                  <div onClick={() => setIsMessageBoxOpen(!isMessageBoxOpen)} className="hover:bg-gray-100 transition p-1 rounded-full text-purple-500">
                    <AiOutlineClose size={22} />
                  </div>
                </div>
                {/* message body  */}
                <div className="h-[385px]">

                </div>
                {/* message footer  */}
                <div style={{ boxShadow: "0px -2px 20px 0px rgba(0,0,0,0.1)" }} className="flex justify-between items-center p-3 gap-2">
                  <input placeholder="Aa" className="outline-none bg-gray-100 rounded-full py-1 px-3 w-full" type="text" />
                  <div className="p-2 hover:bg-gray-100 transition rounded-full flex justify-center items-center text-purple-500">
                    <BiSolidSend size={22} />
                  </div>
                </div>
              </div>
            }
          </div>
        </Container>
      </div>
    </div>
  );
}
