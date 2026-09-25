"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ShoppingBag,
  Heart,
  Users,
  Info,
  HelpCircle,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-[#FAF4F0] border-t border-[#EDE1D7] text-[#4A3E40] pt-12 pb-32 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Socials */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-[#E8DDD4] gap-6">
          <div>
            <Logo size="lg" />
            <p className="mt-2 text-sm text-[#6C5F61] max-w-sm">
              Thoughtful gifts for every occasion. Personalized with love, made to last.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#E8DDD4] flex items-center justify-center text-[#5C4F51] hover:text-[#C85250] hover:border-[#C85250] transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#E8DDD4] flex items-center justify-center text-[#5C4F51] hover:text-[#C85250] hover:border-[#C85250] transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#E8DDD4] flex items-center justify-center text-[#5C4F51] hover:text-[#C85250] hover:border-[#C85250] transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#E8DDD4] flex items-center justify-center text-[#5C4F51] hover:text-[#C85250] hover:border-[#C85250] transition-colors"
              aria-label="Pinterest"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Accordion on Mobile / Columns on Desktop */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8 border-b border-[#E8DDD4]">
          {/* Shop Column */}
          <div className="border-b md:border-b-0 border-[#EDE1D7] pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("shop")}
              className="w-full flex items-center justify-between md:cursor-default font-serif text-lg font-bold text-[#221C1D] mb-2 md:mb-4"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#C85250]" />
                <span>Shop</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${openSection === "shop" ? "rotate-180" : ""}`}
              />
            </button>
            <ul
              className={`space-y-2 text-sm text-[#6C5F61] ${
                openSection === "shop" ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link href="/shop" className="hover:text-[#C85250] transition-colors">
                  All Gifts
                </Link>
              </li>
              <li>
                <Link href="/categories/frames" className="hover:text-[#C85250] transition-colors">
                  Photo Frames
                </Link>
              </li>
              <li>
                <Link href="/categories/personalized-gifts" className="hover:text-[#C85250] transition-colors">
                  Personalized Keepsakes
                </Link>
              </li>
              <li>
                <Link href="/categories/mugs" className="hover:text-[#C85250] transition-colors">
                  Custom Mugs
                </Link>
              </li>
              <li>
                <Link href="/categories/keychains" className="hover:text-[#C85250] transition-colors">
                  Engraved Keychains
                </Link>
              </li>
              <li>
                <Link href="/categories/gift-boxes" className="hover:text-[#C85250] transition-colors">
                  Gift Boxes
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop by Occasion Column */}
          <div className="border-b md:border-b-0 border-[#EDE1D7] pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("occasions")}
              className="w-full flex items-center justify-between md:cursor-default font-serif text-lg font-bold text-[#221C1D] mb-2 md:mb-4"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C85250]" />
                <span>Shop by Occasion</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${openSection === "occasions" ? "rotate-180" : ""}`}
              />
            </button>
            <ul
              className={`space-y-2 text-sm text-[#6C5F61] ${
                openSection === "occasions" ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link href="/categories/birthdays" className="hover:text-[#C85250] transition-colors">
                  Birthdays
                </Link>
              </li>
              <li>
                <Link href="/categories/anniversaries" className="hover:text-[#C85250] transition-colors">
                  Anniversaries
                </Link>
              </li>
              <li>
                <Link href="/categories/couples" className="hover:text-[#C85250] transition-colors">
                  Couples
                </Link>
              </li>
              <li>
                <Link href="/categories/families" className="hover:text-[#C85250] transition-colors">
                  Families
                </Link>
              </li>
              <li>
                <Link href="/categories/festivals" className="hover:text-[#C85250] transition-colors">
                  Festivals
                </Link>
              </li>
              <li>
                <Link href="/categories/weddings" className="hover:text-[#C85250] transition-colors">
                  Weddings
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop by Recipient Column */}
          <div className="border-b md:border-b-0 border-[#EDE1D7] pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("recipients")}
              className="w-full flex items-center justify-between md:cursor-default font-serif text-lg font-bold text-[#221C1D] mb-2 md:mb-4"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C85250]" />
                <span>Shop by Recipient</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${openSection === "recipients" ? "rotate-180" : ""}`}
              />
            </button>
            <ul
              className={`space-y-2 text-sm text-[#6C5F61] ${
                openSection === "recipients" ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link href="/categories/for-her" className="hover:text-[#C85250] transition-colors">
                  For Her
                </Link>
              </li>
              <li>
                <Link href="/categories/for-him" className="hover:text-[#C85250] transition-colors">
                  For Him
                </Link>
              </li>
              <li>
                <Link href="/categories/for-couples" className="hover:text-[#C85250] transition-colors">
                  For Couples
                </Link>
              </li>
              <li>
                <Link href="/categories/for-parents" className="hover:text-[#C85250] transition-colors">
                  For Parents
                </Link>
              </li>
              <li>
                <Link href="/categories/for-friends" className="hover:text-[#C85250] transition-colors">
                  For Friends
                </Link>
              </li>
              <li>
                <Link href="/categories/for-kids" className="hover:text-[#C85250] transition-colors">
                  For Kids
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us Column */}
          <div className="border-b md:border-b-0 border-[#EDE1D7] pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("about")}
              className="w-full flex items-center justify-between md:cursor-default font-serif text-lg font-bold text-[#221C1D] mb-2 md:mb-4"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#C85250]" />
                <span>About Us</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${openSection === "about" ? "rotate-180" : ""}`}
              />
            </button>
            <ul
              className={`space-y-2 text-sm text-[#6C5F61] ${
                openSection === "about" ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link href="/about" className="hover:text-[#C85250] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about#craftsmanship" className="hover:text-[#C85250] transition-colors">
                  Craftsmanship & Quality
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C85250] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support Column */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("support")}
              className="w-full flex items-center justify-between md:cursor-default font-serif text-lg font-bold text-[#221C1D] mb-2 md:mb-4"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C85250]" />
                <span>Help & Support</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${openSection === "support" ? "rotate-180" : ""}`}
              />
            </button>
            <ul
              className={`space-y-2 text-sm text-[#6C5F61] ${
                openSection === "support" ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link href="/faq" className="hover:text-[#C85250] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#C85250] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-[#C85250] transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#C85250] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#C85250] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Legal Links */}
        <div className="pt-8 border-t border-[#E8DDD4] text-center space-y-2">
          <p className="text-xs text-[#7A6D70]">
            © 2026 Giftly. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#6C5E61]">
            <Link href="/privacy" className="hover:text-[#C85250] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#C5B7AF]">|</span>
            <Link href="/terms" className="hover:text-[#C85250] transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-[#C5B7AF]">|</span>
            <Link href="/refunds" className="hover:text-[#C85250] transition-colors">
              Refund Policy
            </Link>
            <span className="text-[#C5B7AF]">|</span>
            <Link href="/shipping" className="hover:text-[#C85250] transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
