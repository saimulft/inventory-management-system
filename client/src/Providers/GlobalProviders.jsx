import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isActiveSetting, setIsActiveSetting] = useState("profile");
  const [countsRefetch, setCountsRefetch] = useState(false)
  const [storeRefetch, setStoreRefetch] = useState(false)
  const modalMarginLeft = isSidebarOpen ? "18.5%" : "6%";
  const [pageName, setPageName] = useState(null)

  // global info
  const GlobalInfo = {
    pageName,
    setPageName,
    isSidebarOpen,
    setIsSidebarOpen,
    isActiveSetting,
    setIsActiveSetting,
    modalMarginLeft,
    countsRefetch, 
    setCountsRefetch,
    storeRefetch,
    setStoreRefetch
  };

  return (
    <GlobalContext.Provider value={GlobalInfo}>
      {children}
    </GlobalContext.Provider>
  );
};
