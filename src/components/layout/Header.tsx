"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { CustomerSupportIcon } from "@/components/ui/CustomerSupportIcon";

export function Header() {
  const pathname = usePathname();
  const isProductPage = pathname.startsWith("/product/");

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show at the top of the page
      if (currentScrollY <= 60) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Scrolling down -> hide navbar
      if (currentScrollY > lastScrollY.current + 8) {
        setIsVisible(false);
      }
      // Scrolling up -> show navbar
      else if (currentScrollY < lastScrollY.current - 8) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE4DC] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-transform duration-300 ease-in-out will-change-transform ${
        isVisible ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"
      } ${isProductPage ? "hidden md:block" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between w-full">
        {/* Logo on Left */}
        <Logo size="md" />

        {/* Contact Button on Right */}
        <Link
          href="/contact"
          className="group inline-flex items-center justify-end h-8.5 sm:h-9.5 md:h-10 pl-3.5 pr-0 md:pl-0 rounded-full bg-white hover:bg-[#FEF2F2] md:bg-transparent md:hover:bg-white text-[#221C1D] hover:text-[#EC0B12] border border-[#D8CAC0] hover:border-[#EC0B12] md:border-transparent md:hover:border-[#D8CAC0] transition-all duration-300 ease-out shadow-2xs hover:shadow-xs active:scale-95 shrink-0 text-xs sm:text-sm font-bold cursor-pointer"
          aria-label="Contact Us"
          title="Contact Us"
        >
          <span className="whitespace-nowrap overflow-hidden transition-all duration-300 ease-out pr-2.5 md:pr-0 md:pl-0 md:max-w-0 md:opacity-0 md:translate-x-3 md:group-hover:max-w-[100px] md:group-hover:opacity-100 md:group-hover:translate-x-0 md:group-hover:pl-3.5 md:group-hover:pr-2.5">
            Contact
          </span>
          <span className="h-full aspect-square rounded-full bg-[#EC0B12] group-hover:bg-[#D0080E] text-white flex items-center justify-center transition-colors duration-200 shrink-0 shadow-2xs">
            <CustomerSupportIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 text-white" />
          </span>
        </Link>
      </div>
    </header>
  );
}
