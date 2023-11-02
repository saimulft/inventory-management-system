import { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiSolidSend } from "react-icons/bi";
import useAuth from "../hooks/useAuth";
import { ChatContext } from "../Providers/ChatProvider";
import moment from 'moment';

export default function ChatBox() {
   const { isButtonDisabled, handleMessage, sendMessageRef, singleConversation, isMessageBoxOpen, setIsMessageBoxOpen, currentReciver, activeUsers, handleSeenMessage} = useContext(ChatContext)
    const conversationContainerRef = useRef();




    const { user } = useAuth()
    const currentReciverUserName = currentReciver?.email.match(/[^@]*/)[0]?.split(".")[0]

    let arrayLength = singleConversation?.messages?.length
    const seenMessageReceiver = singleConversation?.messages[arrayLength - 1]?.receiver
    const coversationID = singleConversation?._id
    const seenUnseenStatus = false;

// useEffect(()=>{
//   if(sendMessageRef.current){

//   }
// },[])


    useEffect(() => {
      scrollToBottom();
    }, [singleConversation?.messages]);
  
    const scrollToBottom = () => {
      if (conversationContainerRef.current) {
        conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
      }
    };
    return (
     <div className="h-[500px] w-[350px] fixed bg-white shadow-2xl right-20 bottom-0 rounded-t-lg ">
                {/* message head  */}
                <div style={{ boxShadow: "0px 2px 20px 0px rgba(0,0,0,0.1)" }} className="flex justify-between items-center  px-3">
                  <div className="py-3">
                    <div className="flex items-center gap-2 ">
                      <img className="w-10 h-10 rounded-full" src="https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png" alt="" />
                     <div>
                     <p className="font-medium">{currentReciverUserName}</p>
                     <p className="text-sm text-gray-500"> {activeUsers?.find(active => active?.email == currentReciver?.email) ? "Online": "Ofline"}</p>
                     </div>
                    </div>
                  </div>
                  <div onClick={() => setIsMessageBoxOpen(!isMessageBoxOpen)} className="hover:bg-gray-100 transition p-1 rounded-full text-purple-500">
                    <AiOutlineClose size={22} />
                  </div>
                </div>
                {/* message body  */}
                <div  ref={conversationContainerRef} className="chat_box h-[380px] py-2 overflow-y-scroll ">
                  {
                    singleConversation?.messages?.map((message) => {
                      if(!message.text ){
                        	return;
                      }
                      const currentUser = message?.sender == user?.email
                      const msgLengthCheck = message.text.length <= 26 
                      const msg = message.text






                      let lastFormattedTime = null;

                      function formatFacebookChatTimestamp(timestamp) {
                        const messageTime = moment(timestamp);
                      
                        const formattedTime = messageTime.format('h:mm A');
                      
                        if (formattedTime === lastFormattedTime) {
                          return '';
                        } else {
                          lastFormattedTime = formattedTime;
                          return formattedTime;
                        }
                      }
                      











                     
                      const messageTime = formatFacebookChatTimestamp(message.timestamp)
              
                      return(
                     <div key={message._id}> 
                        <p className="text-sm font-medium text-center py-1">{messageTime}</p>
                           <div  className={`flex ${currentUser ? "justify-end my-[2px] ":"justify-start my-[2px]"}`}>
                        <p className={`${currentUser ? "bg-purple-600 text-white":"bg-gray-200 text-black flex justify-start gap-2 items-center"} ${msgLengthCheck ? "rounded-full": 'rounded-xl' } break-words mx-2 py-2 px-3  max-w-[65%] `}>{msg}</p>
                        </div>
                     </div>
                      )
                    })
                  }
                </div>
                {/* message footer  */}
                <div style={{ boxShadow: "0px -2px 20px 0px rgba(0,0,0,0.1)" }} className="flex justify-between items-center py-2 px-3 gap-2">
                  <input  ref={sendMessageRef}  autoFocus onKeyUp={handleMessage}  id="message" placeholder="Aa" className="outline-none bg-gray-100 rounded-full py-1 px-3 w-full" type="text" />
                  <button disabled={isButtonDisabled}  onClick={(e) => {
                    handleMessage(e),
                    handleSeenMessage(seenMessageReceiver, coversationID, seenUnseenStatus )
                  }} className={` ${isButtonDisabled ? "" : "hover:bg-gray-100 text-purple-500"} p-2   transition rounded-full flex justify-center items-center `}>
                    <BiSolidSend size={22} />
                  </button>
                </div>
              </div>
    );
  }