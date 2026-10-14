"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { FloatingContact } from "@/components/ui/FloatingContact";

interface SiteLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function SiteLayout({ children, showFooter = true }: SiteLayoutProps) {
  const pathname = usePathname();

  // Footer is displayed exclusively on the homepage (pathname === "/")
  const isHomePage = pathname === "/";
  const shouldRenderFooter = showFooter && isHomePage;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      {shouldRenderFooter && <Footer />}
      <FloatingContact />
      <MobileBottomNav />
    </div>
  );
}
