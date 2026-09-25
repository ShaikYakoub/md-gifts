"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, ChevronDown, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/context/CartContext";
import { CATEGORIES, OCCASIONS, RECIPIENTS } from "@/data/categories";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const router = useRouter();
  const { totalQuantity } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setActiveDropdown(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EFE4DC] shadow-[0_2px_8px_rgba(0,0,0,0.03)]" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo (left-aligned on all viewports matching screenshot) */}
        <div className="flex items-center shrink-0">
          <Logo />
        </div>

        {/* Desktop Navigation Links with Dropdowns */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-[15px] font-medium text-[#4A3E40]">
          <Link
            href="/shop"
            className="px-3 py-2 rounded-lg hover:text-[#C85250] hover:bg-[#FAF4F0] transition-colors"
          >
            All Gifts
          </Link>

          {/* Occasions Dropdown */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === "occasions" ? null : "occasions")}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeDropdown === "occasions" ? "text-[#C85250] bg-[#FAF4F0]" : "hover:text-[#C85250] hover:bg-[#FAF4F0]"
              }`}
            >
              <span>Occasions</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "occasions" ? "rotate-180 text-[#C85250]" : ""}`} />
            </button>

            {activeDropdown === "occasions" && (
              <div className="absolute top-full left-0 w-72 mt-2 p-3 bg-white rounded-xl shadow-xl border border-[#EDE2DA] grid grid-cols-2 gap-1 animate-fade-in z-50">
                {OCCASIONS.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/categories/${item.slug}`}
                    onClick={() => setActiveDropdown(null)}
                    className="px-3 py-2 text-sm text-[#4A3E40] hover:text-[#C85250] hover:bg-[#FAF4F0] rounded-lg transition-colors font-normal"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recipients Dropdown */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === "recipients" ? null : "recipients")}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeDropdown === "recipients" ? "text-[#C85250] bg-[#FAF4F0]" : "hover:text-[#C85250] hover:bg-[#FAF4F0]"
              }`}
            >
              <span>Recipients</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "recipients" ? "rotate-180 text-[#C85250]" : ""}`} />
            </button>

            {activeDropdown === "recipients" && (
              <div className="absolute top-full left-0 w-64 mt-2 p-3 bg-white rounded-xl shadow-xl border border-[#EDE2DA] flex flex-col gap-1 animate-fade-in z-50">
                {RECIPIENTS.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/categories/${item.slug}`}
                    onClick={() => setActiveDropdown(null)}
                    className="px-3 py-2 text-sm text-[#4A3E40] hover:text-[#C85250] hover:bg-[#FAF4F0] rounded-lg transition-colors font-normal"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Categories Dropdown */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === "categories" ? null : "categories")}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeDropdown === "categories" ? "text-[#C85250] bg-[#FAF4F0]" : "hover:text-[#C85250] hover:bg-[#FAF4F0]"
              }`}
            >
              <span>Categories</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "categories" ? "rotate-180 text-[#C85250]" : ""}`} />
            </button>

            {activeDropdown === "categories" && (
              <div className="absolute top-full left-0 w-64 mt-2 p-3 bg-white rounded-xl shadow-xl border border-[#EDE2DA] flex flex-col gap-1 animate-fade-in z-50">
                <Link
                  href="/categories"
                  onClick={() => setActiveDropdown(null)}
                  className="px-3 py-2 text-sm font-semibold text-[#C85250] hover:bg-[#FAF4F0] rounded-lg transition-colors border-b border-[#F0E6DF] mb-1"
                >
                  All Categories Overview →
                </Link>
                {CATEGORIES.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/categories/${item.slug}`}
                    onClick={() => setActiveDropdown(null)}
                    className="px-3 py-2 text-sm text-[#4A3E40] hover:text-[#C85250] hover:bg-[#FAF4F0] rounded-lg transition-colors font-normal"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Search Bar (responsive for both mobile & desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 max-w-[190px] xs:max-w-xs sm:max-w-md lg:max-w-lg mx-1.5 sm:mx-4 flex items-center"
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C7D80] absolute left-3 sm:left-3.5 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for gifts, frames, occasions..."
            className="w-full bg-[#FAF5F1] hover:bg-[#F5ECE5] focus:bg-white text-xs sm:text-sm text-[#221C1D] placeholder-[#8C7D80] pl-8 sm:pl-10 pr-7 sm:pr-8 py-1.5 sm:py-2.5 rounded-full border border-[#EDE0D6] focus:border-[#C85250] focus:ring-1 focus:ring-[#C85250] outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-[#8C7D80] hover:text-[#221C1D]"
              aria-label="Clear search"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
        </form>

        {/* Right Actions: Cart and Mobile Hamburger */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Cart Link with badge matching screenshot */}
          <Link
            href="/cart"
            className="relative p-2 text-[#4A3E40] hover:text-[#C85250] hover:bg-[#FAF2EE] rounded-full transition-colors flex items-center justify-center"
            aria-label={`Shopping cart with ${totalQuantity} items`}
          >
            <ShoppingCart className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8]" />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C85250] text-white text-[10px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger Menu on the right (matching input_file_1.png) */}
          <button
            type="button"
            onClick={onOpenSidebar}
            className="md:hidden p-2 text-[#4A3E40] hover:text-[#C85250] hover:bg-[#FAF2EE] rounded-lg transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
