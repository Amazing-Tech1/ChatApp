import { useEffect } from "react";
import { useChatStore } from "../store/chat";
import { useAuthStore } from "../store/auth";
import UsersLoadingSkeleton from "./UserLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";

function ChatsList() {
  const { getAllChatPartners, chats, isUserLoading, setSelectedUser } = useChatStore();
  // const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllChatPartners();
  }, [getAllChatPartners]);

  if (isUserLoading) return <UsersLoadingSkeleton />;
  if (!chats || chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            {/* <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}> */}
            <div className={`avatar online`}>
              <div className="size-12 rounded-full">
                <img src={chat.image_url || "/avatar.png"} alt={chat.name} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{chat.name}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
