"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import ShaderBg from "./ShaderBg";
import BloombergKeyBar from "./BloombergKeyBar";
import PiedmontCopilot from "../ai/PiedmontCopilot";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const handleOpenCopilot = () => setIsCopilotOpen(true);
  const handleCloseCopilot = () => setIsCopilotOpen(false);

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
        
        {/* Bloomberg Function Key Navigator Bar (F1-F9) */}
        <BloombergKeyBar onOpenCopilot={handleOpenCopilot} />

        <div className="hidden md:block">
          <Sidebar onOpenCopilot={handleOpenCopilot} />
        </div>

        <div className="flex-1 flex flex-col md:pl-20">
          <TopBar onOpenCopilot={handleOpenCopilot} />
          <main className="flex-1 pt-28 pb-20 md:pb-8 px-4 md:px-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenCopilot={handleOpenCopilot} />

      {/* AI Market Intelligence Copilot Slide-Over Drawer */}
      <PiedmontCopilot isOpen={isCopilotOpen} onClose={handleCloseCopilot} />
    </>
  );
}
