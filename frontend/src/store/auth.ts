import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { AuthState, LoginData, SignUpData } from "../types";

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isLoading: true,
  isSignUp: false,
  isLogin: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/protected");

      set({
        authUser: res.data.user,
        isLoading: false,
      });
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
}));
