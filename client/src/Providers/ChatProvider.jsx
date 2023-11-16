import { createContext, useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { io } from "socket.io-client";

export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  // chat head infomation
  const [currentChatUserName, setCurrentChatUserName] = useState("");
  const [currentChatUserEmail, setCurrentChatUserEmail] = useState("");
  const currentChatUserInfo = { currentChatUserName, currentChatUserEmail };
  const currentChatUserSetInfo = {
    setCurrentChatUserName,
    setCurrentChatUserEmail,
  };

  // user info
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState([]);

  // socket install
  const socket = useRef();

  useEffect(() => {
    socket.current = io("wss://ims-socket-backend.nabilnewaz.com");
  }, []);

  useEffect(() => {
    if (user) {
      socket.current?.emit("addUsers", user || {});
      socket.current?.on("getUsers", (users) => {
        setActiveUsers(users);
      });
    }
  }, [user]);

  const checkOnline = (userEmail) =>
    activeUsers?.find((active) => active?.email == userEmail);
  const currentReceiverFind = (participants) =>
    participants.find((p) => p != user?.email);

  // message box open close handle state
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [singleConversationShow, setSingleConversationShow] = useState(false);
  const [addNewConversation, setAddNewConversation] = useState(false);
  const [newConversationAdd, setNewConversationAdd] = useState(false);

  // console.log({ isChatBoxOpen, singleConversationShow, addNewConversation });

  // message box open close handle function
  // single conversation show
  const handleOpenSingleConversationShow = () => {
    setSingleConversationShow(!singleConversationShow);
    setIsChatBoxOpen(!isChatBoxOpen);
    setNewConversationAdd(false);
  };

  //add New Conversation
  const handleNewConversation = () => {
    setAddNewConversation(!addNewConversation);
    setSingleConversationShow(false);
    setIsChatBoxOpen(false);
  };

  //add New Conversation text box
  const handleNewConversationTextBox = () => {
    setSingleConversationShow(true);
    setAddNewConversation(!addNewConversation);
  };

  //all user state
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const [allUsersError, setAllUsersError] = useState(false);
  const allUsersState = [allUsers, allUsersLoading, allUsersError];
  const allUsersSetState = [setAllUsers, setAllUsersLoading, setAllUsersError];

  // already conversation user data state
  const [alreadyConversationUser, setAlreadyConversationUser] = useState([]);
  const [alreadyConversationUserLoading, setAlreadyConversationUserLoading] =
    useState(false);
  const [alreadyConversationUserError, setAlreadyConversationUserError] =
    useState(false);
  const alreadyConversationUserState = [
    alreadyConversationUser,
    alreadyConversationUserLoading,
    alreadyConversationUserError,
  ];
  const alreadyConversationUserSetState = [
    setAlreadyConversationUser,
    setAlreadyConversationUserLoading,
    setAlreadyConversationUserError,
  ];

  // chat info
  const chatInfo = {
    // new code
    socket,
    activeUsers,
    checkOnline,
    currentReceiverFind,
    isChatBoxOpen,
    setIsChatBoxOpen,
    singleConversationShow,
    setSingleConversationShow,
    addNewConversation,
    setAddNewConversation,
    newConversationAdd,
    setNewConversationAdd,
    handleOpenSingleConversationShow,
    handleNewConversation,
    handleNewConversationTextBox,
    allUsersState,
    allUsersSetState,
    currentChatUserInfo,
    currentChatUserSetInfo,
    alreadyConversationUserState,
    alreadyConversationUserSetState,
  };

  return (
    <ChatContext.Provider value={chatInfo}>{children}</ChatContext.Provider>
  );
};
