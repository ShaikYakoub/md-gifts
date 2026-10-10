"use client";

import React from "react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { usePathname } from "next/navigation";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const whatsappUrl = getGeneralWhatsAppUrl();

  // On product detail and cart pages, there is a fixed bottom action bar (~64px) above the bottom nav.
  // We lift the floating button so it never overlaps the bottom action bar or bottom navigation.
  const hasBottomActionBar = pathname.startsWith("/product/") || pathname === "/cart";

  const bottomClass = hasBottomActionBar
    ? "bottom-36 md:bottom-8"
    : "bottom-20 md:bottom-8";

  return (
    <aside aria-label="WhatsApp Support">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className={`fixed right-4 ${bottomClass} z-40 bg-[#25D366] hover:bg-[#20BA5C] text-white p-3 sm:p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group`}
      >
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </aside>
  );
}
