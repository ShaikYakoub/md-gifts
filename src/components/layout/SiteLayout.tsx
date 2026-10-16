"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Footer } from "@/components/layout/Footer";

interface SiteLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function SiteLayout({ children, showFooter = true }: SiteLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Footer is displayed exclusively on the homepage (pathname === "/")
  const isHomePage = pathname === "/";
  const shouldRenderFooter = showFooter && isHomePage;

  return (
    <div className="flex flex-col min-h-screen">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1">{children}</main>
      {shouldRenderFooter && <Footer />}
    </div>
  );
}
