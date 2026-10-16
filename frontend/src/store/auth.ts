import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { AuthState, LoginData, SignUpData } from "../types";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isLoading: true,
  isSignUp: false,
  isLogin: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/protected");

      set({
        authUser: res.data.user,
      });
      get().connectSocket();
    } catch (error) {
      console.error("Authentication check failed:", error);

      set({
        authUser: null,
        isLoading: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (data: SignUpData) => {
    set({ isSignUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({
        authUser: res.data.data,
      });

      toast.success("Account created successfully! ");

      get().connectSocket();
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Unable to create your account.");
    } finally {
      set({ isSignUp: false });
    }
  },
  login: async (data: LoginData) => {
    set({ isLogin: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({
        authUser: res.data.data,
      });

      toast.success("Login successfully! ");
      get().connectSocket();
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Unable to sign in!.");
    } finally {
      set({ isLogin: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({
        authUser: null,
      });

      toast.success("Logged out successfully! ");
      get().disconnectSocket();
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Unable to log you out!");
    }
  },

  updateProfile: async (data: FormData) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);

      set({ authUser: res.data.data });

      toast.success("Profile picture uploaded successfully!");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Unable to upload profile picture.";

      console.error("Profile update request failed:", {
        status: error?.response?.status,
        message,
      });

      toast.error(message);
      throw error;
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      withCredentials: true,
      autoConnect: false,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection failed:", error.message);
    });

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
    newSocket.connect();
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
