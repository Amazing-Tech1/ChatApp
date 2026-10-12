import React from "react";
import { useAuthStore } from "../store/auth";

function ChatPage() {
  const { logout } = useAuthStore();
  return (
    <div>
      <button onClick={logout}>Logout</button>
      ChatPage
    </div>
  );
}

export default ChatPage;
