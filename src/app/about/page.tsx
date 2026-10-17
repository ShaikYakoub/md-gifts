import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Gem, Gift } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CustomerSupportIcon } from "@/components/ui/CustomerSupportIcon";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: `About Us — ${SITE_CONFIG.fullName}`,
  description:
    "Learn about MD Gifts: handcrafted personalized photo frames, custom mugs, crystal keepsakes, and curated gift boxes crafted with love in Kadapa, Andhra Pradesh.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-8 sm:space-y-10">
          {/* Main Description & Visual with Title inside - matching height */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-stretch">
            {/* Left: Title + Minimal Story */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-4">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#221C1D] tracking-tight">
                About MD Gifts
              </h1>
              <div className="space-y-3 text-sm sm:text-base text-[#5C4F51] leading-relaxed">
                <p>
                  Started in Kadapa, we now have 3 locations running across Andhra Pradesh, crafting personalized frames, custom mugs, and thoughtful keepsakes.
                </p>
                <p>
                  Every gift is handcrafted with love to celebrate life&apos;s special moments and last a lifetime.
                </p>
              </div>
            </div>

            {/* Right: Image matching height */}
            <div className="md:col-span-5 relative min-h-[220px] sm:min-h-[240px] rounded-2xl overflow-hidden border border-[#EDE0D6] shadow-2xs">
              <Image
                src="/images/newsletter-gift.jpg"
                alt="MD Gifts handcrafted gift presentation"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
          </div>

          {/* Value Pillars: Loose (no cards, no hover animations) */}
          <div className="pt-6 sm:pt-8 border-t border-[#EFE4DC] grid grid-cols-3 gap-3 sm:gap-8 text-center">
            <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-3 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EC0B12]">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-base md:text-lg text-[#221C1D] group-hover:text-[#EC0B12] transition-colors">
                Made with Love
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-3 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EC0B12]">
                <Gem className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-base md:text-lg text-[#221C1D] group-hover:text-[#EC0B12] transition-colors">
                Premium Craftsmanship
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-3 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EC0B12]">
                <Gift className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-base md:text-lg text-[#221C1D] group-hover:text-[#EC0B12] transition-colors">
                For Every Occasion
              </h3>
            </div>
          </div>

          {/* CTA Section */}
          <div className="pt-6 sm:pt-8 border-t border-[#EFE4DC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
              Wanna know more?
            </h2>
            <Link
              href="/contact"
              className="group inline-flex items-center justify-end h-10 pl-4 pr-0 rounded-full bg-white text-[#221C1D] hover:text-[#EC0B12] border border-[#D8CAC0] transition-colors duration-150 shadow-2xs shrink-0 text-sm font-bold cursor-pointer"
              aria-label="Contact Us"
              title="Contact Us"
            >
              <span className="whitespace-nowrap pr-2.5 transition-colors">
                Contact
              </span>
              <span className="h-full aspect-square rounded-full border-2 border-[#EC0B12] bg-white text-[#EC0B12] flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                <CustomerSupportIcon className="w-5 h-5 text-[#EC0B12]" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
