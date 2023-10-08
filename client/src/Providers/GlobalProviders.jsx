import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isActiveSetting, setIsActiveSetting] = useState("profile");

  // global info
  const GlobalInfo = {
    isSidebarOpen,
    setIsSidebarOpen,
    isActiveSetting,
    setIsActiveSetting,
  };

  return (
    <GlobalContext.Provider value={GlobalInfo}>
      {children}
    </GlobalContext.Provider>
  );
};
