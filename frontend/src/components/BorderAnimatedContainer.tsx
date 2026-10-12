import type { ReactNode } from "react";

interface BorderAnimatedContainerProps {
  children: ReactNode;
}

function BorderAnimatedContainer({ children }: BorderAnimatedContainerProps) {
  return (
    <div
      className="
        flex h-full w-full overflow-hidden rounded-2xl
        border border-transparent
        [background:linear-gradient(45deg,#172033,#1e293b_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),rgba(71,85,105,0.48)_80%,#06b6d4_86%,#67e8f9_90%,#06b6d4_94%,rgba(71,85,105,0.48))_border-box]
        animate-border
      "
    >
      {children}
    </div>
  );
}

export default BorderAnimatedContainer;
