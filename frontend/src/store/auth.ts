import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { AuthState, LoginData, SignUpData } from "../types";
import { io } from "socket.io-client";

let isRefreshingSocket = false;

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

    // Avoid creating another socket if one is already connecting.
    if (socket?.active) return;

    const newSocket = io(BASE_URL, {
      withCredentials: true,
      autoConnect: false,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", async (error) => {
      console.error("Socket connection failed:", error.message);

      // Only attempt refresh for authentication failures.
      const isAuthError = /unauthorized|authentication|token expired|jwt expired/i.test(
        error.message,
      );

      if (!isAuthError || isRefreshingSocket) return;

      isRefreshingSocket = true;

      try {
        // Refresh the access-token cookie using your existing endpoint.
        await axiosInstance.post("/auth/refresh-token");

        // Retry the socket handshake with the refreshed cookie.
        if (get().authUser && !newSocket.connected) {
          newSocket.connect();
        }
      } catch (refreshError) {
        console.error("Socket token refresh failed:", refreshError);

        newSocket.disconnect();

        set({
          socket: null,
          onlineUsers: [],
          authUser: null,
        });

        // Let your app handle the expired session.
        window.dispatchEvent(new Event("auth:expired"));
      } finally {
        isRefreshingSocket = false;
      }
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
