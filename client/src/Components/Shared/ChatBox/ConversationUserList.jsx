/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { ChatContext } from "../../../Providers/ChatProvider";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BsDot } from "react-icons/bs";

export default function ConversationUserList() {
  // chat context
  const {
    handleOpenSingleConversationShow,
    handleNewConversation,
    alreadyConversationUserState,
    alreadyConversationUserSetState,
    currentChatUserSetInfo,
    checkOnline,
    currentReceiverFind,
    socket,
    setIsChatBoxOpen,
    setConversationData,
    conversationDataRefetch,
    setIsMessageSeen,
    setMessageAlert,
  } = useContext(ChatContext);



  //set current Chat User Info
  const { setCurrentChatUserName, setCurrentChatUserEmail } =
    currentChatUserSetInfo || {};
  const [data, loading, error] = alreadyConversationUserState;
  const [setData, setLoading, setError] = alreadyConversationUserSetState;
  const [search, setSearch] = useState("");
  const [socketData, setSocketData] = useState({});
  const [filterData, setFilterData] = useState(Number);
  const [
    updateLestMessageUpdateConversationUserList,
    setUpdateLestMessageUpdateConversationUserList,
  ] = useState({});

  const { user } = useAuth();

  // update every message in real time conversation user list
  const newMessagesUpdateRealtime = (userConversationData, socketData) => {

    const emailOne = socketData?.sender;
    const emailTwo = socketData?.receiver;

    const newList = userConversationData?.map((cd) => {
      const existOne = cd?.participants?.includes(emailOne);
      const existTwo = cd?.participants?.includes(emailTwo);

      if (existOne && existTwo) {
        const incomingMessages = {
          receiver: socketData?.receiver,
          sender: socketData?.sender,
          text: socketData?.text,
          timestamp: socketData?.timestamp,
          _id: socketData?._id,
        };

        const newLastMsg = {
          ...cd,
          isMessageSeen: socketData?.isMessageSeen,
          lastMassages: incomingMessages,
        };
        return newLastMsg;
      } else {
        return cd;
      }
    });

    return newList;
  };

  // get message every time data in conversation list in socket
  useEffect(() => {
    socket?.current?.on(
      "getLestMessageUpdateConversationUserList",
      (socketData) => {
        setUpdateLestMessageUpdateConversationUserList(socketData);
      }
    );
  }, [socket]);

  useEffect(() => {
    setData(
      newMessagesUpdateRealtime(
        data,
        updateLestMessageUpdateConversationUserList
      )
    );
  }, [updateLestMessageUpdateConversationUserList]);

  // get message fast time data in client
  useEffect(() => {
    socket?.current?.on("getMessageFastTime", (data) => {
      if (data) {
        setSocketData(data);
      }
    });
  }, [socket]);
  // fast time data in STATE with socket
  useEffect(() => {
    setData([...data, socketData]);
  }, [socketData]);

  // get already conversation user data
  useEffect(() => {
    setError(false);
    setLoading(true);
    axios
      .get(
        `/api/v1/conversations_api/user_messages_list?sender=${user?.email}`
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
  }, [user?.email, conversationDataRefetch]);

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
  const calculateAgoTime = (time) => {
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
      data?.lastMassages?.text == "*like**"
        ? "👍"
        : data?.lastMassages?.text.length <= 11
          ? data?.lastMassages?.text
          : data?.lastMassages?.text.slice(0, 11) + "...";

    const senderStatus = user.email == data?.lastMassages?.sender ? "You:" : "";
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
      const result = data.filter((d) => {
        const messageSenderName = d?.participants_name
          ?.find((name) => name != user?.full_name)
          ?.toLowerCase();
        const filterData = messageSenderName?.includes(
          search?.toLocaleLowerCase()
        );
        return filterData;
      });
      return result;
    } else {
      return data;
    }
  };

  // message seen unseen status
  const messageSeenUnseenStatus = (data) => {
    const currentUserSeenStatus = user.email.split("@")[0];
    const checkSeenUnseen = data.isMessageSeen[currentUserSeenStatus];
    return checkSeenUnseen;
  };

  const currentUserObjKey = user?.email?.split("@")[0];
  if (data) {
    const unreadMessage = data?.find(d => {
      if (d?.isMessageSeen) {
        if (!d.isMessageSeen[currentUserObjKey]) {
          return true
        }
      }
    })
    setMessageAlert(unreadMessage)
  }

  // decide what to render
  let content;
  if (loading) {
    content = (
      <div className="flex justify-center">
        <p className="w-10 h-10 animate-spin border-4 border-purple-500 border-dotted rounded-full"></p>
      </div>
    );
  } else if (!loading && error) {
    content = <p></p>;
  } else if (!loading && !error && data.length > 0) {

    content = dataSortByTime(userConversationListSearch(data))?.map(
      (userData) => {
        const online = checkOnline(currentReceiverFind(userData?.participants));
        const senderName = userData?.participants_name?.find(
          (name) => name != user?.full_name
        );

        const isMessageSeen = userData.isMessageSeen;
        Object.keys(isMessageSeen).forEach((key) => {
          let value = isMessageSeen[key];
          if (key != user?.email?.split("@")[0]) {
            setIsMessageSeen(value);
          }
        });

        return (
          <div
            onClick={(e) => {
              handleOpenSingleConversationShow(e);
              setCurrentChatUserName(senderName);
              setCurrentChatUserEmail(
                currentChatReceiver(userData?.participants)
              );
              setConversationData(userData);
            }}
            key={userData?._id}
            className=" flex gap-3 items-center text-xs font-medium hover:bg-gray-100   py-2 px-4 cursor-pointer "
          >
            <div className="w-14 h-14  rounded-full relative">
              <img
                className="w-14  rounded-full"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3Z9rMHYtAHW14fQYWqzPoARdimFbyhm0Crw&usqp=CAU"
                alt=""
              />
              <div
                className={`absolute w-3 h-3 rounded-full bottom-[74%] left-[74%] ${online && "bg-green-500"
                  }    `}
              ></div>
            </div>

            <div>
              <p className=" text-base">{senderName}</p>
              <div className="text-sm flex items-center">
                <span
                  className={`${messageSeenUnseenStatus(userData) ? "text-[#8C8D90]" : ""
                    } text-xs`}
                >
                  {massagesSliceAndSenderStatus(userData)}
                </span>
                <span
                  className={`${messageSeenUnseenStatus(userData) ? "text-[#8C8D90]" : ""
                    } pl-2 flex items-center text-xs `}
                >
                  <BsDot />{" "}
                  {calculateAgoTime(userData?.lastMassages?.timestamp)}
                </span>
              </div>
            </div>
          </div>
        );
      }
    );

  }

  return (
    <div className={`h-[600px] w-[400px] fixed bg-white shadow-2xl shadow-[#b1b1b1] right-1 bottom-0 z-50 rounded`}>
      {/* chat head  */}
      <div className="p-3 flex justify-between items-center pt-3  border-gray-300">
        <p className="font-bold text-2xl">Chats</p>
        <div className="flex gap-2">
          <button
            onClick={handleNewConversation}
            className="px-3 py-[5px] text-sm rounded-full bg-purple-50  transition hover:bg-purple-100 text-purple-500  flex items-center gap-1  cursor-pointer"
          >
            <AiOutlinePlus /> <p>Users</p>
          </button>
          <div className="flex items-center">
            <button
              onClick={() => setIsChatBoxOpen(false)}
              className="p-1 transition rounded-full text-purple-500 bg-purple-50 hover:bg-purple-100"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>
      </div>
      {/* search bar  */}
      <div className="relative px-3">
        <input
          onChange={(e) => setSearch(e?.target?.value)}
          type="text"
          value={search}
          placeholder="Search conversations"
          className={`w-full bg-gray-100 outline-none py-2 px-3 rounded-full  mb-2`}
        />
        <button className="bg-purple-500 p-2 rounded-full text-white absolute top-1 right-4 ">
          <AiOutlineSearch size={16} />
        </button>
      </div>
      {/* user chat list  */}
      <div className="chat_list h-[calc(100%_-_126px)] overflow-y-scroll">
        {content}
        {data.length < 1 && !loading && !search && (
          <p className="text-center mt-4 text-lg font-medium text-purple-500">
            Let's begin conversation!
          </p>
        )}
        {filterData < 1 && !loading && search && (
          <p className="text-center mt-4 text-lg font-medium text-purple-500">
            Search data not available!
          </p>
        )}
      </div>
    </div>
  );
}
