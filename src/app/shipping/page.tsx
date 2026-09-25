import React from "react";
import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/informational/InfoPageLayout";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — Giftly",
  description: "Learn about Giftly's shipping timelines, free delivery thresholds, packaging standards, and express courier partners across India.",
  alternates: {
    canonical: "https://giftly.in/shipping",
  },
};

export default function ShippingPage() {
  const navItems = [
    { label: "Shipping Policy", href: "/shipping", isActive: true },
    { label: "Refund & Cancellation", href: "/refunds", isActive: false },
    { label: "Terms & Conditions", href: "/terms", isActive: false },
    { label: "Privacy Policy", href: "/privacy", isActive: false },
  ];

  return (
    <InfoPageLayout
      title="Shipping & Delivery Policy"
      subtitle="Last updated: 23 Sep 2026"
      breadcrumbLabel="Shipping Policy"
      navItems={navItems}
    >
      <div className="space-y-6 text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            1. Handcrafting & Production Timelines
          </h2>
          <p>
            Because each personalized frame, mug, and keepsake is custom-crafted to order with your personal photos and engravings, manufacturing begins upon your WhatsApp proof approval:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#4A3E40]">
            <li><strong>Digital Proof Design:</strong> Sent within 2–6 hours of order placement.</li>
            <li><strong>Crafting & Curing:</strong> 1–2 business days for printing, frame assembly, laser etching, and quality inspection.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            2. Transit Delivery Times Across India
          </h2>
          <p>
            Once handed over to our premier express logistics partners (Delhivery, Blue Dart, DTDC, XpressBees), typical delivery durations are:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#FAF5F1] rounded-xl border border-[#EDE1D7]">
              <p className="font-semibold text-sm text-[#221C1D]">Metro Cities</p>
              <p className="text-xs text-[#7A6D70] mt-0.5">2 to 4 business days</p>
              <p className="text-[11px] text-[#8F8385]">Bengaluru, Hyderabad, Mumbai, Delhi-NCR, Chennai, Kolkata</p>
            </div>
            <div className="p-3 bg-[#FAF5F1] rounded-xl border border-[#EDE1D7]">
              <p className="font-semibold text-sm text-[#221C1D]">Rest of India</p>
              <p className="text-xs text-[#7A6D70] mt-0.5">4 to 6 business days</p>
              <p className="text-[11px] text-[#8F8385]">Tier 2/3 cities, towns, and district headquarters</p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            3. Shipping Rates
          </h2>
          <p>
            • Orders of <strong>₹999 and above:</strong> 100% FREE Standard Shipping across all serviceable pin codes in India.
          </p>
          <p>
            • Orders <strong>below ₹999:</strong> Flat shipping fee of ₹50 per order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            4. Live Courier Tracking
          </h2>
          <p>
            As soon as your parcel is picked up by the courier, you will receive an automatic WhatsApp message and SMS containing the AWB tracking number and direct tracking link to follow your parcel&apos;s journey until doorstep delivery.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
