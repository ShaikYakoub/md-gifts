"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  className = "max-w-2xl mx-auto",
  placeholder = "Search for gifts, frames, occasions...",
}: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={`w-full relative flex items-center ${className}`}
    >
      <Search className="w-4 h-4 text-[#8C7D80] absolute left-4 pointer-events-none" />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#FAF5F1] hover:bg-[#F5ECE5] focus:bg-white text-sm text-[#221C1D] placeholder-[#8C7D80] pl-11 pr-10 py-2.5 sm:py-3 rounded-full border border-[#EDE0D6] focus:border-[#EC0B12] focus:ring-2 focus:ring-[#EC0B12]/15 outline-none transition-all shadow-2xs hover:shadow-xs"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="absolute right-3.5 text-[#8C7D80] hover:text-[#221C1D] p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
}
