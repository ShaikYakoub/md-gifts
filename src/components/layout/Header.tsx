"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CustomerSupportIcon } from "@/components/ui/CustomerSupportIcon";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isProductPage = pathname.startsWith("/product/");

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE4DC] shadow-[0_2px_8px_rgba(0,0,0,0.03)] ${
        isProductPage ? "hidden md:block" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        {/* Mobile Layout (< md): 2 Rows */}
        <div className="flex md:hidden flex-col gap-2.5">
          <div className="flex items-center justify-between w-full">
            <Logo size="md" />

            <Link
              href="/contact"
              className="inline-flex items-center h-8.5 sm:h-9 pl-3 pr-0 rounded-full bg-white hover:bg-[#FEF2F2] text-[#221C1D] hover:text-[#EC0B12] border border-[#D8CAC0] hover:border-[#EC0B12] transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 shrink-0 text-xs sm:text-sm font-bold cursor-pointer group"
              aria-label="Contact Us"
              title="Contact Us"
            >
              <span className="pr-2">Contact</span>
              <span className="h-full aspect-square rounded-full bg-[#EC0B12] group-hover:bg-[#D0080E] text-white flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                <CustomerSupportIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </span>
            </Link>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="w-full relative flex items-center"
          >
            <Search className="w-4 h-4 text-[#8C7D80] absolute left-3.5 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for gifts, frames, occasions..."
              className="w-full bg-[#FAF5F1] hover:bg-[#F5ECE5] focus:bg-white text-sm text-[#221C1D] placeholder-[#8C7D80] pl-10 pr-9 py-2 rounded-full border border-[#EDE0D6] focus:border-[#EC0B12] focus:ring-2 focus:ring-[#EC0B12]/15 outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-[#8C7D80] hover:text-[#221C1D] p-0.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Desktop Layout (md+): 1 Elegant Single Row */}
        <div className="hidden md:flex items-center justify-between gap-6 w-full">
          {/* Logo on Left */}
          <Logo size="md" />

          {/* Search Bar in Center */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl relative flex items-center"
          >
            <Search className="w-4 h-4 text-[#8C7D80] absolute left-3.5 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for gifts, frames, occasions..."
              className="w-full bg-[#FAF5F1] hover:bg-[#F5ECE5] focus:bg-white text-sm text-[#221C1D] placeholder-[#8C7D80] pl-10 pr-9 py-2.5 rounded-full border border-[#EDE0D6] focus:border-[#EC0B12] focus:ring-2 focus:ring-[#EC0B12]/15 outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-[#8C7D80] hover:text-[#221C1D] p-0.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Contact Button on Right */}
          <Link
            href="/contact"
            className="inline-flex items-center h-9.5 sm:h-10 pl-3.5 pr-0 rounded-full bg-white hover:bg-[#FEF2F2] text-[#221C1D] hover:text-[#EC0B12] border border-[#D8CAC0] hover:border-[#EC0B12] transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 shrink-0 text-sm font-bold cursor-pointer group"
            aria-label="Contact Us"
            title="Contact Us"
          >
            <span className="pr-2.5">Contact</span>
            <span className="h-full aspect-square rounded-full bg-[#EC0B12] group-hover:bg-[#D0080E] text-white flex items-center justify-center transition-colors shrink-0 shadow-2xs">
              <CustomerSupportIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

