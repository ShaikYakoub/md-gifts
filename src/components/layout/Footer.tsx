"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { GmailLogo } from "@/components/ui/GmailLogo";
import { InstagramLogo } from "@/components/ui/InstagramLogo";
import { GoogleCallLogo } from "@/components/ui/GoogleCallLogo";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const whatsappUrl = getGeneralWhatsAppUrl();

  return (
    <footer className="bg-[#FAF4F0] border-t border-[#EDE1D7] text-[#4A3E40] pt-10 pb-32 md:pb-12">
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
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 h-10 px-3.5 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#1FA34D] hover:border-[#25D366] hover:bg-[#F4FAF5] transition-all shadow-2xs font-medium text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
                aria-label="Chat with us on WhatsApp"
              >
                <WhatsAppLogo className="w-4.5 h-4.5 shrink-0" />
                <span>WhatsApp</span>
              </a>

              {/* Gmail */}
              <a
                href="mailto:support@giftly.in"
                className="group inline-flex items-center justify-center gap-2 h-10 px-3.5 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#EA4335] hover:border-[#EA4335] hover:bg-[#FDF7F5] transition-all shadow-2xs font-medium text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
                aria-label="Email support@giftly.in via Gmail"
              >
                <GmailLogo className="w-4.5 h-4.5 shrink-0" />
                <span>Gmail</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 h-10 px-3.5 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#E1306C] hover:border-[#E1306C] hover:bg-[#FDF7FA] transition-all shadow-2xs font-medium text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
                aria-label="Follow us on Instagram"
              >
                <InstagramLogo className="w-4.5 h-4.5 shrink-0" />
                <span>Instagram</span>
              </a>

              {/* Google Call */}
              <a
                href="tel:+919876543210"
                className="group inline-flex items-center justify-center gap-2 h-10 px-3.5 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#4285F4] hover:border-[#4285F4] hover:bg-[#F8FAFD] transition-all shadow-2xs font-medium text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
                aria-label="Call us via Google Call"
              >
                <GoogleCallLogo className="w-4.5 h-4.5 shrink-0" />
                <span>Google Call</span>
              </a>
            </div>
          </div>
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
