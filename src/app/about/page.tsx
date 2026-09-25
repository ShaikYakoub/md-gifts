import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Gem, Gift } from "lucide-react";
import { InfoPageLayout } from "@/components/informational/InfoPageLayout";

export const metadata: Metadata = {
  title: "About Us — Handcrafted Personalized Gifts",
  description:
    "Learn about Giftly's mission: creating thoughtful, customized keepsakes and photo frames crafted with love and delivered across India.",
  alternates: {
    canonical: "https://giftly.in/about",
  },
};

export default function AboutPage() {
  const navItems = [
    { label: "About Us", href: "/about", isActive: true },
    { label: "Contact Us", href: "/contact", isActive: false },
    { label: "FAQ", href: "/faq", isActive: false },
    { label: "Shipping Policy", href: "/shipping", isActive: false },
    { label: "Refund Policy", href: "/refunds", isActive: false },
  ];

  return (
    <InfoPageLayout
      title="About Us"
      subtitle="Thoughtful gifts for every occasion. Personalized with love, made to last."
      breadcrumbLabel="About Us"
      navItems={navItems}
    >
      <div className="space-y-8">
        {/* Narrative & Visual matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4 text-sm sm:text-base text-[#5C4F51] leading-relaxed">
            <p>
              At <strong className="text-[#221C1D]">Giftly</strong>, we believe every gift tells a story. What began as a passionate creative studio crafting bespoke memory albums has grown into an artisan workshop dedicated to preserving life&apos;s most meaningful relationships.
            </p>
            <p>
              From anniversary milestones and newborn arrivals to festive celebrations and everyday gratitude, we take your sweetest moments and turn them into tangible, enduring keepsakes. We don&apos;t just print photos; we curate memories that kindle joy every time you look at them.
            </p>
          </div>
          <div className="md:col-span-5 aspect-[4/3] sm:aspect-square relative rounded-2xl overflow-hidden border border-[#EDE0D6] shadow-sm">
            <Image
              src="/images/newsletter-gift.jpg"
              alt="Giftly handcrafted gift presentation"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 350px"
            />
          </div>
        </div>

        {/* Value Pillars (matching screenshot) */}
        <div className="pt-4 border-t border-[#EFE4DC] grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#FAF5F1] rounded-xl border border-[#EDE1D7] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF0EC] flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-[#C85250]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#221C1D]">Made with Love</h3>
              <p className="text-xs text-[#7A6D70] mt-0.5">
                Thoughtfully crafted personal gifts designed to touch the heart.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#FAF5F1] rounded-xl border border-[#EDE1D7] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF0EC] flex items-center justify-center shrink-0">
              <Gem className="w-5 h-5 text-[#C85250]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#221C1D]">Premium Quality</h3>
              <p className="text-xs text-[#7A6D70] mt-0.5">
                Museum-grade archival inks, solid timber, and shatterproof crystal acrylic.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#FAF5F1] rounded-xl border border-[#EDE1D7] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF0EC] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-[#C85250]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#221C1D]">For Every Occasion</h3>
              <p className="text-xs text-[#7A6D70] mt-0.5">
                Birthdays, weddings, couples, housewarmings, and festive milestones.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment */}
        <div className="p-6 bg-[#FAF0EC] rounded-2xl border border-[#F2DCD4] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-semibold text-sm sm:text-base text-[#221C1D]">
              Direct WhatsApp Support Before Crafting
            </h4>
            <p className="text-xs text-[#7A6D70]">
              We share design proofs before printing to ensure your keepsake looks 100% perfect.
            </p>
          </div>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#C85250] hover:bg-[#B14140] text-white text-xs font-semibold rounded-xl shrink-0 transition-colors"
          >
            Chat with Designer
          </a>
        </div>
      </div>
    </InfoPageLayout>
  );
}
