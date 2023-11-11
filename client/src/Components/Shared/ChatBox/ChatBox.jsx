import { useContext } from "react";
import { ChatContext } from "../../../Providers/ChatProvider";
import ConversationUserList from "./ConversationUserList";
import SingleConversation from "./SingleConversation";
import AddNewConversation from "./AddNewConversation";
import "./chatBox.css"

export default function ChatBox() {
  const { isChatBoxOpen, singleConversationShow, addNewConversation } =
    useContext(ChatContext);

  return (
    <div>
      {/* conversation user list show */}
      {isChatBoxOpen && <ConversationUserList />}

      {/* single conversation show  */}
      {singleConversationShow && <SingleConversation />}

      {/* add new conversation  */}
      {addNewConversation && <AddNewConversation />}
    </div>
  );
}
