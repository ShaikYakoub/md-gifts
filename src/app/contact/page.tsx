import React from "react";
import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { GmailLogo } from "@/components/ui/GmailLogo";
import { InstagramLogo } from "@/components/ui/InstagramLogo";
import { GoogleCallLogo } from "@/components/ui/GoogleCallLogo";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: `Contact Us — ${SITE_CONFIG.name}`,
  description: `Get in touch with ${SITE_CONFIG.fullName}. Direct WhatsApp, email, call, and store location in ${SITE_CONFIG.address.city}, ${SITE_CONFIG.address.state}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
};

export default function ContactPage() {
  const whatsappUrl = getGeneralWhatsAppUrl();

  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10 pb-4 sm:pb-6 border-b border-[#EFE4DC]">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#221C1D] tracking-tight">
            Contact Us
          </h1>
        </div>

        {/* Content Section */}
        <div className="space-y-8 sm:space-y-10">
          {/* Direct Channels */}
          <div className="space-y-3.5">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#221C1D] tracking-tight">
              Direct Channels
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 h-11 px-4 py-2 rounded-full bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#16A34A] hover:border-[#16A34A] hover:bg-[#F0FDF4] transition-all shadow-2xs font-semibold text-xs sm:text-sm cursor-pointer"
                aria-label="Chat with MD Gifts on WhatsApp"
              >
                <WhatsAppLogo className="w-4 h-4 shrink-0" />
                <span>WhatsApp</span>
              </a>

              {/* Gmail */}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="group inline-flex items-center justify-center gap-2 h-11 px-4 py-2 rounded-full bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#EC0B12] hover:border-[#EC0B12] hover:bg-[#FEF2F2] transition-all shadow-2xs font-semibold text-xs sm:text-sm cursor-pointer"
                aria-label={`Email ${SITE_CONFIG.email} via Gmail`}
              >
                <GmailLogo className="w-4 h-4 shrink-0" />
                <span>Gmail</span>
              </a>

              {/* Direct Call */}
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="group inline-flex items-center justify-center gap-2 h-11 px-4 py-2 rounded-full bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#EC0B12] hover:border-[#EC0B12] hover:bg-[#FEF2F2] transition-all shadow-2xs font-semibold text-xs sm:text-sm cursor-pointer"
                aria-label={`Call ${SITE_CONFIG.phoneDisplay}`}
              >
                <GoogleCallLogo className="w-4 h-4 shrink-0" />
                <span>Call Us</span>
              </a>

              {/* Instagram */}
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 h-11 px-4 py-2 rounded-full bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#E1306C] hover:border-[#E1306C] hover:bg-[#FDF2F8] transition-all shadow-2xs font-semibold text-xs sm:text-sm cursor-pointer"
                aria-label="Follow MD Gifts on Instagram"
              >
                <InstagramLogo className="w-4 h-4 shrink-0" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Workshop & Store Address */}
          <div className="pt-6 sm:pt-8 border-t border-[#EDE1D7]/70">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FEF2F2] border border-[#F5C2BC] flex items-center justify-center shrink-0 text-[#EC0B12] mt-0.5">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7B7E]">
                  Workshop & Store Address
                </p>
                <h3 className="font-semibold text-base sm:text-lg text-[#221C1D]">
                  {SITE_CONFIG.fullName}
                </h3>
                <div className="text-xs sm:text-sm text-[#5C4F51] space-y-1 leading-relaxed pt-1">
                  <p><span className="font-medium text-[#221C1D]">Building/Flat:</span> {SITE_CONFIG.address.building}</p>
                  <p><span className="font-medium text-[#221C1D]">Street/Road:</span> {SITE_CONFIG.address.street}</p>
                  <p><span className="font-medium text-[#221C1D]">City:</span> {SITE_CONFIG.address.city}</p>
                  <p><span className="font-medium text-[#221C1D]">District:</span> {SITE_CONFIG.address.district}</p>
                  <p><span className="font-medium text-[#221C1D]">State:</span> {SITE_CONFIG.address.state} — PIN: {SITE_CONFIG.address.pincode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
