import { AiOutlineMessage, AiOutlineSearch } from "react-icons/ai";
import { BsBell } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import useGlobal from "../../hooks/useGlobal";
import { ChatContext } from "../../Providers/ChatProvider";
import { useContext} from "react";

export default function Navbar() {
  const {
    setAddNewConversation,
    isChatBoxOpen,
    setIsChatBoxOpen,
    addNewConversation,
    singleConversationShow,
    setSingleConversationShow,
    isNotificationBoxOpen, setIsNotificationBoxOpen
  } = useContext(ChatContext);


  const { user } = useAuth()
  const { pageName } = useGlobal()
  const defaultPageName = user?.role === 'Admin' || user?.role === 'Admin VA' ? 'Dashboard' : user?.role === 'Store Owner' ? 'Profit Tracker' : 'Management';

  return (
    <div className="flex items-center px-8 ps-3 pe-3 bg-[#2e2e30]  text-white shadow-sm py-3">
      <div className="text-lg font-medium w-full ">{pageName ? pageName : defaultPageName}</div>
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
          <div
            onClick={() => setIsNotificationBoxOpen(!isNotificationBoxOpen)}
            className="bg-[#454547] hover:bg-[#3f3f41] cursor-pointer transition-all duration-15 p-3 rounded relative"
          >
            <BsBell size={20} />
            <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
            <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span>
          </div>

          {/* notifications box  */}
          {/* {isNotificationBoxOpen && (
            <div className=" notifications_box absolute -right-44 top-14 shadow-2xl z-10 bg-white overflow-y-scroll rounded-lg h-[590px] w-[350px] px-2 py-4">
              <div className="text-black px-2">
                <h3 className="text-2xl font-bold">Notifications</h3>
                <div className="flex gap-2 mt-3 mb-2">
                  <p className="bg-purple-50 font-medium cursor-pointer px-4 py-1 rounded-full hover:bg-purple-100 transition hover:shadow">
                    All
                  </p>
                  <p className="bg-purple-50 font-medium cursor-pointer px-4 py-1 rounded-full hover:bg-purple-100 transition hover:shadow">
                    Unread
                  </p>
                </div>
              </div>
              {data.map((d, index) => {
                return (
                  <div
                    key={index}
                    className="hover:bg-gray-100 px-4 flex item-center gap-3 py-3 cursor-pointer rounded-lg transition "
                  >
                    <div>
                      <img
                        className="h-14 w-14 rounded-full"
                        src="https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no"
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="text-black ">
                        <span className="font-medium">Toukir Ahmed</span>{" "}
                        posted 2 links.
                      </p>
                      <p className="text-purple-500">a day ago</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )} */}
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
                //
                setIsChatBoxOpen(false);
                setAddNewConversation(false);
                setSingleConversationShow(false);
                setAddNewConversation(false);
                return;
              }
              setIsChatBoxOpen(true);
            }}
            className="bg-[#454547] hover:bg-[#3f3f41] cursor-pointer transition-all duration-15 p-3 rounded relative"
          >
            <AiOutlineMessage size={20} />
            <span className="animate-ping absolute top-1 right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
            <span className="h-1 w-1 rounded-full bg-red-500 absolute inline top-2 right-2"></span>
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
