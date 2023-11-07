import { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { ChatContext } from "../../../Providers/ChatProvider";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

export default function ConversationUserList() {
  // chat context
  const {
    handleOpenSingleConversationShow,
    handleNewConversation,
    alreadyConversationUserState,
    alreadyConversationUserSetState,
    currentChatUserSetInfo,
  } = useContext(ChatContext);

  //set current Chat User Info
  const { setCurrentChatUserName, setCurrentChatUserEmail } =
    currentChatUserSetInfo || {};

  const [data, loading, error] = alreadyConversationUserState;
  const [setData, setLoading, setError] = alreadyConversationUserSetState;

  const [search, setSearch] = useState("");
  console.log(
    "🚀 ~ file: ConversationUserList.jsx:25 ~ ConversationUserList ~ search:",
    search
  );

  const { user } = useAuth();

  // get already conversation user data
  useEffect(() => {
    setError(false);
    setLoading(true);
    axios
      .get(
        `http://localhost:5000/api/v1/conversations_api/user_messages_list?sender=${user?.email}`
      )
      .then((res) => {
        setData(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        setLoading(false);
      });
  }, [user?.email]);

  // data sort by time
  const dataSortByTime = (data) => {
    const sortedData = data?.sort((a, b) => {
      const aTimestamp = a?.lastMassages?.timestamp;
      const bTimestamp = b?.lastMassages?.timestamp;
      const sortADate = new Date(aTimestamp);
      const sortBDate = new Date(bTimestamp);
      return sortBDate - sortADate;
    });
    return sortedData;
  };

  //calculate ago time
  const calculateAgeTime = (time) => {
    const lastMessageDate = new Date(time);
    const currentDate = new Date();
    const timeDifference = currentDate - lastMessageDate;
    const minutesDifference = Math.floor(timeDifference / 60000);
    const hoursDifference = Math.floor(timeDifference / 3600000);
    const daysDifference = Math.floor(timeDifference / 86400000);
    const weeksDifference = Math.floor(timeDifference / 604800000);
    const monthsDifference = Math.floor(timeDifference / 2630016000);
    const yearsDifference = Math.floor(timeDifference / 31536000000);

    const agoTime =
      timeDifference < 60000
        ? "Just now"
        : timeDifference >= 60000 && timeDifference < 3600000
        ? minutesDifference + "m"
        : timeDifference >= 3600000 && timeDifference < 86400000
        ? hoursDifference + "h"
        : timeDifference >= 86400000 && timeDifference < 604800000
        ? daysDifference + "d"
        : timeDifference >= 604800000 && timeDifference < 2630016000
        ? weeksDifference + "w"
        : timeDifference >= 2630016000 && timeDifference < 31536000000
        ? monthsDifference + "mo"
        : timeDifference >= 31536000000
        ? yearsDifference + "y"
        : "";

    return agoTime;
  };

  // last message slice defined sender status
  const massagesSliceAndSenderStatus = (data) => {
    const lastMsg =
      data?.lastMassages?.text.length <= 17
        ? data?.lastMassages?.text
        : data?.lastMassages?.text.slice(0, 17) + "...";

    const senderStatus = user.email == data?.lastMassages?.sender && "You:";
    const result = senderStatus + " " + lastMsg;
    return result;
  };

  // current chat user email find
  const currentChatReceiver = (data) => {
    const email = data?.find((e) => e != user?.email);

    return email;
  };
  // user Conversation List Search
  const userConversationListSearch = (data) => {
    if (search) {
      const result = data.filter((d) => d?.full_name.toLowerCase().includes(search.toLowerCase()));
      return result;
    } else {
      return data;
    }
  };

  console.log("userConversationListSearch", userConversationListSearch(data));

  // decide what to render
  let content;
  if (loading) {
    content = <p>Loading...</p>;
  } else if (!loading && error) {
    content = <p>Something is Wrong !</p>;
  } else if (!loading && !error && data.length > 0) {
    content = dataSortByTime(userConversationListSearch(data))?.map((userData) => {
      return (
        <div
          onClick={(e) => {
            handleOpenSingleConversationShow(e);
            setCurrentChatUserName(userData?.full_name);
            setCurrentChatUserEmail(
              currentChatReceiver(userData?.participants)
            );
          }}
          key={userData?._id}
          className="p-2 mb-2 flex gap-3 items-center text-xs font-medium bg-gray-50 hover:bg-gray-100 py-1 px-2 cursor-pointer rounded-lg"
        >
          <img
            className="w-14  rounded-full"
            src="https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no"
            alt=""
          />
          <div>
            <p className="font-medium text-base">{userData?.full_name}</p>
            <div className="text-sm flex items-center">
              <span className="">{massagesSliceAndSenderStatus(userData)}</span>
              <span className="pl-2">
                {calculateAgeTime(userData?.lastMassages?.timestamp)}
              </span>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="h-[550px] w-[350px] fixed bg-white shadow-2xl shadow-[#b1b1b1] right-20 bottom-0 rounded-t-xl">
      {/* chat head  */}
      <div className="p-3 flex justify-between items-center py-3 border-b border-gray-300">
        <p className="font-bold text-2xl">Chats</p>
        <p
          onClick={handleNewConversation}
          className="px-3 py-[6px] text-sm rounded-full bg-gray-200 cursor-pointer"
        >
          + Add
        </p>
      </div>
      {/* search bar  */}
      <div className="relative px-3">
        <input
          onChange={(e) => setSearch(e?.target?.value)}
          type="text"
          value={search}
          placeholder="Search users"
          className={`w-full bg-gray-100 outline-none py-2 px-3 rounded-full mt-3 mb-2`}
        />
        <button className="bg-purple-500 p-2 rounded-full text-white absolute right-2 translate-y-1/2">
          <AiOutlineSearch size={16} />
        </button>
      </div>
      {/* user chat list  */}
      <div className="p-3 h-[calc(100%_-_126px)] overflow-y-scroll">
        {content}
      </div>
    </div>
  );
}
