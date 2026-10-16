import type { Socket } from "socket.io-client";

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  image_url: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}
export interface LoginData {
  email: string;
  password: string;
}

export interface AuthState {
  isLoading: boolean;
  isSignUp: boolean;
  isLogin: boolean;
  socket: Socket | null;
  onlineUsers: string[];

  authUser: AuthUser | null;
  checkAuth: () => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: FormData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface ChatState {
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
  subscribeToMessages: () => void;
  unSubscribeFromMessages: () => void;
}

// Replace this interface with your existing Message type if you already have one.
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
}
