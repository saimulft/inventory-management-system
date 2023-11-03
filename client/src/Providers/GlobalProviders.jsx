import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isActiveSetting, setIsActiveSetting] = useState("profile");

  const [countsRefetch, setCountsRefetch] = useState(false)

  const modalMarginLeft = isSidebarOpen ? "18.5%" : "6%";


  // global info
  const GlobalInfo = {
    isSidebarOpen,
    setIsSidebarOpen,
    isActiveSetting,
    setIsActiveSetting,
    modalMarginLeft,
    countsRefetch, 
    setCountsRefetch
  };

  return (
    <GlobalContext.Provider value={GlobalInfo}>
      {children}
    </GlobalContext.Provider>
  );
};
