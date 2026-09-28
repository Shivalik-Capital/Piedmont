"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import ShaderBg from "./ShaderBg";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen">
        <ShaderBg />
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col md:pl-20">
          <TopBar />
          <main className="flex-1 pt-24 pb-20 md:pb-8 px-4 md:px-8">
            {children}
          </main>
        </div>
      </div>
      <MobileNav />
    </>
  );
}
