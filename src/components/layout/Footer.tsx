"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-[#FAF4F0] border-t border-[#EDE1D7] text-[#4A3E40] pt-10 pb-32 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Section */}
        <div className="flex flex-col items-center text-center pb-8 border-b border-[#E8DDD4]">
          <Logo size="lg" />
          <p className="mt-2 text-sm text-[#6C5F61] max-w-sm">
            Thoughtful gifts for every occasion. Personalized with love, made to last.
          </p>
        </div>

        {/* Copyright & Legal Links */}
        <div className="pt-8 text-center space-y-2">
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

