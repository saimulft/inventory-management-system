import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Components/Shared/Sidebar";
import Navbar from "../Components/Shared/Navbar";
import Container from "../Components/Shared/Container";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../Providers/GlobalProviders";
import ChatBox from "../Components/ChatBox";
import { ChatContext } from "../Providers/ChatProvider";

export default function DashboardLayout() {
  const {isMessageBoxOpen} = useContext(ChatContext)
  const { isSidebarOpen, setIsActiveSetting } = useContext(GlobalContext);
const [participants, setParticipants] = useState([])
  const url = useLocation();
  const settingActiveRoute = url?.pathname?.split("/")[3];

  useEffect(() => {
    setIsActiveSetting(settingActiveRoute);
  }, []);

  const data = [
    {
      id: 1,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id: 2,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Nabil Newaz",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id: 3,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Torikul Islam",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id: 4,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id: 5,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id: 6,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id: 7,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id: 8,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id: 9,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id: 10,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    },
    {
      id: 11,
      img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
      name: "Toukir Ahmed",
      last_message: "how are you?",
      time: "31m"
    }

  ]


  return (
    <div className="flex bg-[#fafbfc]">
      <div
        className={`transition-all ease-out duration-300 delay-0 ${isSidebarOpen ? "w-[18.5%]" : "w-[6%] "
          }`}
      >
        <Sidebar />
      </div>
      <div className={` ${isSidebarOpen ? "w-[81.5%]" : "w-[94%] "}`}>
        <Container>
          <div className="sticky top-0 z-50">
            <Navbar data={data} setParticipants={setParticipants}/>
          </div>
          <div>
            <Outlet />
            {/* message box  */}
            {isMessageBoxOpen && <ChatBox participants={participants}/>}
          </div>
        </Container>
      </div>
    </div>
  );
}
