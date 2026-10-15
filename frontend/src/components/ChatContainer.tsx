import { useEffect, useRef } from "react";
import { useChatStore } from "../store/chat";
import { useAuthStore } from "../store/auth";
import ChatHeader from "./ChatHeader";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";

function ChatContainer() {
  const { selectedUser, getMessagesById, messages, isMessageLoading } = useChatStore();

  const { authUser } = useAuthStore();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesById(String(selectedUser._id));
    }
  }, [selectedUser?._id, getMessagesById]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {/* Fixed chat header */}
      <div className="shrink-0">
        <ChatHeader />
      </div>

      {/* Only this area scrolls */}
      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-8"
      >
        {isMessageLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser?._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="h-48 rounded-lg object-cover" />
                  )}

                  {msg.text && <p className="mt-2">{msg.text}</p>}

                  <p className="mt-1 flex items-center gap-1 text-xs opacity-75">
                    {msg.createdAt &&
                      new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.name} />
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
