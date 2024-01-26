/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../../Providers/ChatProvider";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { format } from "date-fns";
import { AiOutlineClose } from "react-icons/ai";
import ChatLoading from "../../ChatLoading/ChatLoading";
// import { HiDotsVertical } from "react-icons/hi";

export default function SingleConversation() {
  const specificComponentRef = useRef(null);
  const { user } = useAuth();

  // chat context
  const {
    handleOpenSingleConversationShow,
    currentChatUserInfo,
    newConversationAdd,
    setNewConversationAdd,
    checkOnline,
    socket,
    conversationData,
    conversationDataRefetch,
    setConversationDataRefetch,
  } = useContext(ChatContext);

  const { currentChatUserName, currentChatUserEmail } =
    currentChatUserInfo || {};

  // all state
  const [conversation, setConversation] = useState([]);
  const [noSms, setNoSms] = useState(0);
  const [loadNew, setLoadNew] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [conversationError, setConversationError] = useState(false);
  const [socketData, setSocketData] = useState({});
  const [conversationLoading, setConversationLoading] = useState(false);
  const [temporaryData, setTemporaryData] = useState([]);
  const [calcScrollHeight, setCalcScrollHeight] = useState(0);
  const [chatLoadingStatus, setChatLoadingStatus] = useState(false);
  const [activeMessage, setActiveMessage] = useState("");
  const [messageSend, setMessageSend] = useState(false);
  const [messageSendSocket, setMessageSendSocket] = useState(false);
  // const [tooltipOpenID, setTooltipOpenID] = useState("")
  // const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  // const [generateRandomID, setGenerateRandomID] = useState("")


  // render message data first time
  useEffect(() => {
    setConversation([]);
  }, []);

  // scroll calculate
  const scrollPositionSet = () => {
    if (messageSendSocket) {
      setMessageSendSocket(false);
      return;
    }
    if (messageSend) {
      specificComponentRef.current.scrollTop =
        specificComponentRef.current.scrollHeight;
      setMessageSend(false);
      return;
    }
    setCalcScrollHeight(specificComponentRef.current.scrollHeight);
    if (conversation?.length > 16) {
      const goTo =
        specificComponentRef.current.scrollHeight - calcScrollHeight + 5;
      setNoSms(goTo);
      specificComponentRef.current.scrollTop = Number(goTo);
    }
  };

  // fetch cov data
  const fetchConData = async (fastAdd = false) => {
    if (noSms == 5) return;
    setConversationError(false);
    setConversationLoading(true);
    await axios
      .get(
        `/api/v1/conversations_api/single_conversation?sender=${user?.email
        }&receiver=${currentChatUserEmail}&page_no=${fastAdd ? 1 : pageCount}`
      )
      .then((res) => {
        setPageCount(pageCount + 1);
        setTemporaryData(res?.data?.message ? res?.data?.message : []);
        setConversationLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setConversationError(true);
        setConversationLoading(false);
      });
  };

  useEffect(() => {
    fetchConData();
  }, [currentChatUserEmail, user?.email, loadNew]);

  // typing start data sent with socket
  const typingStart = () =>
    socket.current?.emit("typing", {
      isTyping: true,
      receiver: currentChatUserEmail,
    });

  // typing stop data sent with socket
  const typingStop = () =>
    socket.current?.emit("typing", {
      isTyping: false,
      receiver: currentChatUserEmail,
    });

  // send typing status in server
  const handleTyping = (e) => {
    if (e?.target?.value) {
      typingStart();
    } else {
      typingStop();
    }
  };

  // handle sent new massages
  const handleSentNewMassages = async (e, text = "") => {
    try {
      e.preventDefault();
      setMessageSend(true);
      setActiveMessage('')
      let msg = document.getElementById("message_input")?.value;
      if (msg || text) {
        const date = new Date();
        const timestamp = date.toISOString();

        // new message data
        const message = {
          participants_name: [user?.full_name, currentChatUserName],
          sender: user?.email,
          receiver: currentChatUserEmail,
          text: text ? text : msg,
          timestamp,
        };

        // data update locale state
        if (!newConversationAdd) {
          const randomId = Math.floor(
            100000 + Math.random() * 9000000000000000
          );
          // setGenerateRandomID(JSON.stringify(randomId))
          setConversation([...conversation, { ...message, _id: randomId }]);
          specificComponentRef.current.scrollTop =
            specificComponentRef.current.scrollHeight;
        }

        document.getElementById("message_input").value = "";
        const data = await axios.post(
          "/api/v1/conversations_api/send_message",
          message,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data?.data) {
          socket.current.on("");
          // const localUpdatedMessages = conversation.filter(message => message._id != generateRandomID)
          // setConversation([...localUpdatedMessages, data.data])
        }

        const seenMassageStatus = (sender, receiver) => {
          const emailToUsername = (email) => email.split("@")[0];
          const userValue = {
            [emailToUsername(sender)]: true,
            [emailToUsername(receiver)]: false,
          };
          return userValue;
        };

        const isMessageSeen = seenMassageStatus(
          user?.email,
          currentChatUserEmail
        );

        if (data?.data?.insertedId) {
          setConversationDataRefetch(!conversationDataRefetch)
          const firstTimeData = {
            _id: data.data.insertedId,
            participants: [user?.email, currentChatUserEmail],
            participants_name: [user?.full_name, currentChatUserName],
            isMessageSeen,
            lastMassages: {
              sender: message?.sender,
              receiver: message?.receiver,
              text: message?.text,
              timestamp,
            },
          };

          socket.current?.emit("sendMessageFastTime", firstTimeData);
          fetchConData(true);
          setNewConversationAdd(false);
        } else if (data?.data?._id) {
          socket.current?.emit("sendMessage", data?.data);
          typingStop();
          socket.current?.emit("sentLestMessageUpdateConversationUserList", {
            ...data?.data,
            isMessageSeen,
          });
        }
      }
    } catch (err) {
      console.log(err);
      setConversation([]);
    }
  };

  // Function to calculate the time difference
  const timeDifference = (timestamp) => {
    const currentDateTime = new Date();
    const timestampDateTime = new Date(timestamp);
    return Math.abs(currentDateTime - timestampDateTime);
  };

  // all useEffect
  useEffect(() => {
    scrollPositionSet();
  }, [conversation]);

  useEffect(() => {
    if (conversation?.length == 1) {
      setConversation(temporaryData);
    } else {
      setConversation([...temporaryData, ...conversation]);
    }
  }, [temporaryData]);

  // update single message update state with socket data
  useEffect(() => {
    if (socketData) {
      setConversation([...conversation, socketData]);
    }
  }, [socketData]);

  //  get typing status
  useEffect(() => {
    socket?.current?.on("getTyping", (status) => {
      setMessageSendSocket(true);
      setChatLoadingStatus(status);
    });
  }, [socket]);

  useEffect(() => {
    if (conversation?.length > 0 || conversation?.length <= 15) {
      if (pageCount <= 2) {
        specificComponentRef.current.scrollTop =
          specificComponentRef.current.scrollHeight;
      }
    }
  }, [specificComponentRef, conversation]);

  // find scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (specificComponentRef.current) {
        // Calculate the scroll position relative to the specific component
        const componentScrollTop = specificComponentRef.current.scrollTop;
        if (parseInt(componentScrollTop) == 0 && !conversationLoading) {
          specificComponentRef.current.scrollTop = 1;
          setLoadNew((e) => !e);
        }
      }
    };
    if (specificComponentRef.current) {
      specificComponentRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (specificComponentRef.current) {
        specificComponentRef.current.removeEventListener(
          "scroll",
          handleScroll
        );
      }
    };
  }, [temporaryData]);

  //  handle seen unseen status
  const handleSeenUnseen = (e) => {
    if (e.type == "focus") {
      const conversationId = conversationData?._id;
      const currentUserEmail = user?.email;
      axios
        .patch(
          `/api/v1/conversations_api/messages/seen_messages?id=${conversationId}&email=${currentUserEmail}`
        )
        .then(() => {
          setConversationDataRefetch(!conversationDataRefetch);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // const deleteMessage = (msgID) => {
  //   axios.patch(`/api/v1/conversations_api/messages/delete_message?conversation_id=${conversationData._id}&message_id=${msgID}`)
  //     .then(res => {
  //       if (res.data.success) {
  //         const deletedMessageID = res.data.messageData.messageID
  //         const updatedMessages = conversation.filter(singleMessage => singleMessage._id != deletedMessageID)
  //         setConversation(updatedMessages)
  //       }
  //     })
  //     .catch((error) => console.log(error))
  // }

  /// get single message on socket
  useEffect(() => {
    socket?.current?.on("getMessage", (data) => {
      if (data) {
        socket.current?.emit("sentSeenUnseenStatus", {
          status: true,
          receiver: data?.sender,
        });
        setSocketData(data);
      }
    });
  }, [socket]);

  let content;
  if (!conversationLoading && conversationError) {
    content = <p className="text-center mt-4 text-lg font-medium text-red-500">Something is Wrong !</p>;
  } else if (conversation?.length > 0 || !conversationError) {
    let previousTime = ''
    content = conversation
      ?.filter((message) => Object.keys(message).length > 0)
      ?.sort((a, b) => {
        const timeA = a.timestamp;
        const timeB = b.timestamp;
        return timeDifference(timeB) - timeDifference(timeA);
      })
      ?.map((msg, key) => {
        const currentUser = msg?.sender == user?.email;
        const msgLengthCheck = msg?.text?.length <= 19;
        const text = msg?.text
        const calculateAgoTime = (time) => {
          const lastMessageDate = new Date(time);
          const currentDate = new Date();
          const timeDifference = currentDate - lastMessageDate;

          const agoTime = timeDifference < 60000
            ? "Just now" :
            timeDifference >= 60000 && timeDifference < 86400000
              ? "Today, " + format(new Date(msg.timestamp), "h:mm a")
              : timeDifference >= 86400000 && timeDifference < 31536000000
                ? format(new Date(msg.timestamp), "MMM d yyyy, h:mm a")
                : "";

          if (previousTime != agoTime) {
            previousTime = agoTime
            return agoTime
          }
          else {
            return ""
          }
        };

        if (text == "demo") {
          return;
        }

        const calculateAgoTimeValue = calculateAgoTime(msg.timestamp)
        return (
          <div id="messages_text" key={key}>
            <p className={`text-center py-2 text-xs text-[#817d7d] ${calculateAgoTimeValue ? "block" : 'hidden'} `}>{calculateAgoTimeValue}</p>
            <div
              className={`flex items-center gap-1 my-[6px] px-2 ${currentUser ? "justify-end " : "justify-start items-end "
                } ${conversation?.length - 1 == key && !chatLoadingStatus && " mb-[6px] "
                } group `}
            >
              {/* <div className="relative">
                {currentUser && < p onClick={() => {
                  setTooltipOpenID(msg._id)
                  setIsTooltipOpen(true)
                }} className={` ${tooltipOpenID == msg._id ? "visible" : "invisible"} group-hover:visible text-[17px] text-[#8a8989] hover:bg-[#eaeaea] transition duration-150 cursor-pointer p-[6px] rounded-full`} > <HiDotsVertical /></p>}
                {tooltipOpenID == msg._id && <p id="msg_dl" onClick={() => deleteMessage(msg._id)} className="absolute z-[120] bottom-7 rounded bg-[#eaeaea] hover:bg-[#e0e0e0] text-sm px-3 py-1 right-6 shadow">Delete</p>}
              </div> */}
              <div
                className={`${currentUser
                  ? "bg-purple-600 text-white  break-words"
                  : "bg-[#eaeaea] text-black break-words"
                  } ${msgLengthCheck ? "rounded-full" : "rounded-xl"
                  }  mx-0.5 py-[6px] px-3 max-w-[65%] cursor-pointer ${msgLengthCheck.length}`}
              >
                <p className="text-[15px]">{text}</p>
              </div>
            </div>
          </div >
        );
      });
  }
  const online = checkOnline(currentChatUserEmail);

  return (
    <>
      {/* {isTooltipOpen && <div className="absolute bg-[#494a4963] top-0 right-0 bottom-0 left-0 z-40"></div>} */}
      <div className="h-[600px] w-[400px] fixed bg-white shadow-2xl shadow-[#b1b1b1] border border-[#cacaca] right-1 bottom-[0%] z-30 rounded overflow-hidden">
        {/* conversation header */}
        <div
          style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.1)" }}
          className="px-3 py-2 mb-1  flex gap-3 justify-between items-center text-xs font-medium"
        >
          <div className="flex gap-3 items-center">
            <img
              className="w-10  rounded-full"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3Z9rMHYtAHW14fQYWqzPoARdimFbyhm0Crw&usqp=CAU"
              alt=""
            />
            <div>
              <p className="font-medium text-base">
                {currentChatUserName ? currentChatUserName : "Anonymous"}
              </p>
              {!chatLoadingStatus && <div className="text-sm flex items-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${online ? "bg-green-500" : "bg-gray-400"
                    } `}
                ></div>
                <div className={` pl-1 ${!online && "text-[#8C8D90]"}`}>
                  {online ? "Online" : "Offline"}
                </div>
              </div>}
              {chatLoadingStatus && online && <ChatLoading />}
            </div>
          </div>
          <div onClick={handleOpenSingleConversationShow} className=" rounded-full p-[3px] hover:bg-purple-100 text-purple-500 cursor-pointer">
            <AiOutlineClose
              size={22}
            />
          </div>
        </div>

        {/* message body */}
        <div
          ref={specificComponentRef}
          className="text-base message_body"
          style={{
            height: "calc(100% - 120px)",
            overflowY: "auto",
          }}
        >
          {conversationLoading && (
            <div className="flex justify-center">
              <p className="w-10 h-10 animate-spin border-4 border-purple-500 border-dotted rounded-full"></p>
            </div>
          )}
          {content}
        </div>

        {/* sent message box  */}
        <form
          style={{ boxShadow: "0px -1px 6px 0px rgba(0, 0, 0, 0.1)" }}
          className=""
        >
          <div className="flex items-center px-3 py-2 ">
            <input
              autoFocus
              onFocus={handleSeenUnseen}
              onChange={(e) => {
                handleTyping(e);
                setActiveMessage(e.target.value);
              }}
              id="message_input"
              rows="1"
              className="block mx-2 py-2 px-4 w-full text-sm text-gray-900 outline-none rounded-full bg-white  border border-gray-300 focus:ring-purple-500 focus:border-purple-500  "
              placeholder="Your message..."
            ></input>
            <button
              disabled={!activeMessage}
              onClick={handleSentNewMassages}
              type="submit"
              className={`inline-flex justify-center items-center p-[10px]  rounded-full  ${activeMessage ? "text-purple-600 hover:bg-purple-200 " : ""} `}
            >
              <svg
                className="w-5 h-5 rotate-90"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 20"
              >
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}