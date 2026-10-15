import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { AuthUser } from "../types";
import { useAuthStore } from "./auth";

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
  getMessagesById: (id: string) => Promise<void>;
  sendMessage: (messageData: { text: string; image: File | null }) => Promise<boolean>;
}

// Replace this interface with your existing Message type if you already have one.
interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
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
      set({ allContacts: res.data.users });
    } catch (error: any) {
      const message = error.response?.data?.message || "Unable to fetch contacts.";

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
      set({ chats: res.data.chats });
    } catch (error: any) {
      const message = error.response?.data?.message || "Unable to fetch chats.";

      toast.error(message);
      console.error("Fetch chats failed:", error);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessagesById: async (id: string) => {
    set({ isMessageLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/chats/${id}`);
      set({ messages: res.data.user });
    } catch (error: any) {
      const message = error.response?.data?.message || "Unable to fetch messages!.";

      toast.error(message);
      console.error("Fetch chats failed:", error);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (messageData: { text: string; image: File | null }) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    if (!authUser?._id || !selectedUser?._id) {
      return false;
    }

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage: Message & { isOptimistic: boolean } = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image ? URL.createObjectURL(messageData.image) : undefined,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const formData = new FormData();

      formData.append("text", messageData.text);

      if (messageData.image) {
        formData.append("image", messageData.image);
      }

      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, formData);

      set({ messages: messages.concat(res.data.data) });
      return true;
    } catch (error: any) {
      set({ messages: messages });
      const message = error.response?.data?.message || "Unable to send message.";

      toast.error(message);
      console.error("Send message failed:", error);

      return false;
    }
  },
}));
