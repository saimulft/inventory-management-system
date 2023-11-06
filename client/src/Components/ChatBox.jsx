import { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiSolidSend } from "react-icons/bi";
import useAuth from "../hooks/useAuth";
import { ChatContext } from "../Providers/ChatProvider";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import ChatLoading from "../Loading/ChatLoading";

export default function ChatBox({ participants }) {
  const {
    isButtonDisabled,
    handleMessage,
    sendMessageRef,
    isMessageBoxOpen,
    setIsMessageBoxOpen,
    currentReciver,
    activeUsers,
    handleSeenMessage,
    allMessages,
    setAllMessages,
    handleTyping,
    isTypingLoading,
    clickMsg, setClickMsg,addNewChat, setAddNewChat, setLoadNewSMS
  } = useContext(ChatContext);

  const { user } = useAuth();
  const receiver = participants.find(
    (participant) => participant != user?.email
  );

  const [allMessagesDataLoading, setAllMessagesDataLoading] = useState(false);
  const [alredyLoodingData, setAlredyLoodingData] = useState(String);

  const [scrollTop, setScrollTop] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  const msgDataHandale = (conut) => {
    if (allMessagesDataLoading) {
      return;
    }
    setAllMessagesDataLoading(true);
    axios
      .get(
        `/api/v1/conversations_api/single_conversation?sender=${user?.email}&receiver=${receiver}&page_no=${conut}`
      )
      .then((res) => {
        if (conut > 1) {
          setAllMessages({
            ...allMessages,
            messages: [...allMessages?.messages, ...res?.data?.messages],
          });
          setAlredyLoodingData(res?.data?._id);
          setAllMessagesDataLoading(false);
        } else {
          setAllMessages(res.data);
          setAllMessagesDataLoading(false);
        }
        setAllMessagesDataLoading(false);
        setPageCount(pageCount + 1);
      })
      .catch((err) => {
        setAllMessagesDataLoading(false);
      });
  };

  useEffect(() => {
    if ((user?.email && receiver) || allMessages?._id != alredyLoodingData) {
      msgDataHandale(pageCount);
    }
  }, [user?.email, receiver, scrollTop, setLoadNewSMS]);

  // find scroll
  const [currentPosition, setCurrentPosition] = useState(Number)
  useEffect((e) => {
    const handleScroll = () => {
      if (specificComponentRef.current) {
        // Calculate the scroll position relative to the specific component
        const componentScrollTop = specificComponentRef.current.scrollTop;
        setCurrentPosition(componentScrollTop)
        if (componentScrollTop === 0 && !allMessagesDataLoading) {
          // msgDataHandale();

          setScrollTop(true);
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
  }, []);

  const currentReceiverUserName = addNewChat ? addNewChat?.match(/[^@]*/)[0]?.split(".")[0] : receiver?.match(/[^@]*/)[0]?.split(".")[0];
  let arrayLength = allMessages?.messages?.length;
  // const seenMessageReceiver = allMessages?.messages[arrayLength - 1]?.receiver;
  const seenMessageReceiver = "toukir486@gmail.com";
  const coversationID = allMessages?._id;
  const seenUnseenStatus = false;

  const [calcScrollHeight, setCalcScrollHeight] = useState(0);
  // const [sentMsgScrollButtom, setSentMsgScrollButtom] = useState(false);
  const specificComponentRef = useRef(null);

  const scrollPositionSet = () => {
    setCalcScrollHeight(specificComponentRef.current.scrollHeight);
    if (pageCount == 1 || pageCount == 2 || clickMsg ) {
      if (clickMsg) {
        setClickMsg(false);
      }

      if (specificComponentRef.current) {
        specificComponentRef.current.scrollTop =
          specificComponentRef.current.scrollHeight;
      }
    } else {
      const goTo = specificComponentRef.current.scrollHeight - calcScrollHeight;
      specificComponentRef.current.scrollTop = goTo;
    }
  };

  // scroll only buttom
  const scrollButtom = () => {
    if (specificComponentRef.current) {
      specificComponentRef.current.scrollTop =
        specificComponentRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollButtom();
  }, []);

  const handleScroll = () => {
      specificComponentRef.current.scrollTop =
      specificComponentRef.current.scrollHeight + 20; 
   
  };
  useEffect(()=>{
  if(isTypingLoading){
    handleScroll()
  }
  },[isTypingLoading])

  useEffect(() => {
    scrollPositionSet();
  }, [allMessages]);

  // Function to calculate the time difference
  const timeDifference = (timestamp) => {
    const currentDateTime = new Date();
    const timestampDateTime = new Date(timestamp);
    return Math.abs(currentDateTime - timestampDateTime);
  };

  // Formats a timestamp based on its proximity to the current date and time.
  const formatTimestamp = (timestamp) => {
    const currentDateTime = new Date();
    const timestampDateTime = new Date(timestamp);
    const timeDifference = currentDateTime - timestampDateTime;
    const oneDayMilliseconds = 24 * 60 * 60 * 1000; // Number of milliseconds in one day

    if (timeDifference >= oneDayMilliseconds) {
      // If the time is older than 1 day, show the full date
      const options = { year: "numeric", month: "short", day: "numeric" };
      return timestampDateTime.toLocaleDateString(undefined, options);
    } else {
      // If the time is within 1 day, show only the time
      const options = { hour: "2-digit", minute: "2-digit" };
      return timestampDateTime.toLocaleTimeString(undefined, options);
    }
  };
console.log(allMessages);

  return (
    <div className="h-[500px] w-[350px] fixed bg-white shadow-2xl right-20 bottom-0 rounded-t-lg ">
      {/* message head  */}
      <div
        style={{ boxShadow: "0px 2px 20px 0px rgba(0,0,0,0.1)" }}
        className="flex justify-between items-center  px-3"
      >
        <div className="py-3">
          <div className="flex items-center gap-2 ">
            <img
              className="w-10 h-10 rounded-full"
              src="https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png"
              alt=""
            />
            <div>
              <p className="font-medium capitalize">{currentReceiverUserName}</p>
              <p className="text-sm text-gray-500">
                {activeUsers?.find(
                  (active) => active?.email == currentReciver?.email
                ) ? (
                  <div className="flex gap-x-1 items-center">
                    <p className="w-2 h-2 rounded-full bg-green-500"></p>
                    <p>Online</p>
                  </div>
                ) : (
                  <div className="flex gap-x-1 items-center">
                    <p className="w-2 h-2 rounded-full bg-gray-300"></p>
                    <p>Offline</p>
                  </div>
                )}
              </p>
            </div>
          </div>
        </div>
        <div
          onClick={() => setIsMessageBoxOpen(!isMessageBoxOpen)}
          className="hover:bg-gray-100 transition p-1 rounded-full text-purple-500"
        >
          <AiOutlineClose size={22} />
        </div>
      </div>
      {/* message body  */}
      {allMessagesDataLoading && (
        <div class="w-8 h-8 rounded-full animate-spin border-4 border-dotted my-3 mx-auto border-purple-500 border-t-transparent"></div>
      )}
      <div
        ref={specificComponentRef}
        id="chatBox"
        className="chat_box h-[380px] py-2 overflow-y-scroll transition-scroll-behavior duration-500"
      >
        <div>
          {allMessages?.messages
            ?.sort((a, b) => {
              const timeA = a.timestamp;
              const timeB = b.timestamp;

              return timeDifference(timeB) - timeDifference(timeA);
            })
            ?.map((message, key) => {
              if (!message.text) {
                return;
              }
              console.log("chatbox clg",message);
              
              const currentUser = message?.sender == user?.email;
              const msgLengthCheck = message.text.length <= 26;
              const msg = message.text;
              const messageTime = formatTimestamp(message.timestamp);

              return (
                <div key={key}>
                  {/* <p className="text-sm font-medium text-center py-1">
                  {messageTime}
                </p> */}
                  <div
                    className={`flex ${
                      currentUser
                        ? "justify-end my-[2px] "
                        : "justify-start my-[2px]"
                    }`}
                  >
                    <div
                      className={`${
                        currentUser
                          ? "bg-purple-600 text-white  break-words"
                          : "bg-gray-200 text-black   break-words"
                      } ${
                        msgLengthCheck ? "rounded-full" : "rounded-xl"
                      }  mx-2 py-[5px] px-3 max-w-[65%]`}
                    >
                      {msg}
                    </div>
                  </div>
                </div>
              );
            })}
          {isTypingLoading && (
            <ChatLoading userName={currentReceiverUserName} />
          )}
        </div>
      </div>
      {/* message footer  */}
      <div
        style={{ boxShadow: "0px -2px 20px 0px rgba(0,0,0,0.1)" }}
        className="flex justify-between items-center py-2 px-3 gap-2"
      >
        <input
          ref={sendMessageRef}
          autoFocus
          onFocus={(e)=>{
            handleSeenMessage(e)
            handleTyping(e)
          }}
          onChange={handleTyping}
          onKeyUp={(e) => {
            setClickMsg(true);
            handleMessage(e);
          }}
          id="message"
          placeholder="Aa"
          className="outline-none bg-gray-100 rounded-full py-1 px-3 w-full"
          type="text"
        />
        <button
          disabled={isButtonDisabled}
          onClick={(e) => {
            setClickMsg(true);
           
            
            handleMessage(e, addNewChat);
          }}
          className={` ${
            isButtonDisabled ? "" : "hover:bg-gray-100 text-purple-500"
          } p-2   transition rounded-full flex justify-center items-center `}
        >
          <BiSolidSend size={22} />
        </button>
      </div>
    </div>
  );
}
