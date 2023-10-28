import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiSolidSend } from "react-icons/bi";
import useAuth from "../hooks/useAuth";
import axios from "axios";
export default function ChatBox({isMessageBoxOpen, setIsMessageBoxOpen,  currentReciver}) {
    const [singleConversation, setSingleConversation] = useState({})
    const [reFatch, setReFatch] = useState(true)
    const conversationContainerRef = useRef();
    const { user } = useAuth()
    const currentReciverUserName = currentReciver?.email.match(/[^@]*/)[0]?.split(".")[0]
 
    console.log('singleConversation', singleConversation)
    const handleMessage = () => {
      let msg = document.getElementById("message")?.value
      if (msg) {
        const message = {
          sender: user?.email,
          receiver: currentReciver?.email,
          reciverName: currentReciver?.name,
          text: msg,
        }
        const date = new Date()
        const timestamp = date.toISOString();
        setSingleConversation({
          ...singleConversation,
          messages: [
            ...singleConversation?.messages,
            {
              sender: message?.sender,
              receiver: message?.receiver,
              text: message?.text,
              timestamp
           }
          ]
        })


        document.getElementById("message").value = "";
         axios.post('/api/v1/conversations_api/send_message', message, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(res => {
            console.log(res.data)
            if(res.data){
              setReFatch(r=> !r)
            }
          })
          .catch((err) => {
            console.log("err", err)
            setReFatch(r=> !r)
          })
      }
    }

    const handleOnkeyUp = (e) => {
console.log(e)
    }

    useEffect(() => {
      scrollToBottom();
    }, [singleConversation?.messages]);
  
    const scrollToBottom = () => {
      if (conversationContainerRef.current) {
        conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
      }
    };

    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/conversations_api/single_conversation?sender=${user?.email}&receiver=${currentReciver?.email}`)
          .then(res => res.json())
          .then(data => setSingleConversation(data))
      }, [currentReciver?.email, user?.email, reFatch])


    return (
     <div className="h-[500px] w-[350px] fixed bg-white shadow-2xl right-20 bottom-0 rounded-t-lg ">
                {/* message head  */}
                <div style={{ boxShadow: "0px 2px 20px 0px rgba(0,0,0,0.1)" }} className="flex justify-between items-center  px-3">
                  <div className="py-3">
                    <div className="flex items-center gap-2 font-medium">
                      <img className="w-10 h-10 rounded-full" src="https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png" alt="" />
                      <p>{currentReciverUserName}</p>
                    </div>
                  </div>
                  <div onClick={() => setIsMessageBoxOpen(!isMessageBoxOpen)} className="hover:bg-gray-100 transition p-1 rounded-full text-purple-500">
                    <AiOutlineClose size={22} />
                  </div>
                </div>
                {/* message body  */}
                <div  ref={conversationContainerRef} className="h-[385px] py-2 overflow-y-scroll ">
                  {
                    singleConversation?.messages?.map(message => {
                      if(!message.text ){
                        	return;
                      }
                      return(
                        <div className={`flex ${message?.sender == user?.email ? "justify-end my-[2px] ":"justify-start"}`}>
                        <p className={`${message?.sender == user?.email ? "bg-purple-600 text-white":"bg-gray-200 text-black"} ${message.text.length <= 26 ? "rounded-full": 'rounded-xl' } break-words mx-2 py-2 px-3  max-w-[65%] `}>{message?.text}</p>
                        </div>
                      )
                    })
                  }
                </div>
                {/* message footer  */}
                <div style={{ boxShadow: "0px -2px 20px 0px rgba(0,0,0,0.1)" }} className="flex justify-between items-center p-3 gap-2">
                  <input id="message" placeholder="Aa" className="outline-none bg-gray-100 rounded-full py-1 px-3 w-full" type="text" />
                  <div onKeyUp={(e) => handleOnkeyUp(e)} onClick={handleMessage} className="p-2 hover:bg-gray-100 transition rounded-full flex justify-center items-center text-purple-500">
                    <BiSolidSend size={22} />
                  </div>
                </div>
              </div>
    );
  }