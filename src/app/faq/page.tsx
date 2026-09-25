"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { InfoPageLayout } from "@/components/informational/InfoPageLayout";

interface FAQItem {
  q: string;
  a: string;
  category: "ordering" | "customization" | "products" | "delivery" | "general";
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "How do I place an order?",
    a: "Select your desired personalized gift, pick your preferred size, frame color, and material, and click 'Add to Cart'. Proceed to checkout, enter your contact & delivery address, and confirm. No online payment is needed at checkout — our design coordinator will connect with you on WhatsApp/Call to verify photos and details!",
    category: "ordering",
  },
  {
    q: "Can I request custom designs and photo previews?",
    a: "Yes, absolutely! Once your order is received, our graphic artists create a digital 3D mockup of your frame or keepsake and send it to you via WhatsApp for approval before we proceed to printing and handcrafting.",
    category: "customization",
  },
  {
    q: "What materials do you use?",
    a: "We use museum-grade fade-resistant archival paper, seasoned natural teak and pine woods, diamond-polished cast acrylic, and high-strength neodymium magnets. All glass frames use shatterproof optical acrylic for 100% safe transit across India.",
    category: "products",
  },
  {
    q: "How long will it take to deliver?",
    a: "Customization and handcrafting take 1–2 business days. Express shipping across metro cities takes 2–4 days, while rest of India takes 4–6 days. You will receive real-time courier tracking details as soon as your package is dispatched.",
    category: "delivery",
  },
  {
    q: "Do you offer bulk orders for weddings, corporate events, or festivals?",
    a: "Yes, we specialize in bulk personalized hampers, employee welcome kits, and wedding return gifts with custom branding. Please reach out to us at support@giftly.in or WhatsApp +91 98765 43210 for special corporate and bulk pricing.",
    category: "ordering",
  },
  {
    q: "Can I make changes after placing an order?",
    a: "Yes! Since we don't start manufacturing until you approve the design proof on WhatsApp, you can change photos, correct text spelling, or modify names during our WhatsApp consultation without any extra charge.",
    category: "customization",
  },
  {
    q: "What if I receive a damaged product?",
    a: "We take extreme care in packaging with multi-layer bubble wrap, edge guards, and wooden crating for delicate items. In the rare event of transit damage, simply share an unboxing photo/video within 48 hours of delivery, and we will dispatch a free replacement immediately without questions asked.",
    category: "delivery",
  },
  {
    q: "How can I contact your support team?",
    a: "You can WhatsApp or call our team at +91 98765 43210 from Monday to Saturday between 10:00 AM and 7:00 PM IST, or email us anytime at support@giftly.in. We typically reply within a few hours!",
    category: "general",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const navItems = [
    { label: "All Questions", href: "#", isActive: activeCategory === "all" },
    { label: "Ordering", href: "#", isActive: activeCategory === "ordering" },
    { label: "Customization", href: "#", isActive: activeCategory === "customization" },
    { label: "Products", href: "#", isActive: activeCategory === "products" },
    { label: "Delivery", href: "#", isActive: activeCategory === "delivery" },
    { label: "General", href: "#", isActive: activeCategory === "general" },
  ];

  const filteredFaqs =
    activeCategory === "all"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((f) => f.category === activeCategory);

  // JSON-LD structured data for FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <InfoPageLayout
      title="Frequently Asked Questions"
      subtitle="Find fast answers to common questions about ordering, customization proofs, materials, and delivery."
      breadcrumbLabel="FAQ"
      navItems={navItems.map((item) => ({
        ...item,
        href: `/faq?cat=${item.label.toLowerCase()}`,
        isActive:
          (item.label === "All Questions" && activeCategory === "all") ||
          item.label.toLowerCase() === activeCategory,
      }))}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Category Pills on mobile */}
      <div className="flex flex-wrap items-center gap-2 mb-6 lg:hidden">
        {["all", "ordering", "customization", "products", "delivery", "general"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              activeCategory === cat
                ? "bg-[#C85250] text-white"
                : "bg-[#FAF5F1] text-[#5C4F51] hover:bg-[#F2E8E2]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion Questions */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className="border border-[#EDE2DA] rounded-xl overflow-hidden transition-colors bg-white hover:border-[#DDCBBE]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 font-semibold text-sm sm:text-base text-[#221C1D]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8C7D80] shrink-0 transition-transform ${
                    isOpen ? "rotate-180 text-[#C85250]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#5C4F51] leading-relaxed border-t border-[#F5EEE8] pt-3 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-[#FAF0EC] rounded-2xl border border-[#F2DDD5] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-sm sm:text-base text-[#221C1D]">
            Have a custom design inquiry?
          </h3>
          <p className="text-xs text-[#7A6D70] mt-0.5">
            We love bringing unusual, unique ideas to life. Let&apos;s talk on WhatsApp!
          </p>
        </div>
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-[#C85250] hover:bg-[#B14140] text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
        >
          Message on WhatsApp
        </a>
      </div>
    </InfoPageLayout>
  );
}
