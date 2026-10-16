"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  id?: string;
}

function SearchBarInner({
  className = "max-w-2xl mx-auto",
  placeholder = "Search for gifts, frames, occasions...",
  id = "store-search-input",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Sync input value with URL "q" parameter
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = ((formData.get("q") as string) || searchQuery).trim();
    if (q) {
      router.push(`/shop?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/shop");
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    if (searchParams.get("q")) {
      router.push("/shop");
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={`w-full relative flex items-center ${className}`}
    >
      <Search className="w-4 h-4 text-[#8C7D80] absolute left-4 pointer-events-none" />
      <input
        id={id}
        name="q"
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#FAF5F1] hover:bg-[#F5ECE5] focus:bg-white text-sm text-[#221C1D] placeholder-[#8C7D80] pl-11 pr-10 py-2.5 sm:py-3 rounded-full border border-[#EDE0D6] focus:border-[#EC0B12] focus:ring-2 focus:ring-[#EC0B12]/15 outline-none transition-all shadow-2xs hover:shadow-xs [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden [&::-ms-clear]:hidden"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3.5 text-[#8C7D80] hover:text-[#221C1D] p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
}

export function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={
      <div className={`w-full relative flex items-center h-10 rounded-full bg-[#FAF5F1] border border-[#EDE0D6] ${props.className || ""}`}>
        <Search className="w-4 h-4 text-[#8C7D80] absolute left-4 pointer-events-none" />
      </div>
    }>
      <SearchBarInner {...props} />
    </Suspense>
  );
}
