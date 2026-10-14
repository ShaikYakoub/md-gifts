"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-3 pb-3 sm:pt-4 sm:pb-3.5 flex flex-col items-center gap-2 sm:gap-2.5">
        {/* Centered Logo — Nothing else on this row */}
        <div className="flex items-center justify-center">
          <Logo size="md" />
        </div>

        {/* Search Bar directly below the logo — No filter button */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-xl relative flex items-center"
        >
          <Search className="w-4 h-4 text-[#8C7D80] absolute left-3.5 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for gifts, frames, occasions..."
            className="w-full bg-[#FAF5F1] hover:bg-[#F5ECE5] focus:bg-white text-sm text-[#221C1D] placeholder-[#8C7D80] pl-10 pr-9 py-2 sm:py-2.5 rounded-full border border-[#EDE0D6] focus:border-[#EC0B12] focus:ring-2 focus:ring-[#EC0B12]/15 outline-none transition-all shadow-2xs"
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
    </header>
  );
}

