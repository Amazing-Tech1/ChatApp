import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { useChatStore } from "../store/chat";
import { useSearchParams } from "react-router";
import { useEffect } from "react";

function ChatPage() {
  const { activeTab, selectedUser, chats, setSelectedUser } = useChatStore();

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");

  useEffect(() => {
    if (!userId) {
      if (selectedUser) setSelectedUser(null);
      return;
    }

    const user = chats?.find((chat) => chat._id === userId);

    if (user && user._id !== selectedUser?._id) {
      setSelectedUser(user);
    }
  }, [userId, chats, selectedUser, setSelectedUser]);

  return (
    <div className="relative h-full min-h-0 w-full max-w-6xl">
      <BorderAnimatedContainer>
        {/* LEFT SIDEBAR */}
        <div
          className={`
            min-h-0 shrink-0 flex-col overflow-hidden
            bg-slate-800/50 backdrop-blur-sm
            ${selectedUser ? "hidden md:flex md:w-72 lg:w-80" : "flex w-full md:w-72 lg:w-80"}
          `}
        >
          <ProfileHeader />
          <ActiveTabSwitch />

          {/* Only the chats/contacts list scrolls */}
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-3 sm:p-4">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT CHAT ROOM */}
        <div
          className={`
            min-h-0 min-w-0 flex-1 flex-col overflow-hidden
            bg-slate-900/50 backdrop-blur-sm
            ${selectedUser ? "flex w-full" : "hidden md:flex"}
          `}
        >
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;
