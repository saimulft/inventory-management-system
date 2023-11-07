import { useContext } from "react";
import { ChatContext } from "../../../Providers/ChatProvider";
import ConversationUserList from "./ConversationUserList";
import SingleConversation from "./SingleConversation";
import AddNewConversation from "./AddNewConversation";

export default function ChatBox() {
  const { isChatBoxOpen, singleConversationShow, addNewConversation } =
    useContext(ChatContext);

  const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  return (
    <div>
      {/* conversation user list show */}
      {isChatBoxOpen && <ConversationUserList data={data} />}

      {/* single conversation show  */}
      {singleConversationShow && <SingleConversation data={data} />}

      {/* add new conversation  */}
      {addNewConversation && <AddNewConversation data={data} />}
    </div>
  );
}
