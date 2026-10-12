import { Navigate, Route, Routes } from "react-router";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ChatPage from "./pages/ChatPage";
import { useAuthStore } from "./store/auth";
import { useEffect } from "react";
import { Toaster } from "sonner";
import PageLoader from "./components/PageLoader";

function App() {
  const { checkAuth, isLoading, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // console.log(authUser);

  if (isLoading) return <PageLoader />;

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 transition-colors duration-500 dark:bg-[#071426]">
        {/* Subtle blue grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0
          bg-[linear-gradient(to_right,rgba(37,99,235,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.06)_1px,transparent_1px)]
          bg-size-[32px_32px]
          dark:bg-[linear-gradient(to_right,rgba(96,165,250,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(96,165,250,0.07)_1px,transparent_1px)]"
        />

        {/* Top blue glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/4 size-112
          rounded-full bg-blue-400/20 blur-[120px]
          dark:bg-blue-600/20"
        />

        {/* Bottom-right glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -bottom-40 size-128
          rounded-full bg-sky-400/20 blur-[130px]
          dark:bg-sky-500/15"
        />

        {/* Soft center glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-96
          -translate-x-1/2 -translate-y-1/2 rounded-full
          bg-indigo-300/15 blur-[120px]
          dark:bg-indigo-500/10"
        />

        {/* App pages */}
        <div className="relative z-10 w-full">
          <Routes>
            <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
            <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to={"/"} />} />
            <Route path="/login" element={!authUser ? <Login /> : <Navigate to={"/"} />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
