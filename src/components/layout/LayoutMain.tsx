"use client";

import { useHeaderCollapsed } from "@/context/HeaderContext";

function LayoutMain({ children }: { children: React.ReactNode }) {
  const { collapsed } = useHeaderCollapsed();

  return (
    <main
      className={`relative z-10 grid min-h-screen place-items-center px-4 pb-8 flex-grow transition-[padding-top] duration-500 ease-in-out motion-reduce:transition-none ${
        collapsed ? "pt-[4.75rem]" : "pt-24"
      }`}
    >
      {children}
    </main>
  );
}

export default LayoutMain;
