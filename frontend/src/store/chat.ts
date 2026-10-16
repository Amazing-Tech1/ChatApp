import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { Message, ChatState } from "../types";
import { useAuthStore } from "./auth";

const notificationSound = new Audio("/sounds/notification.mp3");

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

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();

    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket?.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessage = get().messages;
      set({ messages: [...currentMessage, newMessage] });

      if (isSoundEnabled) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e: any) => console.log("Audio play failed", e));
      }
    });
  },
  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },
}));
