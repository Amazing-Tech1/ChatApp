import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useChatStore } from "../store/chat";
import { XIcon } from "lucide-react";
import { useAuthStore } from "../store/auth";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [, setSearchParams] = useSearchParams();

  const isOnline = onlineUsers.includes(String(selectedUser?._id));

  const handleClose = () => {
    setSelectedUser(null);

    setSearchParams(
      (prev) => {
        prev.delete("user");
        return prev;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser, setSearchParams]);

  return (
    <div className="flex max-h-21 shrink-0 items-center justify-between border-b border-slate-700/50 bg-slate-800/50 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
          <div className="w-12 rounded-full">
            <img
              src={selectedUser?.image_url || "/avatar.png"}
              alt={selectedUser?.name || "User avatar"}
            />
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-medium text-slate-200">{selectedUser?.name}</h3>
          <p className="text-sm text-slate-400">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <button
        type="button"
        aria-label="Close conversation"
        onClick={handleClose}
        className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-slate-200"
      >
        <XIcon className="size-5" />
      </button>
    </div>
  );
}

export default ChatHeader;
