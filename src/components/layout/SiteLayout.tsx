"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";

interface SiteLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function SiteLayout({ children, showFooter = true }: SiteLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Cart page must never display the footer (Requirements 64, 65, 131-133)
  const isCartPage = pathname === "/cart";
  const shouldRenderFooter = showFooter && !isCartPage;

  return (
    <div className="flex flex-col min-h-screen">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1">{children}</main>
      {shouldRenderFooter && <Footer />}
      <FloatingWhatsApp />
      <MobileBottomNav />
    </div>
  );
}
