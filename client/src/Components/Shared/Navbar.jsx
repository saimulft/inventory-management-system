import { AiOutlineMessage, AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import { BsBell, BsDot} from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import {useContext, useEffect, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";

export default function Navbar({ data }) {
  const {isMessageBoxOpen, setIsMessageBoxOpen, handleCurrentReciver,handleSeenMessage, allUsersData, messagesData, setLastMessageReceiver} = useContext(ChatContext)
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false)
  const [isNotificationBoxOpen, setIsNotificationBoxOpen] = useState(false)
  const [isAddChatOpen, setIsAddChatOpen] = useState(false)
  const [isInputFocused, setInputFocused] = useState(false)
  const [conversationData, setConversationData] = useState([])
  const [allUsersSearchData, setAllUsersSearchData] = useState([])


    

  const { user } = useAuth()

  const allUsers = allUsersSearchData.filter((singleUser) => singleUser.email != user.email && singleUser.email_verified)

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  useEffect(()=> {
    setConversationData(messagesData)
  },[messagesData])

  useEffect(()=>{
    setAllUsersSearchData(allUsersData)
  },[])

  const handleAddUsersSearch = (e) => {
    if(e.target.value == ""){
      setConversationData(messagesData)
    }
    setTimeout(() => {
        const addUsersSearch = allUsersData?.filter((userData) => userData?.email.match(/[^@]*/)[0]?.split(".")[0].includes(e.target.value))
    setAllUsersSearchData(addUsersSearch)
    }, 800);
  } 
  const handleCoversationSearch = (e) => {
  if(e.target.value == ""){
    setConversationData(messagesData)
  }
  setTimeout(()=>{
    const coversationSearchData = messagesData?.filter((messageData) => messageData?.participants?.find(participant => participant != user?.email).match(/[^@]*/)[0]?.split(".")[0].includes(e.target.value) )
    setConversationData(coversationSearchData)
  }, 800)
 }

  return (
    <>
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

          {/* notification btn  */}
          <div className="relative">
            <div onClick={() => {
              if (isChatBoxOpen) {
                setIsChatBoxOpen(!isChatBoxOpen)
              }
              if (isMessageBoxOpen) {
                setIsMessageBoxOpen(!isMessageBoxOpen)
              }
              setIsNotificationBoxOpen(!isNotificationBoxOpen)
            }} className="bg-[#454547] hover:bg-[#3f3f41] cursor-pointer transition-all duration-15 p-3 rounded relative">
              <BsBell size={20} />
              <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
              <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span>
            </div>

            {/* notifications box  */}
            {isNotificationBoxOpen && <div className=" notifications_box absolute -right-44 top-14 shadow-2xl z-10 bg-white overflow-y-scroll rounded-lg h-[590px] w-[350px] px-2 py-4">
                <div className="text-black px-2">
                  <h3 className="text-2xl font-bold">Notifications</h3>
                  <div className="flex gap-2 mt-3 mb-2">
                    <p className="bg-purple-50 font-medium cursor-pointer px-4 py-1 rounded-full hover:bg-purple-100 transition hover:shadow">All</p>
                    <p className="bg-purple-50 font-medium cursor-pointer px-4 py-1 rounded-full hover:bg-purple-100 transition hover:shadow">Unread</p>
                  </div>
                </div>
                {data.map((d, index) => {
                  return (
                    <div key={index} className="hover:bg-gray-100 px-4 flex item-center gap-3 py-3 cursor-pointer rounded-lg transition ">
                      <div>
                        <img className="h-14 w-14 rounded-full" src="https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no" alt="" />
                      </div>
                      <div>
                        <p className="text-black "><span className="font-medium">Toukir Ahmed</span> posted 2 links.</p>
                        <p className="text-purple-500">a day ago</p>
                      </div>
                    </div>
                  )
                })}

              </div>}
              
          </div>

          {/* message btn  */}
          <div className="relative">
            <div onClick={() => {
              if (isNotificationBoxOpen) {
                setIsNotificationBoxOpen(!isNotificationBoxOpen)
              }
              if (isAddChatOpen) {
                setIsAddChatOpen(!isAddChatOpen)
              }
              if (isMessageBoxOpen) {
                setIsMessageBoxOpen(!isMessageBoxOpen)
              }
              setIsChatBoxOpen(!isChatBoxOpen)
            }} className="bg-[#454547] hover:bg-[#3f3f41] cursor-pointer transition-all duration-15 p-3 rounded relative">
              <AiOutlineMessage size={20} />
              <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
              <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span>
            </div>

            {/* message box  */}
            {isChatBoxOpen && <div className=" absolute -right-28 top-14 shadow-2xl z-10 bg-white overflow-y-scroll rounded-lg h-[590px] w-[350px] px-2 py-4">
              <div className="text-black px-2">
                <div className="flex justify-between">
                  <h3 className="text-2xl font-bold">Chats</h3>

                  {/* add chat  */}
                  <div className="relative">
                    <button onClick={() => {
                      setIsAddChatOpen(!isAddChatOpen)
                      document.getElementById('my_modal_3').showModal()
                    }} className={`flex items-center gap-1 ${isAddChatOpen ? "bg-purple-100 " : "bg-gray-100"} transition  shadow hover:shadow  px-3 text-sm py-1 rounded-full`} ><p>Add</p><AiOutlinePlus /></button>

                    {/*add chat box*/}
                    <dialog id="my_modal_3" className="modal">
                      <div className="modal-box">
                        <form method="dialog">
                          <button onClick={() => setIsAddChatOpen(!isAddChatOpen)}  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="text-xl font-medium" >Add User</h3>
                        <div className="relative ">
                          <input onChange={(e) => handleAddUsersSearch(e)} onFocus={handleInputFocus}
                            onBlur={handleInputBlur} type="text" placeholder="Search users" className={`w-full bg-gray-100 outline-none py-2 px-3 rounded-full mt-3 mb-2 ${isInputFocused && 'shadow'} `} />
                          <button className="bg-purple-500 p-2 rounded-full text-white absolute right-2 translate-y-1/2"><AiOutlineSearch size={16} /></button>
                        </div>
                    <div className="add_chat_box h-[300px] overflow-y-scroll">
                    {allUsers?.length > 0 ? allUsers?.map(singleUser => {
                          return (
                            <div key={singleUser._id} onClick={() => {
                              handleCurrentReciver(singleUser?.email)
                              setIsMessageBoxOpen(!isMessageBoxOpen)
                              setIsChatBoxOpen(!isChatBoxOpen)
                            }} className="flex gap-2 items-center text-xs font-medium hover:bg-gray-100 py-1 px-2 cursor-pointer rounded-lg">
                              <img className="w-6  rounded-full" src="https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no" alt="" />
                              <p>{singleUser.email.match(/[^@]*/)[0]?.split(".")[0]}</p>
                            </div>
                          )
                        }) : <div className="text-gray-500 mt-4 text-center">No user available!</div>}
                    </div>
                      </div>
                    </dialog>
                  </div>
                </div>

                <div className="relative ">
                  <input onChange={(e) => handleCoversationSearch(e)} onFocus={handleInputFocus}
                    onBlur={handleInputBlur} type="text" placeholder="Search users" className={`w-full bg-gray-100 outline-none py-2 px-3 rounded-full mt-3 mb-2 ${isInputFocused && 'shadow'} `} />
                  <button className="bg-purple-500 p-2 rounded-full text-white absolute right-2 translate-y-1/2"><AiOutlineSearch size={16} /></button>
                </div>
              </div>
              {conversationData?.length > 0 ? conversationData.sort((a, b) => {
                const aTimestamp = a?.messages[a.messages?.length - 1]?.timestamp
                const bTimestamp = b?.messages[b.messages?.length - 1]?.timestamp
                const sortADate = new Date(aTimestamp)
                const sortBDate = new Date(bTimestamp)
                return (sortBDate - sortADate)
              }).map(message => {
                


                let arrayLength = message?.messages?.length
                const lastMessageTimeStamp = message?.messages[arrayLength - 1]?.timestamp
                const lastMessageDate = new Date(lastMessageTimeStamp)
                const currentDate = new Date();
                const timeDifference = currentDate - lastMessageDate;
                const minutesDifference = Math.floor(timeDifference / 60000);
                const hoursDifference = Math.floor(timeDifference / 3600000);
                const daysDifference = Math.floor(timeDifference / 86400000);
                const weeksDifference = Math.floor(timeDifference / 604800000);
                const monthsDifference = Math.floor(timeDifference / 2630016000)
                const yearsDifference = Math.floor(timeDifference / 31536000000);

                const agoTime =  timeDifference < 60000 ? "Just now" : timeDifference >= 60000 && timeDifference < 3600000 ? minutesDifference + "m": timeDifference >= 3600000 && timeDifference < 86400000 ? hoursDifference + "h": timeDifference >= 86400000 && timeDifference < 604800000 ? daysDifference + "d": timeDifference >= 604800000 && timeDifference < 2630016000 ? weeksDifference + "w" : timeDifference >= 2630016000 && timeDifference < 31536000000 ? monthsDifference + "mo": timeDifference >= 31536000000 ? yearsDifference + "y" : ""


            

                const lastMsg = message?.messages[arrayLength - 1].text.length <= 17 ? message?.messages[arrayLength - 1].text: message?.messages[arrayLength - 1].text.slice(0, 17) + "..."
                const senderStatus = user.email == message?.messages[arrayLength - 1].sender && "You: "
                const reciverUserName = message?.participants?.find(participant => participant != user?.email)?.match(/[^@]*/)[0]?.split(".")[0]

                const unseenMessage = user.email == message?.messages[arrayLength - 1]?.receiver

                const seenMessageReceiver = message?.messages[arrayLength - 1]?.receiver
                const coversationID = message?._id
                const seenUnseenStatus = 'seen';

                return (
                  <div key={message._id} onClick={() => {
                    handleCurrentReciver(message?.participants?.find(participant => participant != user?.email))
                    setIsChatBoxOpen(!isChatBoxOpen)
                    setIsMessageBoxOpen(!isMessageBoxOpen)
                    handleSeenMessage(seenMessageReceiver, coversationID, seenUnseenStatus)
                  }} className="hover:bg-gray-100 px-4 flex item-center gap-3 py-3 cursor-pointer rounded-lg transition ">
                    <div>
                      <img className="h-14 w-14 rounded-full" src='https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png' alt="" />
                    </div>
                    <div>
                      <p className="text-black font-medium">{reciverUserName}</p>
                      <div className="flex gap-2">
                        <p className={` ${unseenMessage && !message.isMessageSeen ? "font-medium text-black":"text-gray-600"} text-sm `}>
                            {senderStatus}
                            {lastMsg}
                        </p>
                        <p className="text-gray-600 text-sm flex items-center"><BsDot size={10} className="p-0 m-0"/> {agoTime}</p>
                      </div>
                    </div>
                  </div>
                )
              }) : <div className="text-gray-500 mt-4 text-center">No chat available!</div>}

            </div>
            }

          </div>

          <div className="flex gap-3">
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
            <div>
              <p>{user?.full_name}</p>
              <p className="text-[#767678]">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}