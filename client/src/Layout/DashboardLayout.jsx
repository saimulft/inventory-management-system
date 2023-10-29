// import { Outlet, RouterProvider } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Components/Shared/Sidebar";
import Navbar from "../Components/Shared/Navbar";
import Container from "../Components/Shared/Container";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../Providers/GlobalProviders";

import useAuth from "../hooks/useAuth";
import ChatBox from "../Components/ChatBox";

export default function DashboardLayout() {
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false)
  const [currentReciver, setCurrentReciver] = useState({})
  const [allUsersData, setAllUsersData] = useState([])
  const [messages, setMessages] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  // console.log("currentReciver: ", currentReciver)

  const { isSidebarOpen } = useContext(GlobalContext);
  const url = useLocation();
  const settingActiveRoute = url?.pathname?.split("/")[3];
  const { setIsActiveSetting } = useContext(GlobalContext);
  const { user,socket } = useAuth()

  // console.log("messages: ",messages)

  useEffect(() => {
    setIsActiveSetting(settingActiveRoute);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/user_api/all_users')
      .then(res => res.json())
      .then(data => setAllUsersData(data))
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/conversations_api/messages?sender=${user.email}`)
      .then(res => res.json())
      .then(data => setMessages(data))
  }, [])
 
  useEffect(() => {
    socket.current.emit('addUsers', user)
    socket.current.on("getUsers", users => {
      setActiveUsers(users)
    })
  },[])
 

  // console.log(user)

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

  const handleCurrentReciver = (email) => {
    console.log(email)
    const reciver = allUsersData?.find((singleUser) => singleUser?.email == email)
    setCurrentReciver(reciver)
  }


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
            <Navbar isMessageBoxOpen={isMessageBoxOpen} setIsMessageBoxOpen={setIsMessageBoxOpen} data={data} handleCurrentReciver={handleCurrentReciver} allUsersData={allUsersData} messages={messages} currentReciver={currentReciver} />
          </div>
          <div>
            <Outlet />
            {/* message box  */}
            {isMessageBoxOpen && <ChatBox isMessageBoxOpen={isMessageBoxOpen} setIsMessageBoxOpen={setIsMessageBoxOpen} currentReciver={currentReciver} activeUsers={activeUsers}/>}
          </div>
        </Container>
      </div>
    </div>
  );
}
