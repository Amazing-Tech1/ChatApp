import { create } from "zustand";

interface AuthState {
  isLoading: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,

  login: async () => {
    console.log("Login action triggered");
  },
}));
