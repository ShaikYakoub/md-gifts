"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ShoppingBag,
  ChevronDown,
  Cake,
  Flame,
  Heart,
  Users,
  Sparkles,
  Baby,
  Home as DecorIcon,
  PartyPopper,
  HeartHandshake,
  Smile,
  Briefcase,
  Gift,
  User,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CustomerSupportIcon } from "@/components/ui/CustomerSupportIcon";
import { SearchBar } from "@/components/ui/SearchBar";
import { useCart } from "@/context/CartContext";
import { OCCASIONS, RECIPIENTS } from "@/data/categories";

interface HeaderProps {
  onOpenSidebar?: () => void;
}

const NAV_LINKS = [
  { label: "All Gifts", href: "/shop" },
  { label: "Personalized Gifts", href: "/categories/personalized-gifts" },
  { label: "Frames", href: "/categories/frames" },
  { label: "Mugs", href: "/categories/mugs" },
  { label: "Keychains", href: "/categories/keychains" },
  { label: "Home Decor", href: "/categories/home-decor" },
  { label: "Gift Boxes", href: "/categories/gift-boxes" },
];

const OCCASION_ICONS: Record<string, React.ElementType> = {
  birthdays: Cake,
  anniversaries: Flame,
  couples: Heart,
  families: Users,
  festivals: Sparkles,
  "new-baby": Baby,
  housewarming: DecorIcon,
  weddings: PartyPopper,
};

const RECIPIENT_ICONS: Record<string, React.ElementType> = {
  "for-her": Heart,
  "for-him": User,
  "for-couples": HeartHandshake,
  "for-parents": Users,
  "for-friends": Smile,
  "for-kids": Baby,
  "for-colleagues": Briefcase,
  "for-everyone": Gift,
};

export function Header({ onOpenSidebar }: HeaderProps = {}) {
  const pathname = usePathname();
  const { totalQuantity } = useCart();
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

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href;
  };

  const isOccasionActive = OCCASIONS.some((occ) => pathname === `/categories/${occ.slug}`);
  const isRecipientActive = RECIPIENTS.some((rec) => pathname === `/categories/${rec.slug}`);

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE4DC] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 ease-in-out ${
        isProductPage ? "hidden md:block" : ""
      }`}
    >
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Desktop Single-Row Header (>= md) */}
        <div className="hidden md:flex items-center justify-between gap-6 lg:gap-8 py-3 sm:py-3.5 w-full">
          {/* Logo on Left */}
          <Logo size="md" className="shrink-0" />

          {/* SearchBar in Center (Desktop) */}
          {showSearchBar && (
            <div className="flex-1 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
              <SearchBar id="desktop-search-input" />
            </div>
          )}

          {/* Actions on Right: Cart & Contact */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Desktop Cart Button */}
            <Link
              href="/cart"
              className="group inline-flex items-center justify-center gap-2 h-9.5 sm:h-10.5 md:h-11 px-3.5 sm:px-4 rounded-full bg-white text-[#221C1D] hover:text-[#EC0B12] border border-[#D8CAC0] transition-colors duration-150 shadow-2xs shrink-0 text-xs sm:text-sm md:text-base font-bold cursor-pointer"
              aria-label={`Shopping Cart (${totalQuantity} items)`}
              title="Shopping Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-[#3C3234] group-hover:text-[#EC0B12] transition-colors" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-4.5 h-4.5 px-1 bg-[#EC0B12] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {totalQuantity}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline font-bold">Cart</span>
            </Link>

            {/* Contact Button */}
            <Link
              href="/contact"
              className="group inline-flex items-center justify-end h-9.5 sm:h-10.5 md:h-11 pl-4 pr-0 rounded-full bg-white text-[#221C1D] hover:text-[#EC0B12] border border-[#D8CAC0] transition-colors duration-150 shadow-2xs shrink-0 text-xs sm:text-sm md:text-base font-bold cursor-pointer"
              aria-label="Contact Us"
              title="Contact Us"
            >
              <span className="whitespace-nowrap pr-3 transition-colors">
                Contact
              </span>
              <span className="h-full aspect-square rounded-full border-2 border-[#EC0B12] bg-white text-[#EC0B12] flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                <CustomerSupportIcon className="w-5.5 h-5.5 md:w-6.5 md:h-6.5 text-[#EC0B12]" />
              </span>
            </Link>
          </div>
        </div>

        {/* Desktop Navbar Row below Search (>= md) */}
        {!isCheckoutPage && (
          <nav
            aria-label="Primary site navigation"
            className="hidden md:flex items-center justify-center gap-1.5 md:gap-3 lg:gap-5 xl:gap-7 py-2.5 sm:py-3 border-t border-[#F0E6DE] w-full text-xs md:text-sm lg:text-[14.5px] xl:text-[15.5px]"
          >
            {/* Primary Category Links */}
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-1.5 px-2 md:px-2.5 font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                    active
                      ? "text-[#EC0B12]"
                      : "text-[#3C3234] hover:text-[#EC0B12]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Occasions Dropdown */}
            <div className="relative group">
              <Link
                href="/categories"
                className={`inline-flex items-center gap-1.5 py-1.5 px-2 md:px-2.5 font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  isOccasionActive
                    ? "text-[#EC0B12]"
                    : "text-[#3C3234] hover:text-[#EC0B12]"
                }`}
              >
                <span>Occasions</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A7B7E] group-hover:text-[#EC0B12] transition-colors duration-150" />
              </Link>

              {/* Flyout Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-150 z-50">
                <div className="w-72 bg-white rounded-2xl shadow-xl border border-[#EDE0D6] p-2">
                  <div className="grid grid-cols-2 gap-0.5">
                    {OCCASIONS.filter((occ) => occ.slug !== "all-occasions").map((occ) => {
                      const OccIcon = OCCASION_ICONS[occ.slug] || Sparkles;
                      const active = pathname === `/categories/${occ.slug}`;
                      return (
                        <Link
                          key={occ.slug}
                          href={`/categories/${occ.slug}`}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            active
                              ? "text-[#EC0B12] font-semibold bg-[#FAF5F2]"
                              : "text-[#4A3E40] hover:text-[#EC0B12] hover:bg-[#FAF5F2]"
                          }`}
                        >
                          <OccIcon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-[#EC0B12]" : "text-[#7A6D70] group-hover:text-[#EC0B12]"}`} />
                          <span className="truncate">{occ.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-1 pt-1.5 border-t border-[#F0E6DE]">
                    <Link
                      href="/categories"
                      className="block text-center py-1 text-[11px] font-semibold text-[#EC0B12] hover:text-[#D0080E] hover:bg-[#FEF2F2] rounded-md transition-colors"
                    >
                      View All Occasions →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipients Dropdown */}
            <div className="relative group">
              <Link
                href="/categories"
                className={`inline-flex items-center gap-1.5 py-1.5 px-2 md:px-2.5 font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  isRecipientActive
                    ? "text-[#EC0B12]"
                    : "text-[#3C3234] hover:text-[#EC0B12]"
                }`}
              >
                <span>Recipients</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A7B7E] group-hover:text-[#EC0B12] transition-colors duration-150" />
              </Link>

              {/* Flyout Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-150 z-50">
                <div className="w-72 bg-white rounded-2xl shadow-xl border border-[#EDE0D6] p-2">
                  <div className="grid grid-cols-2 gap-0.5">
                    {RECIPIENTS.map((rec) => {
                      const RecIcon = RECIPIENT_ICONS[rec.slug] || Gift;
                      const active = pathname === `/categories/${rec.slug}`;
                      return (
                        <Link
                          key={rec.slug}
                          href={`/categories/${rec.slug}`}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            active
                              ? "text-[#EC0B12] font-semibold bg-[#FAF5F2]"
                              : "text-[#4A3E40] hover:text-[#EC0B12] hover:bg-[#FAF5F2]"
                          }`}
                        >
                          <RecIcon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-[#EC0B12]" : "text-[#7A6D70] group-hover:text-[#EC0B12]"}`} />
                          <span className="truncate">{rec.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-1 pt-1.5 border-t border-[#F0E6DE]">
                    <Link
                      href="/categories"
                      className="block text-center py-1 text-[11px] font-semibold text-[#EC0B12] hover:text-[#D0080E] hover:bg-[#FEF2F2] rounded-md transition-colors"
                    >
                      View All Recipients →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* About Us Link */}
            <Link
              href="/about"
              className={`py-1.5 px-2 md:px-2.5 font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                pathname === "/about"
                  ? "text-[#EC0B12]"
                  : "text-[#3C3234] hover:text-[#EC0B12]"
              }`}
            >
              About Us
            </Link>
          </nav>
        )}

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
              className="group inline-flex items-center justify-end h-8.5 pl-3 pr-0 rounded-full bg-white text-[#221C1D] hover:text-[#EC0B12] border border-[#D8CAC0] transition-colors duration-150 shadow-2xs shrink-0 text-xs font-bold cursor-pointer"
              aria-label="Contact Us"
              title="Contact Us"
            >
              <span className="whitespace-nowrap pr-2 transition-colors">Contact</span>
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
