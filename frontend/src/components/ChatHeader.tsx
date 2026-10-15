import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useChatStore } from "../store/chat";
import { XIcon } from "lucide-react";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedUser(null);
        setSearchParams(
          (prev) => {
            prev.delete("user");
            return prev;
          },
          { replace: true },
        );
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser, setSearchParams]);
  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-21 px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        {/* <div className={`avatar ${isOnline ? "online" : "offline"}`}> */}
        <div className="avatar online">
          <div className="w-12 rounded-full">
            <img src={selectedUser?.image_url || "/avatar.png"} alt={selectedUser?.name} />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">{selectedUser?.name}</h3>
          {/* <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p> */}
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}

export default ChatHeader;
