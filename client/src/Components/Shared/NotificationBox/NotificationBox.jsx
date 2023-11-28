import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../../Providers/ChatProvider";
import { GlobalContext } from "../../../Providers/GlobalProviders";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function NotificationBox({notificationsRef}) {
  const navigate = useNavigate()
  const { isNotificationBoxOpen } = useContext(ChatContext);
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

const handleNavigateUrl = (url, notification_search) => {
  if(user?.role == "Admin" ||user?.role ==  "Admin VA" || user?.role == "Warehouse Admin" || user?.role == "Warehouse Manager VA"){
  const link = url.split("/")
  const indexToReplace = 3;
  const newValue = "inventory"
  link[indexToReplace] = newValue
  const generatedLink = link.join("/") + `?notification_search=${notification_search}`
  console.log(generatedLink);
  navigate(generatedLink)
}
if(user?.role == "Store Manager Admin" || user?.role == "Store Manager VA"){
  const generatedLink = url + `?notification_search=${notification_search}`
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
          <div className="text-black p-4">
            <h3 className="text-2xl font-bold">Notifications</h3>
            <div className="flex gap-2 mt-3 mb-2">
              <p className="bg-purple-50 font-medium cursor-pointer px-4 py-1 rounded-full hover:bg-purple-100 transition hover:shadow">
                All
              </p>
              <p className="bg-purple-50 font-medium cursor-pointer px-4 py-1 rounded-full hover:bg-purple-100 transition hover:shadow">
                Unread
              </p>
            </div>
          </div>
          <div
          onScroll={handleScroll}
            ref={notificationsRef}
            className="h-[467px]  overflow-y-scroll notifications_box"
          >
            {notifications?.map((notification) => {
              const notification_link = notification?.notification_link
              const notification_search = notification?.notification_search
              return (
                <div
                onClick={() => handleNavigateUrl(notification_link, notification_search)}
                  key={notification?._id}
                  className="hover:bg-gray-100 px-4 flex items-center gap-3 py-3 cursor-pointer rounded-lg transition "
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
                    </p>
                    <p className="text-purple-500 text-xs">
                      {calculateAgoTime(notification?.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
