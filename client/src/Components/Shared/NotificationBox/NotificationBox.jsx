import { useContext } from "react";
import { ChatContext } from "../../../Providers/ChatProvider";

export default function NotificationBox() {
    const {isNotificationBoxOpen} = useContext(ChatContext)

    const data = [
        {
          id: 1,
          img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
          name: "Toukir Ahmed",
          last_message: "how are you?",
          time: "31m"
        },
        {
          id: 2,
          img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
          name: "Nabil Newaz",
          last_message: "how are you?",
          time: "31m"
        },
        {
          id: 3,
          img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
          name: "Torikul Islam",
          last_message: "how are you?",
          time: "31m"
        },
        {
          id: 4,
          img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
          name: "Toukir Ahmed",
          last_message: "how are you?",
          time: "31m"
        },
        {
          id: 5,
          img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
          name: "Toukir Ahmed",
          last_message: "how are you?",
          time: "31m"
        },
        {
          id: 6,
          img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
          name: "Toukir Ahmed",
          last_message: "how are you?",
          time: "31m"
        },
        {
          id: 7,
          img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
          name: "Toukir Ahmed",
          last_message: "how are you?",
          time: "31m"
        },
        {
          id: 8,
          img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
          name: "Toukir Ahmed",
          last_message: "how are you?",
          time: "31m"
        },
        {
          id: 9,
          img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
          name: "Toukir Ahmed",
          last_message: "how are you?",
          time: "31m"
        },
        {
          id: 10,
          img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
          name: "Toukir Ahmed",
          last_message: "how are you?",
          time: "31m"
        },
        {
          id: 11,
          img: "https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no",
          name: "Toukir Ahmed",
          last_message: "how are you?",
          time: "31m"
        }
      ]
  return (
    <div>
          {isNotificationBoxOpen && (
            <div className="  absolute right-0 top-14 shadow-2xl z-10 bg-white rounded-lg h-[600px] w-[400px] py-4">
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
             <div className="h-[467px]  overflow-y-scroll notifications_box">
             {data.map((d, index) => {
                return (
                  <div
                    key={index}
                    className="hover:bg-gray-100 px-4 flex item-center gap-3 py-3 cursor-pointer rounded-lg transition "
                  >
                    <div>
                      <img
                        className="h-14 w-14 rounded-full"
                        src="https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no"
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="text-black ">
                        <span className="font-medium">Toukir Ahmed</span>
                        posted 2 links.
                      </p>
                      <p className="text-purple-500">a day ago</p>
                    </div>
                  </div>
                );
              })}
             </div>
            </div>
          )}
    </div>
  )
}
