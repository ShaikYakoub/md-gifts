"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Users,
  Info,
  HelpCircle,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const shopLinks = [
    { label: "All Gifts", href: "/shop" },
    { label: "Photo Frames", href: "/categories/frames" },
    { label: "Personalized Keepsakes", href: "/categories/personalized-gifts" },
    { label: "Custom Mugs", href: "/categories/mugs" },
    { label: "Engraved Keychains", href: "/categories/keychains" },
    { label: "Gift Boxes", href: "/categories/gift-boxes" },
  ];

  const occasionLinks = [
    { label: "Birthdays", href: "/categories/birthdays" },
    { label: "Anniversaries", href: "/categories/anniversaries" },
    { label: "Couples", href: "/categories/couples" },
    { label: "Families", href: "/categories/families" },
    { label: "Festivals", href: "/categories/festivals" },
    { label: "Weddings", href: "/categories/weddings" },
  ];

  const recipientLinks = [
    { label: "For Her", href: "/categories/for-her" },
    { label: "For Him", href: "/categories/for-him" },
    { label: "For Couples", href: "/categories/for-couples" },
    { label: "For Parents", href: "/categories/for-parents" },
    { label: "For Friends", href: "/categories/for-friends" },
    { label: "For Kids", href: "/categories/for-kids" },
  ];

  const aboutLinks = [
    { label: "Our Story", href: "/about" },
    { label: "Craftsmanship & Quality", href: "/about#craftsmanship" },
    { label: "Contact Us", href: "/contact" },
  ];

  const supportLinks = [
    { label: "FAQs", href: "/faq" },
    { label: "Shipping & Delivery", href: "/policies#shipping" },
    { label: "Refunds & Cancellation", href: "/policies#refunds" },
    { label: "Terms & Conditions", href: "/policies#terms" },
    { label: "Privacy Policy", href: "/policies#privacy" },
  ];

  return (
    <footer className="bg-[#FAF4F0] border-t border-[#EDE1D7] text-[#4A3E40] pt-12 pb-32 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Instagram Only (Requirements 119-124) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-[#E8DDD4] gap-6">
          <div>
            <Logo size="lg" />
            <p className="mt-2 text-sm text-[#6C5F61] max-w-sm">
              Thoughtful gifts for every occasion. Personalized with love, made to last.
            </p>
          </div>

          {/* Rectangular Instagram Button with Icon + Label (Requirements 121, 122) */}
          <div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8DDD4] text-[#4A3E40] hover:text-[#C85250] hover:border-[#C85250] hover:bg-[#FDF7F5] transition-all shadow-2xs font-semibold text-xs sm:text-sm cursor-pointer"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-4 h-4 fill-current text-[#E1306C]" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* Permanently Visible Section Headings with Tag/Chip-Style Links (Requirements 125-130) */}
        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 border-b border-[#E8DDD4]">
          {/* Shop Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-serif text-base font-bold text-[#221C1D]">
              <ShoppingBag className="w-4 h-4 text-[#C85250]" />
              <h3>Shop</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {shopLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E8DDD4] text-xs text-[#5C4F51] hover:text-[#C85250] hover:border-[#C85250] hover:bg-[#FAF4F0] transition-colors shadow-2xs font-medium cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Shop by Occasion Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-serif text-base font-bold text-[#221C1D]">
              <Heart className="w-4 h-4 text-[#C85250]" />
              <h3>Shop by Occasion</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {occasionLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E8DDD4] text-xs text-[#5C4F51] hover:text-[#C85250] hover:border-[#C85250] hover:bg-[#FAF4F0] transition-colors shadow-2xs font-medium cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Shop by Recipient Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-serif text-base font-bold text-[#221C1D]">
              <Users className="w-4 h-4 text-[#C85250]" />
              <h3>Shop by Recipient</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recipientLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E8DDD4] text-xs text-[#5C4F51] hover:text-[#C85250] hover:border-[#C85250] hover:bg-[#FAF4F0] transition-colors shadow-2xs font-medium cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* About Us Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-serif text-base font-bold text-[#221C1D]">
              <Info className="w-4 h-4 text-[#C85250]" />
              <h3>About Us</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {aboutLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E8DDD4] text-xs text-[#5C4F51] hover:text-[#C85250] hover:border-[#C85250] hover:bg-[#FAF4F0] transition-colors shadow-2xs font-medium cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Help & Support Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-serif text-base font-bold text-[#221C1D]">
              <HelpCircle className="w-4 h-4 text-[#C85250]" />
              <h3>Help & Support</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {supportLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E8DDD4] text-xs text-[#5C4F51] hover:text-[#C85250] hover:border-[#C85250] hover:bg-[#FAF4F0] transition-colors shadow-2xs font-medium cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright & Legal Links */}
        <div className="pt-8 border-t border-[#E8DDD4] text-center space-y-2">
          <p className="text-xs text-[#7A6D70]">
            © 2026 Giftly. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#6C5E61]">
            <Link href="/policies#privacy" className="hover:text-[#C85250] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#C5B7AF]">|</span>
            <Link href="/policies#terms" className="hover:text-[#C85250] transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-[#C5B7AF]">|</span>
            <Link href="/policies#refunds" className="hover:text-[#C85250] transition-colors">
              Refund Policy
            </Link>
            <span className="text-[#C5B7AF]">|</span>
            <Link href="/policies#shipping" className="hover:text-[#C85250] transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
