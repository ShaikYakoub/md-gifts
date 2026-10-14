import React from "react";
import Link from "next/link";
import { TechmecsCredit } from "@/components/ui/TechmecsLogo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export function Footer() {
  return (
    <footer className="bg-[#FAF4F0] border-t border-[#EDE1D7] text-[#4A3E40] pt-8 pb-28 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">

        {/* Quick & Policy Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-[#6C5E61] pt-1">
          <Link href="/shop" className="hover:text-[#EC0B12] transition-colors">
            Shop All
          </Link>
          <span className="text-[#C5B7AF]">|</span>
          <Link href="/about" className="hover:text-[#EC0B12] transition-colors">
            About Us
          </Link>
          <span className="text-[#C5B7AF]">|</span>
          <Link href="/faq" className="hover:text-[#EC0B12] transition-colors">
            FAQ
          </Link>
          <span className="text-[#C5B7AF]">|</span>
          <Link href="/contact" className="hover:text-[#EC0B12] transition-colors">
            Contact
          </Link>
          <span className="text-[#C5B7AF]">|</span>
          <Link href="/policies#privacy" className="hover:text-[#EC0B12] transition-colors">
            Privacy Policy
          </Link>
          <span className="text-[#C5B7AF]">|</span>
          <Link href="/policies#terms" className="hover:text-[#EC0B12] transition-colors">
            Terms & Conditions
          </Link>
          <span className="text-[#C5B7AF]">|</span>
          <Link href="/policies#refunds" className="hover:text-[#EC0B12] transition-colors">
            Refund Policy
          </Link>
          <span className="text-[#C5B7AF]">|</span>
          <Link href="/policies#shipping" className="hover:text-[#EC0B12] transition-colors">
            Shipping Policy
          </Link>
        </div>

        {/* Copyright & Techmecs Credit */}
        <div className="pt-2 border-t border-[#EDE1D7]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A6D70]">
          <p>© 2026 {SITE_CONFIG.name}. All rights reserved.</p>
          <TechmecsCredit />
        </div>
      </div>
    </footer>
  );
}

