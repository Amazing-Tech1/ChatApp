function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-[#071426]">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/15 blur-[90px] dark:bg-blue-500/20" />

      {/* Animated logo */}
      <div className="relative flex items-center justify-center">
        {/* Orbit ring */}
        <div className="absolute size-32 animate-spin rounded-full border border-dashed border-blue-400/40 [animation-duration:8s]" />

        {/* Orbiting dots */}
        <div className="absolute size-32 animate-spin [animation-duration:3s]">
          <span className="absolute -top-1 left-1/2 size-3 -translate-x-1/2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
        </div>

        <div className="absolute size-24 animate-ping rounded-full bg-blue-500/10 [animation-duration:2.5s]" />

        {/* ChatApp logo */}
        <div className="relative flex size-20 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-3xl border border-blue-400/20 bg-white/80 shadow-xl shadow-blue-500/10 backdrop-blur-xl dark:bg-slate-900/80">
          <img src="/chat.png" alt="ChatApp" className="size-14 object-contain" />
        </div>
      </div>

      {/* Loading text */}
      <div className="relative mt-10 flex flex-col items-center gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-white">
          ChatApp
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Connecting you to your conversations
          </span>

          <div className="flex gap-1">
            <span className="size-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:0ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:150ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:300ms]" />
          </div>
        </div>
      </div>

      {/* Bottom loading bar */}
      <div className="absolute bottom-12 h-1 w-36 overflow-hidden rounded-full bg-blue-100 dark:bg-slate-800">
        <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-blue-400 via-blue-600 to-sky-400" />
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }

          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}
      </style>
    </div>
  );
}

export default PageLoader;
