"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ShoppingCart, Menu, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useCart } from "@/context/CartContext";
import { CATEGORIES, OCCASIONS, RECIPIENTS } from "@/data/categories";
import { useLiveCatalog } from "@/context/CatalogContext";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isProductPage = pathname.startsWith("/product/");
  const whatsappUrl = getGeneralWhatsAppUrl();
  const { totalQuantity } = useCart();
  const { categories: liveCategories, occasions: liveOccasions, recipients: liveRecipients } = useLiveCatalog();

  const categoriesList = liveCategories && liveCategories.length > 0 ? liveCategories : CATEGORIES;
  const occasionsList = liveOccasions && liveOccasions.length > 0 ? liveOccasions : OCCASIONS;
  const recipientsList = liveRecipients && liveRecipients.length > 0 ? liveRecipients : RECIPIENTS;

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
    <header
      className={`sticky top-0 z-40 bg-white border-b border-[#EFE4DC] shadow-[0_2px_8px_rgba(0,0,0,0.03)] ${
        isProductPage ? "hidden md:block" : ""
      }`}
      ref={dropdownRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Hamburger on LEFT (Items 1, 4) */}
        <div className="flex md:hidden items-center w-20 shrink-0">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="p-2 -ml-2 text-[#4A3E40] hover:text-[#C85250] hover:bg-[#FAF2EE] rounded-lg transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Logo: Centered on mobile, Left on desktop (Item 4) */}
        <div className="flex-1 md:flex-initial flex items-center justify-center md:justify-start shrink-0">
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
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeDropdown === "occasions"
                  ? "text-[#C85250] bg-[#FAF4F0]"
                  : "hover:text-[#C85250] hover:bg-[#FAF4F0]"
              }`}
            >
              <span>Occasions</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  activeDropdown === "occasions" ? "rotate-180 text-[#C85250]" : ""
                }`}
              />
            </button>

            {activeDropdown === "occasions" && (
              <div className="absolute top-full left-0 w-72 mt-2 p-3 bg-white rounded-xl shadow-xl border border-[#EDE2DA] grid grid-cols-2 gap-1 animate-fade-in z-50">
                {occasionsList.map((item) => (
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
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeDropdown === "recipients"
                  ? "text-[#C85250] bg-[#FAF4F0]"
                  : "hover:text-[#C85250] hover:bg-[#FAF4F0]"
              }`}
            >
              <span>Recipients</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  activeDropdown === "recipients" ? "rotate-180 text-[#C85250]" : ""
                }`}
              />
            </button>

            {activeDropdown === "recipients" && (
              <div className="absolute top-full left-0 w-64 mt-2 p-3 bg-white rounded-xl shadow-xl border border-[#EDE2DA] flex flex-col gap-1 animate-fade-in z-50">
                {recipientsList.map((item) => (
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
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeDropdown === "categories"
                  ? "text-[#C85250] bg-[#FAF4F0]"
                  : "hover:text-[#C85250] hover:bg-[#FAF4F0]"
              }`}
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  activeDropdown === "categories" ? "rotate-180 text-[#C85250]" : ""
                }`}
              />
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
                {categoriesList.map((item) => (
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

        {/* Desktop-only Search Bar (Item 2: hidden on mobile) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex relative flex-1 max-w-md lg:max-w-lg mx-4 items-center"
        >
          <Search className="w-4 h-4 text-[#8C7D80] absolute left-3.5 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for gifts, frames, occasions..."
            className="w-full bg-[#FAF5F1] hover:bg-[#F5ECE5] focus:bg-white text-sm text-[#221C1D] placeholder-[#8C7D80] pl-10 pr-8 py-2 rounded-full border border-[#EDE0D6] focus:border-[#C85250] focus:ring-1 focus:ring-[#C85250] outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-[#8C7D80] hover:text-[#221C1D]"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Right Actions: Contact Button (WhatsApp) + Desktop Cart */}
        <div className="flex items-center justify-end w-20 md:w-auto gap-2 sm:gap-3 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BA5C] text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
            aria-label="Contact us on WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white shrink-0" />
            <span>Contact</span>
          </a>

          {/* Desktop-only Right Actions: Cart */}
          <Link
            href="/cart"
            className="hidden md:flex relative p-2 text-[#4A3E40] hover:text-[#C85250] hover:bg-[#FAF2EE] rounded-full transition-colors items-center justify-center cursor-pointer"
            aria-label={`Shopping cart with ${totalQuantity} items`}
          >
            <ShoppingCart className="w-5.5 h-5.5 stroke-[1.8]" />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C85250] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar with Filter Slider (Reference Mockup Style) */}
      {!isProductPage && pathname !== "/search" && (
        <div className="md:hidden px-4 pb-2.5 pt-0.5">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center"
          >
          <Search className="w-4 h-4 text-[#8C7D80] absolute left-3.5 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gifts, frames, occasions..."
            className="w-full bg-[#FAF5F1] hover:bg-[#F5ECE5] focus:bg-white text-xs sm:text-sm text-[#221C1D] placeholder-[#8C7D80] pl-10 pr-10 py-2 rounded-full border border-[#EDE0D6] focus:border-[#C85250] outline-none transition-all shadow-2xs"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-[#8C7D80] hover:text-[#221C1D]"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/categories"
              className="absolute right-2 w-6.5 h-6.5 rounded-full bg-white border border-[#E8DDD4] text-[#6C5E61] hover:text-[#C85250] flex items-center justify-center shadow-2xs"
              aria-label="Filter categories"
            >
              <SlidersHorizontal className="w-3 h-3" />
            </Link>
          )}
        </form>
      </div>
      )}
    </header>
  );
}
