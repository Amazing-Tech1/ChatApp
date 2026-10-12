import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { AuthUser } from "../types";

interface ChatState {
  isUserLoading: boolean;
  isMessageLoading: boolean;
  isSoundEnabled: boolean;

  allContacts: AuthUser[];
  chats: AuthUser[];
  messages: Message[];
  activeTab: "chats" | "contacts";
  selectedUser: AuthUser | null;

  toggleSound: () => void;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (user: AuthUser | null) => void;
  getAllContacts: () => Promise<void>;
  getAllChatPartners: () => Promise<void>;
}

// Replace this interface with your existing Message type if you already have one.
interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt?: string;
}

export const useChatStore = create<ChatState>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,

  isUserLoading: false,
  isMessageLoading: false,
  isSoundEnabled: localStorage.getItem("isSound") !== "false",

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;

    localStorage.setItem("isSound", String(newValue));
    set({ isSoundEnabled: newValue });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUserLoading: true });

    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data.data });
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "Unable to fetch contacts.";

      toast.error(message);
      console.error("Fetch contacts failed:", error);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getAllChatPartners: async () => {
    set({ isUserLoading: true });

    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data.data });
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "Unable to fetch chats.";

      toast.error(message);
      console.error("Fetch chats failed:", error);
    } finally {
      set({ isUserLoading: false });
    }
  },
}));
