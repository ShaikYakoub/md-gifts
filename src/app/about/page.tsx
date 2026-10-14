import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Gem, Gift, MapPin } from "lucide-react";
import { InfoPageLayout } from "@/components/informational/InfoPageLayout";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "About Us — MD Gifts Customized Gift Centre",
  description:
    "Learn about MD Gifts: handcrafted personalized photo frames, custom mugs, crystal keepsakes, and curated gift boxes crafted with love in Kadapa, Andhra Pradesh.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <InfoPageLayout
      title="About MD Gifts"
      subtitle="Thoughtful customized gifts for every milestone. Handcrafted with love in Kadapa, made to last forever."
      breadcrumbLabel="About Us"
    >
      <div className="space-y-8">
        {/* Narrative & Visual */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4 text-sm sm:text-base text-[#5C4F51] leading-relaxed">
            <p>
              At <strong className="text-[#221C1D]">{SITE_CONFIG.fullName}</strong>, we believe every gift tells a heartfelt story. Based in the heart of Kadapa on Raja Reddy Street, our creative workshop is dedicated to turning life&apos;s most cherished moments into enduring, museum-grade keepsakes.
            </p>
            <p>
              From anniversary milestones and wedding portraits to newborn memories, customized mugs, and festive surprises, we craft every personalized piece with precision and love. We don&apos;t just print photos — we curate emotional treasures that bring a warm smile every single day.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs font-medium text-[#0194A3]">
              <MapPin className="w-4 h-4 shrink-0 text-[#EC0B12]" />
              <span>Workshop: {SITE_CONFIG.address.formatted}</span>
            </div>
          </div>
          <div className="md:col-span-5 aspect-[4/3] sm:aspect-square relative rounded-2xl overflow-hidden border border-[#EDE0D6] shadow-sm">
            <Image
              src="/images/newsletter-gift.jpg"
              alt="MD Gifts handcrafted gift presentation"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 350px"
            />
          </div>
        </div>

        {/* Value Pillars */}
        <div className="pt-4 border-t border-[#EFE4DC] grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#FAF5F1] rounded-xl border border-[#EDE1D7] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-[#EC0B12]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#221C1D]">Made with Love</h3>
              <p className="text-xs text-[#7A6D70] mt-0.5">
                Thoughtfully crafted personal gifts tailored to your exact memories and words.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#FAF5F1] rounded-xl border border-[#EDE1D7] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E6F7F9] flex items-center justify-center shrink-0">
              <Gem className="w-5 h-5 text-[#0194A3]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#221C1D]">Premium Craftsmanship</h3>
              <p className="text-xs text-[#7A6D70] mt-0.5">
                Archival non-fade inks, solid timber framing, and high-clarity crystal acrylics.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#FAF5F1] rounded-xl border border-[#EDE1D7] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-[#EC0B12]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#221C1D]">For Every Occasion</h3>
              <p className="text-xs text-[#7A6D70] mt-0.5">
                Birthdays, weddings, couples, housewarmings, anniversaries, and festive celebrations.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment Banner */}
        <div className="p-6 bg-[#FEF2F2] rounded-2xl border border-[#FCD5D7] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-semibold text-sm sm:text-base text-[#221C1D]">
              Direct WhatsApp Support & Digital Proofs
            </h4>
            <p className="text-xs text-[#7A6D70]">
              We share design proofs via WhatsApp before printing to ensure your gift looks 100% perfect.
            </p>
          </div>
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#EC0B12] hover:bg-[#D0080E] text-white text-xs font-semibold rounded-xl shrink-0 transition-colors cursor-pointer"
          >
            Chat with MD Gifts Designer
          </a>
        </div>
      </div>
    </InfoPageLayout>
  );
}
