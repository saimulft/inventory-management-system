import axios from "axios";
import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
  const { user } = useAuth();

  // socket install
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:9000");
  }, []);

  const [currentUser, setCurrentUser] = useState({});
  const [currentUserLoading, setCurrentUserLoading] = useState(false);

  useEffect(() => {
    setCurrentUserLoading(true);
    axios
      .get(
        `/api/v1/notifications_api/current_user?email=${user?.email}&user_role=${user?.role}`
      )
      .then((res) => {
        setCurrentUser(res.data);
        setCurrentUserLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setCurrentUserLoading(false);
      });
  }, [user?.email, user?.role]);

  // send current user into socket server
  useEffect(() => {
    if (currentUser) {
      socket.current?.emit("addCurrentUser", { currentUser });
    }
  }, [currentUser, socket]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [countsRefetch, setCountsRefetch] = useState(false)
  const [storeRefetch, setStoreRefetch] = useState(false)
  const modalMarginLeft = isSidebarOpen ? "18.5%" : "6%";

  // global info
  const GlobalInfo = {
    isSidebarOpen,
    setIsSidebarOpen,
    modalMarginLeft,
    countsRefetch,
    setCountsRefetch,
    storeRefetch,
    setStoreRefetch,
    socket,
    currentUser
  };

  return (
    <GlobalContext.Provider value={GlobalInfo}>
      {children}
    </GlobalContext.Provider>
  );
};
