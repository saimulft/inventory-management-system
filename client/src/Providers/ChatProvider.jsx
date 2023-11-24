import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { GlobalContext } from "./GlobalProviders";

export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const [conversationDataRefetch, setConversationDataRefetch] = useState(false);
  const [isMessageSeen, setIsMessageSeen] = useState(false)


  // chat head information
  const [currentChatUserName, setCurrentChatUserName] = useState("");
  const [currentChatUserEmail, setCurrentChatUserEmail] = useState("");
  const currentChatUserInfo = { currentChatUserName, currentChatUserEmail };
  const currentChatUserSetInfo = {
    setCurrentChatUserName,
    setCurrentChatUserEmail,
  };
  const [conversationData, setConversationData] = useState();

  const { socket } = useContext(GlobalContext);

  // user info
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState([]);

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

  // message box open close handle state
  const [isNotificationBoxOpen, setIsNotificationBoxOpen] = useState(false);

  // message box open close handle function
  // single conversation show
  const handleOpenSingleConversationShow = () => {
    socket.current?.emit("typing", {
      isTyping: false,
      receiver: currentChatUserEmail,
    });
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
    isNotificationBoxOpen,
    setIsNotificationBoxOpen,
    conversationData,
    setConversationData,
    conversationDataRefetch,
    setConversationDataRefetch,
    isMessageSeen, setIsMessageSeen
  };
  return (
    <ChatContext.Provider value={chatInfo}>{children}</ChatContext.Provider>
  );
};
