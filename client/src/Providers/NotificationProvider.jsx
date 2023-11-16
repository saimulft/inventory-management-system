import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { GlobalContext } from "./GlobalProviders";

export const NotificationContext = createContext(null)

const NotificationProvider = ({ children }) => {
    const {user} = useAuth()
    const {socket} = useContext(GlobalContext)

    const[currentUser, setCurrentUser]=useState({})
    const[currentUserLoading, setCurrentUserLoading]=useState(false)
    const[notificationStatus, setNotificationStatus] = useState("")

    // get the user with creator email 
    useEffect(()=>{
        setCurrentUserLoading(true)
        console.log(user?.role);
    axios.get(`/api/v1/notifications_api/current_user?email=${user?.email}&user_role=${user?.role}`)
    .then(res => {
        setCurrentUser(res.data)
        setCurrentUserLoading(false)
    })
    .catch(error => {
        console.log(error);
        setCurrentUserLoading(false)
    })
    },[user?.email])

    // send current user into socket server 
    useEffect(()=>{
        if(currentUser){
            socket.current?.emit("addCurrentUser", ({currentUser}))   
        }
    },[currentUser, socket])
    
    // get notification 
    socket.current?.on("getNotification" , (data) => {
        setNotificationStatus(data?.status)
        console.log(data.status);
        
    })

const notificationInfo = {
user,
currentUser,
notificationStatus
}
    return (
        <NotificationContext.Provider value={notificationInfo}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;