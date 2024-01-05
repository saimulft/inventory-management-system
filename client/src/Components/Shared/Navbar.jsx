import { AiOutlineMessage, AiOutlineSearch } from "react-icons/ai";
import { BsBell } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import useGlobal from "../../hooks/useGlobal";
import { ChatContext } from "../../Providers/ChatProvider";
import { useContext} from "react";
import { NotificationContext } from "../../Providers/NotificationProvider";

export default function Navbar() {
  const {
    setAddNewConversation,
    isChatBoxOpen,
    setIsChatBoxOpen,
    addNewConversation,
    singleConversationShow,
    setSingleConversationShow,
    isNotificationBoxOpen, setIsNotificationBoxOpen,messageAlert
  } = useContext(ChatContext);
  const {notificationAlert} = useContext(NotificationContext);

  const { user } = useAuth()
  const { pageName } = useGlobal()
  const defaultPageName = user?.role === 'Admin' || user?.role === 'Admin VA' ? 'Dashboard' : user?.role === 'Store Owner' ? 'Profit Tracker' : 'Management';

  return (
    <div className="flex items-center px-8 ps-3 pe-3 bg-[#2e2e30]  text-white shadow-sm py-3">
      <div className="text-lg font-medium w-full ">{pageName ? pageName : defaultPageName}</div>
      {/* notification, messeage and profile  */}
      <div className="w-full flex justify-end items-center gap-4  z-[1]">
        <div className="bg-[#454547] p-3 rounded relative hidden">
          <AiOutlineSearch size={20} />
        </div>

        {/* notification btn  */}
        <div className="relative">
          <div
            onClick={() => {
              setIsNotificationBoxOpen(!isNotificationBoxOpen)
              setIsChatBoxOpen(false)
            }}
            className="bg-[#454547] hover:bg-[#3f3f41] cursor-pointer transition-all duration-15 p-3 rounded relative"
          >
            <BsBell size={20} />
      {  notificationAlert &&  <>
            <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
            <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span>
            </>}
          </div>
        </div>

        {/* message btn  */}
        <div className="relative">
          <div
            onClick={() => {
              if (
                isChatBoxOpen ||
                singleConversationShow ||
                addNewConversation
              ) {
                setIsChatBoxOpen(false);
                setAddNewConversation(false);
                setSingleConversationShow(false);
                setAddNewConversation(false);
                return;
              }
              setIsChatBoxOpen(true);
              setIsNotificationBoxOpen(false)
            }}
            className="bg-[#454547] hover:bg-[#3f3f41] cursor-pointer transition-all duration-15 p-3 rounded relative"
          >
            <AiOutlineMessage size={20} />
             {messageAlert && <> <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
            <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span></>}
          </div>
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
