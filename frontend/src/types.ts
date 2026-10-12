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
  authUser: AuthUser | null;
  checkAuth: () => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: FormData) => Promise<void>;
}
