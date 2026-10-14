import React from "react";
import type { Metadata } from "next";
import { ShieldCheck, Truck, RefreshCw, FileText, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: `Policies, Terms & Shipping — ${SITE_CONFIG.name}`,
  description: `Complete official terms of service, privacy policy, India-wide shipping guidelines, and 100% free replacement guarantee for ${SITE_CONFIG.fullName}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/policies`,
  },
};

export default function PoliciesPage() {
  return (
    <SiteLayout>
      <div className="pt-6 pb-28 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="pb-6 border-b border-[#EFE4DC] mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#221C1D] tracking-tight">
            Terms & Policies
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6D70] mt-2 max-w-2xl leading-relaxed">
            Everything you need to know about ordering handcrafted personalized gifts, our privacy guarantees, India-wide delivery timelines, and replacement policies for {SITE_CONFIG.fullName}.
          </p>

          {/* Quick Jump Anchors */}
          <div className="flex flex-wrap gap-2 pt-4">
            <a
              href="#terms"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF4F0] hover:bg-[#FEF2F2] hover:text-[#EC0B12] text-[#221C1D] text-xs font-medium rounded-lg border border-[#EDE0D6] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#EC0B12]" />
              <span>Terms of Service</span>
            </a>
            <a
              href="#privacy"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF4F0] hover:bg-[#E6F7F9] hover:text-[#0194A3] text-[#221C1D] text-xs font-medium rounded-lg border border-[#EDE0D6] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0194A3]" />
              <span>Privacy Policy</span>
            </a>
            <a
              href="#shipping"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF4F0] hover:bg-[#FEF2F2] hover:text-[#EC0B12] text-[#221C1D] text-xs font-medium rounded-lg border border-[#EDE0D6] transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-[#EC0B12]" />
              <span>Shipping & Delivery</span>
            </a>
            <a
              href="#refunds"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF4F0] hover:bg-[#E6F7F9] hover:text-[#0194A3] text-[#221C1D] text-xs font-medium rounded-lg border border-[#EDE0D6] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#0194A3]" />
              <span>Refunds & Replacements</span>
            </a>
          </div>
        </div>

        {/* Unified Content Sections */}
        <div className="space-y-12">
          {/* Section 1: Terms of Service */}
          <section id="terms" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-2xl border border-[#EDE2DA] shadow-2xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0E6DE]">
              <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#EC0B12]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
                  Terms & Conditions
                </h2>
                <p className="text-xs text-[#8C7D80]">Official order & service guidelines</p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">1. Orders & WhatsApp Confirmation</h3>
                <p>
                  {SITE_CONFIG.name} operates as an artisanal personalized gift creation studio based at {SITE_CONFIG.address.formatted}. Placing an order sends your gift preferences to our workshop. Since every gift is custom-designed, our design team connects with you on WhatsApp ({SITE_CONFIG.phoneDisplay}) to collect your high-resolution photos and share a digital design preview before physical production begins.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">2. Personalization & Client Proof Approval</h3>
                <p>
                  Customers are responsible for ensuring that names, dates, quotes, and submitted photos are accurate. We provide a complimentary digital preview for your review on WhatsApp. Once you approve the final digital proof, physical manufacturing begins and text changes cannot be made without incurring reprinting costs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">3. Transparent Pricing & Taxes</h3>
                <p>
                  All prices listed on {SITE_CONFIG.name} are in Indian Rupees (₹ INR) and include all applicable taxes. Standard shipping is completely FREE on orders of ₹999 and above. For orders below ₹999, a nominal flat delivery charge of ₹50 applies. We never charge hidden handling or packing fees.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">4. Photo Ownership & Intellectual Property</h3>
                <p>
                  You retain complete copyright and ownership of all photographs and personal content submitted for customization. Photos submitted are utilized solely for printing your specific order and are permanently deleted after delivery verification.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Privacy Policy */}
          <section id="privacy" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-2xl border border-[#EDE2DA] shadow-2xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0E6DE]">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7F9] flex items-center justify-center text-[#0194A3]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
                  Privacy Policy
                </h2>
                <p className="text-xs text-[#8C7D80]">How we protect your photos and personal data</p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">1. Information We Collect</h3>
                <p>
                  When placing an inquiry or order with {SITE_CONFIG.name}, we collect only necessary fulfillment details: your full name, delivery address, phone number (WhatsApp), email address, and uploaded media files required for physical manufacturing.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">2. Strict Confidentiality of Personal Photos</h3>
                <p>
                  Your private family photos, couple portraits, and baby pictures are never shared, sold, or displayed publicly without your explicit written consent. Photos transmitted over WhatsApp/Email are stored securely and purged after order fulfillment.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">3. Contact for Privacy Inquiries</h3>
                <p>
                  For any privacy concerns or request to delete your customer records, contact our data coordinator at <a href={`mailto:${SITE_CONFIG.email}`} className="text-[#0194A3] font-medium hover:underline">{SITE_CONFIG.email}</a> or phone <a href={`tel:${SITE_CONFIG.phone}`} className="text-[#EC0B12] font-medium hover:underline">{SITE_CONFIG.phoneDisplay}</a>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Shipping & Delivery Policy */}
          <section id="shipping" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-2xl border border-[#EDE2DA] shadow-2xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0E6DE]">
              <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#EC0B12]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
                  Shipping & Delivery Guidelines
                </h2>
                <p className="text-xs text-[#8C7D80]">Dispatched directly from Kadapa across India</p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">1. Production & Dispatch Timeline</h3>
                <p>
                  Custom personalized gifts require precision printing and framing. Production takes 1–2 business days following your digital proof approval. Orders are packaged in shockproof bubble wrap and dispatched from our workshop in Kadapa (PIN 516001).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">2. Delivery Time Estimates</h3>
                <p>
                  • <strong>Andhra Pradesh, Telangana & South India:</strong> 1–3 business days.<br />
                  • <strong>Rest of India / Metro Cities:</strong> 3–5 business days.<br />
                  • <strong>Remote & Regional Areas:</strong> 5–7 business days.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">3. Delivery Charges</h3>
                <p>
                  • <strong>Orders ₹999 & above:</strong> 100% FREE Delivery nationwide.<br />
                  • <strong>Orders below ₹999:</strong> Flat delivery charge of ₹50.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">4. Express Courier Partners</h3>
                <p>
                  We dispatch with leading express courier networks including Delhivery, Blue Dart, DTDC, and XpressBees. Live tracking links are sent to your WhatsApp number as soon as the package leaves our workshop.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Refund & Replacement Policy */}
          <section id="refunds" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-2xl border border-[#EDE2DA] shadow-2xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0E6DE]">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7F9] flex items-center justify-center text-[#0194A3]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
                  Refund & Cancellation Policy
                </h2>
                <p className="text-xs text-[#8C7D80]">100% free replacement guarantee for transit damage</p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">1. Cancellation Before Production</h3>
                <p>
                  Personalized gifts are custom-crafted specifically for you. Orders may be cancelled completely free of charge at any point <strong>before</strong> you approve the WhatsApp digital proof. Once approved, the item enters physical manufacturing and cannot be cancelled.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">2. 100% Free Replacement Guarantee</h3>
                <p>
                  We package our frames and gifts in multi-layer shockproof bubble wrap and corner guards. However, if your order arrives damaged, broken, or defective, {SITE_CONFIG.name} provides an immediate <strong>100% Free Replacement</strong>:
                </p>
                <ul className="list-disc pl-5 mt-1.5 space-y-1 text-[#4A3E40]">
                  <li>Take a short 10-second unboxing video or clear photos showing the parcel label and the damaged product.</li>
                  <li>WhatsApp the photos to our team at <strong>{SITE_CONFIG.phoneDisplay}</strong> within 48 hours of delivery.</li>
                  <li>We immediately re-craft and dispatch a brand new replacement with priority express shipping.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">3. Workshop Error Correction</h3>
                <p>
                  If our workshop makes an error contrary to your approved proof (e.g. spelling discrepancy or incorrect frame size), {SITE_CONFIG.name} remanufactures and dispatches the corrected gift at zero cost to you.
                </p>
              </div>
            </div>
          </section>

          {/* Need Assistance Bar */}
          <div className="bg-[#FAF4F0] p-6 rounded-2xl border border-[#EDE2DA] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif text-base font-bold text-[#221C1D]">Have any questions about our policies?</h3>
              <p className="text-xs text-[#6C5E61]">Our team is available on WhatsApp Mon–Sat (9:30 AM – 8:30 PM IST) at {SITE_CONFIG.phoneDisplay}.</p>
              <p className="text-xs text-[#7A6D70]">{SITE_CONFIG.address.formatted}</p>
            </div>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0194A3] hover:bg-[#017C8A] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Support</span>
            </a>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
