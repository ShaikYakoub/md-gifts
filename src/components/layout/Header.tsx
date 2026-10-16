"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CustomerSupportIcon } from "@/components/ui/CustomerSupportIcon";
import { SearchBar } from "@/components/ui/SearchBar";

interface HeaderProps {
  onOpenSidebar?: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps = {}) {
  const pathname = usePathname();
  const isProductPage = pathname.startsWith("/product/");
  const isCheckoutPage = pathname.startsWith("/checkout");

  // Show search bar on browsing pages (home, shop, categories, search, etc.)
  const showSearchBar = !isProductPage && !isCheckoutPage;

  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always expand full branding row at the very top
      if (currentScrollY <= 40) {
        setIsScrolledDown(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Scrolling down past threshold -> collapse Logo row on mobile so SearchBar sits cleanly at top-0
      if (currentScrollY > lastScrollY.current + 8 && currentScrollY > 60) {
        setIsScrolledDown(true);
      }
      // Scrolling up -> expand Logo row
      else if (currentScrollY < lastScrollY.current - 8) {
        setIsScrolledDown(false);
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
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE4DC] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 ease-in-out ${
        isProductPage ? "hidden md:block" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Single-Row Header (>= md) */}
        <div className="hidden md:flex items-center justify-between gap-6 py-2.5 sm:py-3 w-full">
          {/* Logo on Left */}
          <Logo size="md" />

          {/* SearchBar in Center (Desktop) */}
          {showSearchBar && (
            <div className="flex-1 max-w-xl mx-auto">
              <SearchBar id="desktop-search-input" />
            </div>
          )}

          {/* Contact Button on Right */}
          <Link
            href="/contact"
            className="group inline-flex items-center justify-end h-8.5 sm:h-9.5 md:h-10 pl-3.5 pr-0 rounded-full bg-white hover:bg-[#FEF2F2] text-[#221C1D] hover:text-[#EC0B12] border border-[#D8CAC0] hover:border-[#EC0B12] transition-colors duration-200 shadow-2xs shrink-0 text-xs sm:text-sm font-bold cursor-pointer"
            aria-label="Contact Us"
            title="Contact Us"
          >
            <span className="whitespace-nowrap pr-2.5">
              Contact
            </span>
            <span className="h-full aspect-square rounded-full border-2 border-[#EC0B12] bg-white group-hover:bg-[#FEF2F2] text-[#EC0B12] flex items-center justify-center transition-colors duration-200 shrink-0 shadow-2xs">
              <CustomerSupportIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-[#EC0B12]" />
            </span>
          </Link>
        </div>

        {/* Mobile Header (< md) */}
        <div className="md:hidden flex flex-col w-full">
          {/* Mobile Row 1: Menu + Logo & Contact */}
          <div
            className={`flex items-center justify-between w-full transition-all duration-300 ease-in-out overflow-hidden ${
              showSearchBar && isScrolledDown
                ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none py-0"
                : "max-h-16 opacity-100 translate-y-0 py-2"
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={onOpenSidebar}
                className="p-1.5 -ml-1.5 text-[#3C3234] hover:text-[#EC0B12] hover:bg-[#FAF2EE] rounded-lg transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6 stroke-[2]" />
              </button>
              <Logo size="md" />
            </div>

            <Link
              href="/contact"
              className="group inline-flex items-center justify-end h-8.5 pl-3 pr-0 rounded-full bg-white hover:bg-[#FEF2F2] text-[#221C1D] hover:text-[#EC0B12] border border-[#D8CAC0] hover:border-[#EC0B12] transition-all duration-200 shadow-2xs shrink-0 text-xs font-bold cursor-pointer"
              aria-label="Contact Us"
              title="Contact Us"
            >
              <span className="whitespace-nowrap pr-2">Contact</span>
              <span className="h-full aspect-square rounded-full border-2 border-[#EC0B12] bg-white text-[#EC0B12] flex items-center justify-center shrink-0 shadow-2xs">
                <CustomerSupportIcon className="w-5 h-5 text-[#EC0B12]" />
              </span>
            </Link>
          </div>

          {/* Mobile Row 2: SearchBar following on scroll */}
          {showSearchBar && (
            <div
              className={`w-full transition-all duration-300 ease-in-out ${
                isScrolledDown ? "pt-2 pb-2" : "pt-0 pb-2.5"
              }`}
            >
              <SearchBar id="mobile-search-input" className="w-full" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
