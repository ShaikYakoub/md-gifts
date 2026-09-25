import React from "react";
import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/informational/InfoPageLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Giftly",
  description: "Read Giftly's policies regarding order cancellations, transit damage, and free replacements.",
  alternates: {
    canonical: "https://giftly.in/refunds",
  },
};

export default function RefundsPage() {
  const navItems = [
    { label: "Refund & Cancellation", href: "/refunds", isActive: true },
    { label: "Shipping Policy", href: "/shipping", isActive: false },
    { label: "Terms & Conditions", href: "/terms", isActive: false },
    { label: "Privacy Policy", href: "/privacy", isActive: false },
  ];

  return (
    <InfoPageLayout
      title="Refund & Cancellation Policy"
      subtitle="Last updated: 23 Sep 2026"
      breadcrumbLabel="Refund Policy"
      navItems={navItems}
    >
      <div className="space-y-6 text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            1. Cancellation Before Production
          </h2>
          <p>
            Because personalized gifts are made specifically for you with custom photos and engraved text, orders can be cancelled free of charge at any point <strong>before</strong> you approve the digital mock on WhatsApp. Once you have reviewed and approved the design preview and manufacturing has started, the order enters active production and cannot be cancelled.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            2. Transit Damage & Free Replacement Guarantee
          </h2>
          <p>
            We take extreme precautions with high-density foam wrapping, corner protectors, and corrugated outer packaging. However, if your package arrives with broken glass, cracked acrylic, or physical damage incurred during transit, we provide a <strong>100% Free Replacement</strong>.
          </p>
          <p>
            To claim a replacement:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#4A3E40]">
            <li>Take an unboxing photo or short 10-second video clearly showing the outer parcel label and the damaged item.</li>
            <li>Send the photos/video to our support WhatsApp (+91 98765 43210) within 48 hours of delivery.</li>
            <li>Our team will verify the claim and immediately dispatch an expedited replacement order with priority tracking.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            3. Defect or Manufacturing Error
          </h2>
          <p>
            In the event that our workshop made an error contrary to your approved proof (such as misspelled approved names or wrong variant dimensions), we will remanufacture and dispatch the corrected item promptly at zero cost to you.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
