import { createContext, useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { io } from "socket.io-client";

export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const { user } = useAuth(); 
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);

  const [allUsersData, setAllUsersData] = useState([]);
  const [messagesData, setMessagesData] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentReciver, setCurrentReciver] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [reFatch, setReFatch] = useState(true);
  const [singleConversation, setSingleConversation] = useState([]);

  const sendMessageRef = useRef()

  // const [lastMessageReceiver, setLastMessageReceiver] = useState("")
  // console.log(lastMessageReceiver)

  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:9000");
  }, []);
  useEffect(() => {
    socket.current?.emit("addUsers", user || {});
    socket.current?.on("getUsers", (users) => {
      setActiveUsers(users);
    });
  }, [user]);
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/user_api/all_users")
      .then((res) => res.json())
      .then((data) => setAllUsersData(data));
  }, []);
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/v1/conversations_api/messages?sender=${user?.email}`
    )
      .then((res) => res.json())
      .then((data) => setMessagesData(data));
  }, [singleConversation, messagesData]);

  const handleCurrentReciver = (email) => {
    const reciver = allUsersData?.find(
      (singleUser) => singleUser?.email == email
    );
    setCurrentReciver(reciver);
  };

  const handleMessage = (e) => {
 if (e.target.value) {
  setIsButtonDisabled(false);
}

    if(e.type == "click" || e.key == "Enter"){
         setIsButtonDisabled(true);
    let msg = document.getElementById("message")?.value;
    if (msg) {
      const message = {
        sender: user?.email,
        receiver: currentReciver?.email,
        reciverName: currentReciver?.name,
        text: msg,
      };
      const date = new Date();
      const timestamp = date.toISOString();

      setSingleConversation({
        ...singleConversation,
        messages: [
          ...singleConversation?.messages,
          {
            sender: message?.sender,
            receiver: message?.receiver,
            text: message?.text,
            timestamp,
          },
        ],
      });

      socket.current.emit("sendMessage", message);
      socket.current.on("getMessage", (data) => {
        setSingleConversation({
          ...singleConversation,
          messages: [
            ...singleConversation?.messages,
            {
              sender: data?.sender,
              receiver: data?.receiver,
              text: data?.text,
              timestamp,
            },
          ],
        });
      });
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
          }
        })
        .catch((err) => {
          console.log("err", err);
          setReFatch((r) => !r);
        });
    }
    }

 
  };

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/v1/conversations_api/single_conversation?sender=${user?.email}&receiver=${currentReciver?.email}`
    )
      .then((res) => res.json())
      .then((data) => setSingleConversation(data));
  }, [currentReciver?.email, user?.email, reFatch]);

  const handleSeenMessage = (receiver, id, seenUnseenStatus) => {
    console.log(id)
    if (receiver == user.email){
      axios.patch('/api/v1/conversations_api/messages/seen_messages', {  id, seenUnseenStatus })
    .then(response => {
      console.log(response.data)
      setReFatch(!reFatch)
    })
    .catch(error => console.error(error));
    
    }
}

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
    singleConversation,
    isMessageBoxOpen,
    setIsMessageBoxOpen,
    handleSeenMessage,
    sendMessageRef
  };

  return (
    <ChatContext.Provider value={chatInfo}>{children}</ChatContext.Provider>
  );
};
