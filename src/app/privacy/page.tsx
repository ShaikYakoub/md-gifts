import React from "react";
import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/informational/InfoPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Giftly",
  description: "Learn how Giftly protects your personal photos, contact information, and privacy.",
  alternates: {
    canonical: "https://giftly.in/privacy",
  },
};

export default function PrivacyPage() {
  const navItems = [
    { label: "Privacy Policy", href: "/privacy", isActive: true },
    { label: "Terms & Conditions", href: "/terms", isActive: false },
    { label: "Refund & Cancellation", href: "/refunds", isActive: false },
    { label: "Shipping Policy", href: "/shipping", isActive: false },
  ];

  return (
    <InfoPageLayout
      title="Privacy Policy"
      subtitle="Last updated: 23 Sep 2026"
      breadcrumbLabel="Privacy Policy"
      navItems={navItems}
    >
      <div className="space-y-6 text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            1. Information We Collect
          </h2>
          <p>
            When you place an order on Giftly, we collect only the essential information needed to fulfill your personalized gifts: your full name, mobile phone number, delivery address, and customization notes. We do not require you to create a customer account or store sensitive passwords.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            2. Photo & Image Privacy
          </h2>
          <p>
            Your family, couple, and personal portrait photos are treated with the highest confidentiality. Photos shared with us for printing purposes are accessed solely by the dedicated design artist working on your order. We never sell, rent, or publicly display customer personal photos without prior written permission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            3. Communication & Updates
          </h2>
          <p>
            We use your mobile phone number and optional email address solely to send order updates, design proofs on WhatsApp, and courier tracking details. We do not engage in aggressive spam calls or sell contact lists to third-party telemarketers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            4. Data Retention & Deletion
          </h2>
          <p>
            You can request immediate deletion of your contact records and design files at any time by contacting us at <a href="mailto:support@giftly.in" className="text-[#C85250] underline">support@giftly.in</a>. All design project files are routinely purged 30 days after successful package delivery.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
