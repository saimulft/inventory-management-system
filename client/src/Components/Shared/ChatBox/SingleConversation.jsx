import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../../Providers/ChatProvider";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import ChatLoading from "../../ChatLoading/ChatLoading";

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
  const [switchLick, setSwitchLick] = useState("");

// render message data first time 
 useEffect(()=>{
  setConversation([])
 },[])

  // scroll calculate
  const scrollPositionSet = () => {
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
        `/api/v1/conversations_api/single_conversation?sender=${
          user?.email
        }&receiver=${currentChatUserEmail}&page_no=${fastAdd ? 1 : pageCount}`
      )
      .then((res) => {
        setPageCount(pageCount + 1);

        // setConversation()
        setTemporaryData(res?.data?.message);
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
      
      let msg = document.getElementById("message_input")?.value;
      if (msg || text) {
        const date = new Date();
        const timestamp = date.toISOString();

        // new message data
        const message = {
          full_name: currentChatUserName,
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
          setConversation([...conversation, { ...message, _id: randomId }]);
          specificComponentRef.current.scrollTop = specificComponentRef.current.scrollHeight
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
        if (data?.data?.insertedId) {
          const fastTimeData = {
            _id: data.data.insertedId,
            participants: [user?.email, currentChatUserEmail],
            full_name: message?.full_name,
            isMessageSeen: false,
            lastMassages: {
              sender: message?.sender,
              receiver: message?.receiver,
              text: message?.text,
              timestamp,
            },
          };
          socket.current?.emit("sendMessageFastTime", fastTimeData);
          fetchConData(true);
          setNewConversationAdd(false);
        } else if (data?.data?._id) {
          socket.current?.emit("sendMessage", data?.data);
          typingStop();
          socket.current?.emit(
            "sentLestMessageUpdateConversationUserList",
            data?.data
          );
        }
      }
    } catch (err) {
      console.log(err);
      setConversation();
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

  /// get single message on socket
  useEffect(() => {
    socket?.current?.on("getMessage", (data) => {
      if (data) {
        setSocketData(data);
      }
    });
  }, []);
  //  get typing status
  useEffect(() => {
    socket?.current?.on("getTyping", (status) => {
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
          specificComponentRef.current.scrollTop = 5;
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

  let content;
  if (!conversationLoading && conversationError) {
    content = <p>Something is Wrong !</p>;
  } else if (
    (!conversationLoading && !conversationError && conversation?.length == 0) ||
    !conversation
  ) {
    content = <div> data not Found !</div>;
  } else if (conversation?.length > 0 || !conversationError) {
    content = conversation
      ?.filter((message) => Object.keys(message).length > 0)
      ?.sort((a, b) => {
        const timeA = a.timestamp;
        const timeB = b.timestamp;

        return timeDifference(timeB) - timeDifference(timeA);
      })
      ?.map((msg, key) => {
        const currentUser = msg?.sender == user?.email;

        const msgLengthCheck = msg?.text?.length <= 26;
        const text = msg?.text == "*like**" ? "👍" : msg?.text;
        if (text == "demo") {
          return;
        }
        return (
          <div id="messages_text" key={key}>
            <div
              className={`flex my-[8px] px-2 ${
                currentUser ? "justify-end " : "justify-start items-end "
              } ${
                conversation?.length - 1 == key && !chatLoadingStatus && " mb-5"
              }`}
            >
              {!currentUser && (
                <div className="w-[30px] h-[30px] rounded-full bg-black ml-1 mr-0.5 overflow-hidden">
                  <img
                    className="w-full h-full"
                    src="https://www.google.com/url?sa=i&url=https%3A%2F%2Freputationprotectiononline.com%2Freputation-score-survey%2F78-786207_user-avatar-png-user-avatar-icon-png-transparent%2F&psig=AOvVaw04DJKdroV2oI6yIBdZ0DXD&ust=1699574490607000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPjazb_OtYIDFQAAAAAdAAAAABAEhttps://reputationprotectiononline.com/wp-content/uploads/2022/04/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png"
                    alt="user"
                  />
                </div>
              )}
              <div
                className={`${
                  currentUser
                    ? msg?.text == "*like**"
                      ? "bg-transparent  text-4xl"
                      : "bg-purple-600 text-white rounded-s-lg rounded-b-lg break-words"
                    : msg?.text == "*like**"
                    ? "bg-transparent text-4xl"
                    : "bg-gray-200 text-black rounded-e-lg rounded-b-lg  break-words"
                } ${
                  msgLengthCheck ? "px-3 py-2" : " p-2 "
                }  max-w-[70%]`}
              >
                {text}
              </div>
            </div>
          </div>
        );
      });
  }

  const online = checkOnline(currentChatUserEmail);

  return (
    <div className="h-[550px] w-[350px] fixed bg-white shadow-2xl shadow-[#b1b1b1] border  right-20 bottom-0 rounded-t-xl overflow-hidden">
      {/* conversation header */}
      <div
        style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.1)" }}
        className="px-3 py-2 mb-1  flex gap-3 justify-between items-center text-xs font-medium  "
      >
        <div className="flex gap-3 items-center">
          <img
            className="w-10  rounded-full"
            src="https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no"
            alt=""
          />
          <div>
            <p className="font-medium text-base">
              {currentChatUserName ? currentChatUserName : "No Name"}
            </p>
            <div className="text-sm flex items-center">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  online ? "bg-green-500" : "bg-gray-400"
                } `}
              ></div>
              <div className={` pl-1`}>{online ? "Online" : "Offline"}</div>
            </div>
          </div>
        </div>
        <div className="p-1 rounded-full hover:bg-purple-100 text-purple-500 cursor-pointer">
          <AiOutlineClose
            onClick={handleOpenSingleConversationShow}
            size={22}
          />
        </div>
      </div>

      {/* message body */}
      <div
        ref={specificComponentRef}
        className="text-base"
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
        {chatLoadingStatus && online && <ChatLoading />}
      </div>

      {/* sent message box  */}
      <form
        style={{ boxShadow: "0px -1px 6px 0px rgba(0, 0, 0, 0.1)" }}
        className=""
      >
        <div className="flex items-center px-3 py-2 ">
          <input
            onChange={(e) => {
              handleTyping(e);
              setSwitchLick(e.target.value);
            }}
            id="message_input"
            rows="1"
            className="block mx-4 py-2 px-4 w-full text-sm text-gray-900 outline-none rounded-full bg-white  border border-gray-300 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
            placeholder="Your message..."
          ></input>
          {switchLick ? (
            <button
              onClick={handleSentNewMassages}
              type="submit"
              className="inline-flex justify-center p-2 text-purple-600 rounded-full cursor-pointer hover:bg-purple-100 dark:text-purple-500 dark:hover:bg-gray-600"
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
          ) : (
            <button onClick={(e) => handleSentNewMassages(e, "*like**")} className="text-[20px] hover:text-[22px] transition-all	duration-100">
              👍
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
