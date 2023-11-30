import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../../Providers/ChatProvider";
import { GlobalContext } from "../../../Providers/GlobalProviders";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";

export default function NotificationBox({notificationsRef}) {
  const navigate = useNavigate()
  const { isNotificationBoxOpen, setIsNotificationBoxOpen } = useContext(ChatContext);
  const { socket } = useContext(GlobalContext);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [updateNotificationDB, setUpdateNotificationDB] = useState(false);
  const [skip, setSkip] = useState(0);
  
  const handleNotificationsData = () => {
    axios
      .get(
        `/api/v1/notifications_api/notifications?email=${user?.email}&limit=10&skip=${skip}`
      )
      .then((res) => {
        setSkip(skip + 10);
        const notificationData = [...notifications, ...res.data];
        setNotifications(notificationData);
      })
      .catch((error) => console.log(error));
  };

  // generate notification redirect url 
const handleNavigateUrl = (url, notification_search, notification) => {
  console.log(notification_search);
  setIsNotificationBoxOpen(false)
  if(user?.role == "Admin" ||user?.role ==  "Admin VA" || user?.role == "Warehouse Admin" || user?.role == "Warehouse Manager VA" && !Array.isArray(url) && notification_search.length < 2){
  const link = url.split("/")
  const indexToReplace = 3;
  const newValue = "inventory"
  link[indexToReplace] = newValue
  const generatedLink = link.join("/") + `?notification_search=${notification_search}`
  navigate(generatedLink)
}
if(user?.role == "Store Manager Admin" || user?.role == "Store Manager VA" && !Array.isArray(url) && notification_search.length < 2){
  let generatedLink = ""
  if(notification?.notification_search.length > 1){
     generatedLink = url + `?notification_search=${notification_search}&missing_arrival_status=active`
  }
  else{
    generatedLink = url + `?notification_search=${notification_search}`
  }
  
  navigate(generatedLink)
}
  }

  // render the notifications data first time 
  useEffect(() => {
    handleNotificationsData();
  }, [user?.email, updateNotificationDB]);

  // get notification
  socket?.current?.on("getNotification", ({notificationData}) => {
    setNotifications([notificationData, ...notifications])
    setUpdateNotificationDB(!updateNotificationDB);
  });

  //calculate ago time
  const calculateAgoTime = (time) => {
    const lastMessageDate = new Date(time);
    const currentDate = new Date();
    const timeDifference = currentDate - lastMessageDate;
    const minutesDifference = Math.floor(timeDifference / 60000);
    const hoursDifference = Math.floor(timeDifference / 3600000);
    const daysDifference = Math.floor(timeDifference / 86400000);
    const weeksDifference = Math.floor(timeDifference / 604800000);
    const monthsDifference = Math.floor(timeDifference / 2630016000);
    const yearsDifference = Math.floor(timeDifference / 31536000000);

    const agoTime =
      timeDifference < 60000
        ? "Just now"
        : timeDifference >= 60000 && timeDifference < 3600000
        ? minutesDifference + "m ago"
        : timeDifference >= 3600000 && timeDifference < 86400000
        ? hoursDifference + "h ago"
        : timeDifference >= 86400000 && timeDifference < 604800000
        ? daysDifference + "d ago"
        : timeDifference >= 604800000 && timeDifference < 2630016000
        ? weeksDifference + "w ago"
        : timeDifference >= 2630016000 && timeDifference < 31536000000
        ? monthsDifference + "mo ago"
        : timeDifference >= 31536000000
        ? yearsDifference + "y ago"
        : "";

    return agoTime;
  };

  // handle scroll 
const handleScroll = (event) => {
const {scrollTop, scrollHeight, clientHeight} = event.target
if(scrollTop + clientHeight == scrollHeight){
handleNotificationsData()
}
  };

  return (
    <div>
      {isNotificationBoxOpen && (
        <div className="  fixed right-10 top-[74px] shadow-2xl z-50 bg-white rounded-b-lg h-[600px] w-[400px] py-4">
          <div className="text-black px-4 py-2">
            <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Notifications</h3>
            <div onClick={() => setIsNotificationBoxOpen(false)} className="flex items-center">
            <button
              className="p-1 transition rounded-full text-purple-500 bg-purple-50 hover:bg-purple-100"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
            </div>
            <div className="flex gap-2 mt-3 mb-2">
            {notifications?.length > 0 && <p className="bg-purple-50 font-medium cursor-pointer px-4 py-1 rounded-full hover:bg-purple-100 transition hover:shadow text-sm">
                Mark all as read
              </p>}
            </div>
          </div>
          <div
          onScroll={handleScroll}
            ref={notificationsRef}
            className="h-[488px]  overflow-y-scroll notifications_box"
          >
          <div>  {notifications?.map((notification) => {
              const notification_link = notification?.notification_link
              const notification_search = notification?.notification_search
              return (
                <div
                onClick={notification_search?.length < 2 ? () => handleNavigateUrl(notification_link, notification_search) :null }
                  key={notification?._id}
                  className="hover:bg-gray-100 px-4 flex items-center gap-3 py-3 cursor-pointer  transition "
                >
                  <div>
                    <div className=" h-14 w-14 rounded-full">
                      <img
                        className="rounded-full"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3Z9rMHYtAHW14fQYWqzPoARdimFbyhm0Crw&usqp=CAU"
                        alt=""
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-black ">
                      <span className="font-medium text-md">
                        {notification?.notification_sender_name}
                      </span>
                      <span className="text-sm"> {notification?.status}</span>
                     {notification_search?.length > 1 && <span onClick={() => handleNavigateUrl(notification_link[0],notification_search[0])} className="underline text-xs ml-1 text-purple-500 hover:text-purple-800">All Stock</span>}
                     {notification_search?.length > 1 && <span onClick={() => handleNavigateUrl(notification_link[1],notification_search[1], notification)} className="underline text-xs ml-2 text-purple-500 hover:text-purple-800">Missing Arrival</span>}
                    </p>
                    <p className="text-purple-500 text-xs">
                      {calculateAgoTime(notification?.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}</div>

          {notifications?.length == 0 && <div className="text-xl font-medium text-center text-purple-500">Notifications data not available!</div> }
          </div>
        </div>
      )}
    </div>
  );
}
