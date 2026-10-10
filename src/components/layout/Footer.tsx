"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Users,
  Info,
  HelpCircle,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { GmailLogo } from "@/components/ui/GmailLogo";
import { InstagramLogo } from "@/components/ui/InstagramLogo";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const whatsappUrl = getGeneralWhatsAppUrl();
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
        {/* Brand & Contact Section (Phone, Email, WhatsApp, Instagram) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-8 border-b border-[#E8DDD4] gap-6">
          <div>
            <Logo size="lg" />
            <p className="mt-2 text-sm text-[#6C5F61] max-w-sm">
              Thoughtful gifts for every occasion. Personalized with love, made to last.
            </p>
          </div>

          {/* Contact Section */}
          <div className="w-full lg:w-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A7B7E] mb-2.5">
              Contact & Connect
            </h4>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 h-9 sm:h-10 px-3.5 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#1FA34D] hover:border-[#25D366] hover:bg-[#F4FAF5] transition-all shadow-2xs font-semibold text-xs sm:text-sm cursor-pointer"
                aria-label="Chat with us on WhatsApp"
              >
                <WhatsAppLogo className="w-4.5 h-4.5 shrink-0" />
                <span className="leading-none">WhatsApp</span>
              </a>

              {/* Gmail (replacing raw email address) */}
              <a
                href="mailto:support@giftly.in"
                className="group inline-flex items-center gap-2 h-9 sm:h-10 px-3.5 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#EA4335] hover:border-[#EA4335] hover:bg-[#FDF7F5] transition-all shadow-2xs font-semibold text-xs sm:text-sm cursor-pointer"
                aria-label="Email support@giftly.in via Gmail"
              >
                <GmailLogo className="w-4.5 h-4.5 shrink-0" />
                <span className="leading-none">Gmail</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 h-9 sm:h-10 px-3.5 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#E1306C] hover:border-[#E1306C] hover:bg-[#FDF7FA] transition-all shadow-2xs font-semibold text-xs sm:text-sm cursor-pointer"
                aria-label="Follow us on Instagram"
              >
                <InstagramLogo className="w-4.5 h-4.5 shrink-0" />
                <span className="leading-none">Instagram</span>
              </a>

              {/* Phone */}
              <a
                href="tel:+919876543210"
                className="group inline-flex items-center gap-2 h-9 sm:h-10 px-3.5 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#C85250] hover:border-[#C85250] hover:bg-[#FDF7F5] transition-all shadow-2xs font-semibold text-xs sm:text-sm cursor-pointer"
                aria-label="Call +91 98765 43210"
              >
                <Phone className="w-4 h-4 text-[#C85250] shrink-0" />
                <span className="leading-none">+91 98765 43210</span>
              </a>
            </div>
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
