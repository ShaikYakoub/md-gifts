"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CustomerSupportIcon } from "@/components/ui/CustomerSupportIcon";

export function FloatingContact() {
  const pathname = usePathname();

  // Do not display the floating contact bubble when already on the contact page
  if (pathname === "/contact") {
    return null;
  }

  // Lift the floating button if there is a fixed bottom action bar (e.g. on product pages)
  const isProductPage = pathname.startsWith("/product/");
  const bottomClass = isProductPage
    ? "bottom-24 md:bottom-8"
    : "bottom-20 md:bottom-8";

  return (
    <aside aria-label="Customer Support">
      <Link
        href="/contact"
        aria-label="Contact Customer Support"
        title="Contact Us"
        className={`fixed right-4 md:right-6 ${bottomClass} z-40 w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center bg-[#FAF5F1] hover:bg-[#F2ECE6] text-[#221C1D] hover:text-[#C85250] border border-[#EDE0D6] hover:border-[#C85250]/40 shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_26px_rgba(0,0,0,0.18)] transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer`}
      >
        <CustomerSupportIcon className="w-6 h-6 sm:w-6.5 sm:h-6.5 transition-colors" />
        <span className="sr-only">Contact Support</span>
      </Link>
    </aside>
  );
}
