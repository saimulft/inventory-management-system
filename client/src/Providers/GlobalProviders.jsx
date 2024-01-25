import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // socket install
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:9000");
  }, []);

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
    socket
  };

  return (
    <GlobalContext.Provider value={GlobalInfo}>
      {children}
    </GlobalContext.Provider>
  );
};
