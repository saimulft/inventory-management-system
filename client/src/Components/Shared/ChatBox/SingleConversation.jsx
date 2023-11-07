import { useContext, useEffect, useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { ChatContext } from "../../../Providers/ChatProvider";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

export default function SingleConversation() {
  // chat context
  const {
    handleOpenSingleConversationShow,
    currentChatUserInfo,
    singleConversationState,
    singleConversationSetState,
    setIsChatBoxOpen,
    setSingleConversationShow,
    newConversationAdd,
    setNewConversationAdd,
  } = useContext(ChatContext);
  const { user } = useAuth();

  const { currentChatUserName, currentChatUserEmail } =
    currentChatUserInfo || {};

  const [data, loading, error] = singleConversationState;
  const [setData, setLoading, setError] = singleConversationSetState;

  const [con, setCon] = useState([]);

  const fetchConData = async () => {
    setError(false);
    setLoading(true);
    await axios
      .get(
        `/api/v1/conversations_api/single_conversation?sender=${
          user?.email
        }&receiver=${currentChatUserEmail}&page_no=${1}`
      )
      .then((res) => {
        setCon(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    fetchConData();
  }, [currentChatUserEmail, user?.email]);

  // handle sent new massages
  const handleSentNewMassages = async (e) => {
    try {
      e.preventDefault();
      let msg = document.getElementById("message_input")?.value;
      if (msg) {
        const date = new Date();
        const timestamp = date.toISOString();

        // new message data
        const message = {
          full_name: currentChatUserName,
          sender: user?.email,
          receiver: currentChatUserEmail,
          text: msg,
          timestamp,
        };

        //fast time data update locale state
         console.log(newConversationAdd);
         
        if (!newConversationAdd) {
          console.log(con);
          const randomId = Math.floor(100000 + Math.random() * 9000000000000000);
          console.log(randomId);
          
          setCon([...con, {...message, _id: randomId}]);
        }

        document.getElementById("message_input").value = "";
        const data = await axios.post(
          "/api/v1/conversations_api/send_message",
          message,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (data?.data?.insertedId) {
          fetchConData();
          setNewConversationAdd(false)
        } else if (data?.data?._id) {
          // setCon([...con, data?.data])
        }
      }
    } catch (err) {
      console.log(err);
      setCon({});
    }
  };

  let content;
  // if ((loading && !error && data?.messages?.length == 0) || !data) {
  //   content = <p>Loading...</p>;
  // } else if (!loading && error) {
  //   content = <p>Something is Wrong !</p>;
  // } else if ((!loading && !error && data?.messages?.length == 0) || !data) {
  //   content = <div> data not Found !</div>;
  // }
  if (con?.length > 0) {
    content = con?.map((msg) => {
      const currentUser = msg?.sender == user?.email;
      const msgLengthCheck = msg?.text?.length <= 26;
      const text = msg?.text;
      return (
        <div key={msg?._id}>
          <div
            className={`flex ${
              currentUser ? "justify-end my-[2px] " : "justify-start my-[2px]"
            }`}
          >
            <div
              className={`${
                currentUser
                  ? "bg-purple-600 text-white  break-words"
                  : "bg-gray-200 text-black   break-words"
              } ${
                msgLengthCheck ? "rounded-full" : "rounded-xl"
              }  mx-2 py-[5px] px-3 max-w-[65%]`}
            >
              {text}
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="h-[550px] w-[350px] fixed bg-white shadow-2xl shadow-[#b1b1b1] border border-[#cacaca] right-20 bottom-0 rounded-t-xl overflow-hidden">
      {/* conversation header */}
      <div className="px-3 py-3  flex gap-3 justify-between items-center text-xs font-medium bg-gray-100 border-b border-[#e0e0e0]">
        <div className="flex gap-3 items-center">
          <img
            className="w-10  rounded-full"
            src="https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no"
            alt=""
          />
          <div>
            <p className="font-medium text-base">
              {currentChatUserName ? currentChatUserName : "No Name"}
            </p>
            <div className="text-sm flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="pl-1">Online</span>
            </div>
          </div>
        </div>
        <div>
          <BsPlusCircleFill
            onClick={handleOpenSingleConversationShow}
            size={22}
            className="cursor-pointer rotate-45"
          />
        </div>
      </div>

      {/* message body */}
      <div className="h-[calc(100%_-_138px)] overflow-y-auto">{content}</div>

      {/* sent message box  */}
      <form>
        <div className="flex items-center px-3 py-2 rounded-lg border">
          <input
            id="message_input"
            rows="1"
            className="block mx-4 p-2 w-full text-sm text-gray-900 outline-none rounded-full bg-white  border border-gray-300 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
            placeholder="Your message..."
          ></input>
          <button
            onClick={handleSentNewMassages}
            type="submit"
            className="inline-flex justify-center p-2 text-purple-600 rounded-full cursor-pointer hover:bg-purple-100 dark:text-purple-500 dark:hover:bg-gray-600"
          >
            <svg
              className="w-5 h-5 rotate-90"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
}
