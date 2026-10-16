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
