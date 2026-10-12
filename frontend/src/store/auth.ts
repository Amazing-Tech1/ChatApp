import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

interface AuthUser {
  _id: string;
  email: string;
  name: string;
  image_url: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
}
interface LoginData {
  email: string;
  password: string;
}

interface AuthState {
  isLoading: boolean;
  isSignUp: boolean;
  isLogin: boolean;
  authUser: AuthUser | null;
  checkAuth: () => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

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
}));
