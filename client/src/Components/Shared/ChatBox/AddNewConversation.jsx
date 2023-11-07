import { useContext, useEffect } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { ChatContext } from "../../../Providers/ChatProvider";
import axios from "axios";

export default function AddNewConversation() {
  // chat context
  const {
    handleOpenSingleConversationShow,
    handleNewConversationTextBox,
    allUsersState,
    allUsersSetState,
    currentChatUserSetInfo,
    setNewConversationAdd,
  } = useContext(ChatContext);

  const [data, loading, error] = allUsersState;
  const [setData, setLoading, setError] = allUsersSetState;

  useEffect(() => {
    setError(false);
    setLoading(true);
    axios
      .get("/api/v1/user_api/all_users")
      .then((res) => {
        setData(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        setLoading(false);
      });
  }, []);

  console.log(data, loading, error);

  //set current Chat User Info
  const { setCurrentChatUserName, setCurrentChatUserEmail } =
    currentChatUserSetInfo || {};

  // decide what to render
  let content;
  if (loading) {
    content = <p>Loading...</p>;
  } else if (!loading && error) {
    content = <p>Something is Wrong !</p>;
  } else if (!loading && !error && data.length > 0) {
    content = data?.map((user) => {
      return (
        <div
          onClick={() => {
            setCurrentChatUserName(user?.full_name);
            setCurrentChatUserEmail(user?.email);
            setNewConversationAdd(true);
            handleNewConversationTextBox();
          }}
          key={user?._id}
          className="p-2 mb-2 flex gap-3 items-center text-xs font-medium bg-gray-50 hover:bg-gray-100 py-1 px-2 cursor-pointer rounded-lg"
        >
          <img
            className="w-14  rounded-full"
            src="https://lh3.googleusercontent.com/a/ACg8ocLBE_Vz9xi-TA_vB8ZujrRCpMC8_lNvro8uM5KcGiu1MA=s504-c-no"
            alt=""
          />
          <div>
            <p className="font-medium text-base">{user?.full_name}</p>
            <span className="">{user?.email}</span>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="h-[550px] w-[350px] fixed bg-white shadow-2xl shadow-[#b1b1b1] border border-[#cacaca] right-20 bottom-0 rounded-t-xl overflow-hidden">
      {/* add new conversation user list */}
      <div className="px-3 py-4  flex gap-3 justify-between text-xs font-medium bg-gray-100 border-b border-[#e0e0e0]">
        <p className="text-lg font-bold">New Conversation</p>
        <div>
          <BsPlusCircleFill
            onClick={handleOpenSingleConversationShow}
            size={22}
            className="cursor-pointer rotate-45"
          />
        </div>
      </div>

      {/* add new conversation list  */}
      <div className="p-3 h-[calc(100%_-_56px)] overflow-y-scroll">
        {content}
      </div>
    </div>
  );
}
