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
    setAddNewConversation,
    checkOnline,
  } = useContext(ChatContext);

  const { user } = useAuth();

  const [data, loading, error] = allUsersState;
  const [setData, setLoading, setError] = allUsersSetState;
  const [addConversationSearch, setAddConversationSearch] = useState("");
  const [addConversationSearchData, setAddConversationSearchData] = useState([
    ...data,
  ]);
  const [searchError, setSearchError] = useState(false)

  // set default data
  useEffect(() => {
    setAddConversationSearchData(data);
  }, [data]);

  // add conversation search
  const handleAddConversationSearch = (e) => {
    const search = e?.target?.value?.toLowerCase();
    if (search) {
      const searchData = data.filter((d) =>
        d?.full_name?.toLowerCase()?.includes(search)
      );
      setSearchError(true)
      setAddConversationSearchData(searchData);
    } else {
      setSearchError(false)
      setAddConversationSearchData(data);
    }
  };

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
    content = (
      <div className="flex justify-center">
        <p className="w-10 h-10 animate-spin border-4 border-purple-500 border-dotted rounded-full"></p>
      </div>
    );
  } else if (!loading && !error && data.length > 0) {
    content = addConversationSearchData?.map((user) => {
      const online = checkOnline(user.email)
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
          <div className="relative">
            <img
              className="w-12  rounded-full"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3Z9rMHYtAHW14fQYWqzPoARdimFbyhm0Crw&usqp=CAU"
              alt=""
            />
            <div
              className={`absolute w-3 h-3 rounded-full top-[74%] left-[74%] ${online && "bg-green-500"
                }    `}
            ></div>
          </div>
          <div>
            <p className="font-medium text-base">{user?.full_name}</p>
            <span className="text-[#8C8D90]">{user?.email}</span>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="h-[600px] w-[400px] fixed bg-white shadow-2xl shadow-[#b1b1b1] border border-[#e2e2e2c4] right-1 bottom-[0%] z-50 rounded overflow-hidden">
      {/* add new conversation user list */}
      <div className="px-3 py-4  flex gap-3 justify-between text-xs font-medium ">
        <p className="text-lg font-bold">New Conversation</p>
        <div onClick={() => {
          handleOpenSingleConversationShow();
          setAddNewConversation(false);
          setSingleConversationShow(false);
        }} className="p-1 rounded-full hover:bg-purple-100 text-purple-500">
          <AiOutlineClose
            size={22}
            className="cursor-pointer "
          />
        </div>
      </div>

      {/* search bar  */}
      <div className="relative px-3">
        <input
          onChange={(e) => {
            setAddConversationSearch(e?.target?.value);
            handleAddConversationSearch(e);
          }}
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
      <div className="new_conversation  h-[489px] overflow-y-scroll">
        {content}
        {data.length < 1 && !loading && !searchError && (
          <p className="text-center mt-4 text-lg font-medium text-purple-500">
            No users available!
          </p>
        )}
        {addConversationSearchData < 1 && !loading && searchError && (
          <p className="text-center mt-4 text-lg font-medium text-purple-500">
            Search data not available!
          </p>
        )}
      </div>
    </div>
  );
}