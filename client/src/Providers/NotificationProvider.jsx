import { createContext, useContext, useState } from "react";
import useAuth from "../hooks/useAuth";
import { GlobalContext } from "./GlobalProviders";

export const NotificationContext = createContext(null);

const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const { currentUser } = useContext(GlobalContext);
  const [notificationAlert, setNotificationAlert] = useState(true)

  const notificationInfo = {
    user,
    currentUser,
    notificationAlert,
    setNotificationAlert
  };

  return (
    <NotificationContext.Provider value={notificationInfo}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
