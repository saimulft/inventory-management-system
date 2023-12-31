import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../../Providers/ChatProvider";
import axios from "axios";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import useAuth from "../../../hooks/useAuth";

export default function AddNewConversation() {
  // chat context
  const {
    handleOpenSingleConversationShow,
    handleNewConversationTextBox,
    allUsersState,
    allUsersSetState,
    currentChatUserSetInfo,
    setNewConversationAdd,
    setSingleConversationShow,
    setAddNewConversation
  } = useContext(ChatContext);

  const { user } = useAuth();

  const [data, loading, error] = allUsersState;
  const [setData, setLoading, setError] = allUsersSetState;
  const [addConversationSearch, setAddConversationSearch] = useState("")

  useEffect(() => {
    setError(false);
    setLoading(true);
    axios
      .get(`/api/v1/conversations_api/add_users_list?user=${user?.email}`)
      .then((res) => {
        setData(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        setLoading(false);
      });
  }, []);


  //set current Chat User Info
  const { setCurrentChatUserName, setCurrentChatUserEmail } =
    currentChatUserSetInfo || {};

  // decide what to render
  let content;
  if (loading) {
    content = <div className="flex justify-center"><p className="w-10 h-10 animate-spin border-4 border-purple-500 border-dotted rounded-full"></p></div>;
  } else if (!loading && error) {
    content = <p>Something is Wrong !</p>;
  } else if (!loading && !error && data.length > 0) {
    content = data?.map((user) => {
      return (
        <div
          onClick={() => {
            setCurrentChatUserName(user?.full_name);
            setCurrentChatUserEmail(user?.email);
            setNewConversationAdd(true);
            handleNewConversationTextBox();
          }}
          key={user?._id}
          className="  flex gap-3 items-center text-xs font-medium  hover:bg-gray-100 py-2 px-4 cursor-pointer rounded-lg"
        >
          <img
            className="w-12  rounded-full"
            src="https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no"
            alt=""
          />
          <div>
            <p className="font-medium text-base">{user?.full_name}</p>
            <span className="">{user?.email}</span>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="h-[550px] w-[350px] fixed bg-white shadow-2xl shadow-[#b1b1b1] border border-[#cacaca] right-20 bottom-0 rounded-t-xl overflow-hidden">
      {/* add new conversation user list */}
      <div className="px-3 py-4  flex gap-3 justify-between text-xs font-medium ">
        <p className="text-lg font-bold">New Conversation</p>
        <div className="p-1 rounded-full hover:bg-purple-100 text-purple-500">
          <AiOutlineClose
            onClick={() => {
              handleOpenSingleConversationShow()
              setAddNewConversation(false)
              setSingleConversationShow(false)

            }}
            size={22}
            className="cursor-pointer "
          />
        </div>
      </div>

        {/* search bar  */}
        <div className="relative px-3">
        <input
          onChange={(e) => setAddConversationSearch(e?.target?.value)}
          type="text"
          value={addConversationSearch}
          placeholder="Search users"
          className={`w-full bg-gray-100 outline-none py-2 px-3 rounded-full  mb-2`}
        />
        <button className="bg-purple-500 p-2 rounded-full text-white absolute top-1 right-4 ">
          <AiOutlineSearch size={16} />
        </button>
      </div>

      {/* add new conversation list  */}
      <div className="new_conversation  h-[calc(100%_-_56px)] overflow-y-scroll">
        {content}
      </div>
    </div>
  );
}
