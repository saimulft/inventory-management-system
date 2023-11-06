import { createContext, useContext, useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { AuthContext } from "./AuthProvider";
import { io } from "socket.io-client";

export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const { loading } = useContext(AuthContext);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);

  const [clickMsg, setClickMsg] = useState(false);

  const [addNewChat, setAddNewChat] = useState("");
  const [loadNewSMS, setLoadNewSMS] = useState(false)
  const [allUsersData, setAllUsersData] = useState([]);
  const [messagesData, setMessagesData] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentReciver, setCurrentReciver] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [reFatch, setReFatch] = useState(true);
  const [userMessagesList, setUserMessagesList] = useState([]);
  const [allMessages, setAllMessages] = useState({});
  const [isTypingLoading, setIsTypingLoading] = useState(false);

  const sendMessageRef = useRef();

  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:9000");
  }, []);

  useEffect(() => {
    if (user) {
      socket.current?.emit("addUsers", user || {});
      socket.current?.on("getUsers", (users) => {
        setActiveUsers(users);
      });
    }
  }, [user]);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/user_api/all_users")
      .then((res) => res.json())
      .then((data) => setAllUsersData(data));
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetch(
        `http://localhost:5000/api/v1/conversations_api/user_messages_list?sender=${user?.email}`
      )
        .then((res) => res.json())
        .then((data) => setUserMessagesList(data));
    }
  }, [user?.email]);

  const newMsgUpdateRealtime = (
    userConvasetionData,
    socketData,
    newReceiver
  ) => {
    const emailOne = socketData?.sender;
    const emailTwo = socketData?.receiver;

    if (newReceiver) {
      const prepairMessage = [
        {
          participants: [user?.email, newReceiver],
          isMessageSeen: false,
          messages: [
            {
              sender: socketData?.sender,
              receiver: socketData?.receiver,
              text: socketData?.text,
              timestamp: socketData?.timestamp,
            },
          ],
        },
      ];

      return prepairMessage;
    }

    const newList = userConvasetionData?.map((cd) => {
      const existOne = cd.participants.includes(emailOne);
      const existTwo = cd.participants.includes(emailTwo);

      if (existOne && existTwo) {
        const newLastMsg = {
          ...cd,
          lastMassages: socketData,
          isMessageSeen: false,
        };
        return newLastMsg;
      } else {
        return cd;
      }
    });

    return newList;
  };

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/v1/conversations_api/messages?sender=${user?.email}`
    )
      .then((res) => res.json())
      .then((data) => setMessagesData(data));
  }, []);

  const handleCurrentReciver = (email) => {
    const reciver = allUsersData?.find(
      (singleUser) => singleUser?.email == email
    );
    setCurrentReciver(reciver);
  };

  const handleMessage = (e, newReceiver = "") => {

    if (e.target.value) {
      setIsButtonDisabled(false);
    }

    if (e.type == "click" || e.key == "Enter") {

      socket.current?.emit("typing", {
        isTypingLoading: false,
        receiver: currentReciver.email,
      });

      setIsButtonDisabled(true);
      let msg = document.getElementById("message")?.value;
      const date = new Date();
      const timestamp = date.toISOString();
      if (msg) {
        const message = {
          sender: user?.email,
          receiver: newReceiver ? newReceiver : currentReciver?.email,
          text: msg,
          timestamp,
        };
        if (!newReceiver) {
          setAllMessages({
            ...allMessages,
            messages: [
              ...allMessages?.messages,
              {
                sender: message?.sender,
                receiver: message?.receiver,
                text: message?.text,
                timestamp,
              },
            ],
          });
        }else{
          setLoadNewSMS(!loadNewSMS)
        }

        setUserMessagesList(
          newMsgUpdateRealtime(userMessagesList, message, newReceiver)
        );
        socket.current.emit("sendMessage", message);
        document.getElementById("message").value = "";
        axios
          .post("/api/v1/conversations_api/send_message", message, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            if (res.data) {
              setReFatch((r) => !r);
              setAddNewChat("")
            }
          })
          .catch((err) => {
            console.log("err", err);
            setReFatch((r) => !r);
          });
      }
    }
  };

  const [newDataAdd, setNewDataAdd] = useState({});
  useEffect(() => {
    if (allMessages?.messages?.length > 0) {
      setAllMessages({
        ...allMessages,
        messages: [...allMessages?.messages, newDataAdd],
      });
    }

    setUserMessagesList(newMsgUpdateRealtime(userMessagesList, newDataAdd));
  }, [newDataAdd]);

  useEffect(() => {
    socket?.current?.on("getMessage", (data) => {
      setClickMsg(true);
      setNewDataAdd(data);

      // setAllMessages({
      //   ...allMessages,
      //   messages: [
      //     ...allMessages?.messages,
      //     {
      //    ...data
      //     },
      //   ],
      // });
    });
  }, []);

  const [showMessageListLoading, setShowMessageListLoading] = useState(true);
  useEffect(() => {
    const url = `http://localhost:5000/api/v1/conversations_api/single_conversation?sender=${user?.email}&receiver=${currentReciver?.email}`;

    const fetchData = () => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setShowMessageListLoading(false);
          }
          setAllMessages(data);
        });
    };

    if(!addNewChat){

      fetchData();
    }
  }, [user?.email, currentReciver?.email]);
  // }, [currentReciver?.email, user?.email, reFatch]);

  const handleSeenMessage = (e) => {
    if (e.focus == "focus") {
    }

    // console.log(id);
    // if (receiver == user.email) {
    //   axios
    //     .patch("/api/v1/conversations_api/messages/seen_messages", {
    //       id,
    //       seenUnseenStatus,
    //     })
    //     .then((response) => {
    //       console.log(response.data);
    //       setReFatch(!reFatch);
    //     })
    //     .catch((error) => console.error(error));
    // }
  };

  const handleTyping = (e) => {
    if (e?.target?.value) {
      socket.current?.emit("typing", {
        isTypingLoading: true,
        receiver: currentReciver.email,
      });
    } else {
      socket.current?.emit("typing", {
        isTypingLoading: false,
        receiver: currentReciver.email,
      });
    }
  };

  useEffect(() => {
    socket.current?.on("getTyping", (status) => {
      setIsTypingLoading(status);
    });
  }, []);

  // chat info
  const chatInfo = {
    allUsersData,
    messagesData,
    setMessagesData,
    activeUsers,
    currentReciver,
    handleCurrentReciver,
    isButtonDisabled,
    handleMessage,
    reFatch,
    setReFatch,
    // singleConversation,
    isMessageBoxOpen,
    setIsMessageBoxOpen,
    handleSeenMessage,
    sendMessageRef,
    userMessagesList,
    showMessageListLoading,
    allMessages,
    setAllMessages,
    setUserMessagesList,
    handleTyping,
    isTypingLoading,
    clickMsg,
    setClickMsg,
    addNewChat,
    setAddNewChat,setLoadNewSMS
  };

  return (
    <ChatContext.Provider value={chatInfo}>{children}</ChatContext.Provider>
  );
};
