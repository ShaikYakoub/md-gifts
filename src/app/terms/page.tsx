import React from "react";
import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/informational/InfoPageLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions — Giftly",
  description: "Read Giftly's official terms of service, custom ordering guidelines, and user policies.",
  alternates: {
    canonical: "https://giftly.in/terms",
  },
};

export default function TermsPage() {
  const navItems = [
    { label: "Terms & Conditions", href: "/terms", isActive: true },
    { label: "Privacy Policy", href: "/privacy", isActive: false },
    { label: "Refund & Cancellation", href: "/refunds", isActive: false },
    { label: "Shipping Policy", href: "/shipping", isActive: false },
  ];

  return (
    <InfoPageLayout
      title="Terms & Conditions"
      subtitle="Last updated: 23 Sep 2026"
      breadcrumbLabel="Terms & Conditions"
      navItems={navItems}
    >
      <div className="space-y-6 text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            1. Orders & Confirmation
          </h2>
          <p>
            Giftly operates as an artisanal personalized gift creation service. Submitting an order on our website registers your order request. Since every gift is custom-designed, our design team will contact you via WhatsApp or telephone to collect photos, verify details, and share a digital mock before manufacturing begins.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            2. Personalization & Client Approval
          </h2>
          <p>
            Customers are responsible for ensuring that names, dates, quotes, and submitted high-resolution photos are accurate. We provide a complimentary digital preview for your review. Once you approve the final digital proof, physical manufacturing begins and spelling corrections cannot be made without incurring reprinting fees.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            3. Pricing & Taxes
          </h2>
          <p>
            All prices listed on Giftly are displayed in Indian Rupees (₹ INR) and include applicable Goods & Services Tax (GST). Delivery is free on orders above ₹999. For orders below ₹999, a nominal shipping charge of ₹50 applies. We do not charge surprise convenience or packaging fees.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            4. Intellectual Property & Photos
          </h2>
          <p>
            You retain all ownership rights to personal photos and artwork shared with Giftly. We do not use customer personal portrait photos for promotional or marketing materials without your explicit written consent. Photos are permanently deleted from design workstations after order fulfillment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            5. Limitation of Liability
          </h2>
          <p>
            Giftly works tirelessly to meet promised dispatch times. However, we cannot be held liable for third-party courier delays caused by natural weather disruptions, strikes, or regional transit restrictions. In case of transit damage, our liability is strictly limited to providing a free replacement.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
