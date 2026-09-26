import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, RefreshCw, FileText, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "Policies, Terms & Shipping — Giftly",
  description: "Complete official terms of service, privacy policy, India-wide shipping guidelines, and 100% free replacement guarantee for Giftly personalized gifts.",
  alternates: {
    canonical: "https://giftly.in/policies",
  },
};

export default function PoliciesPage() {
  return (
    <SiteLayout>
      <div className="pt-6 pb-28 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#7A6D70] mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#C85250] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9]" />
          <span className="text-[#221C1D] font-medium">Terms & Policies</span>
        </nav>

        {/* Page Header */}
        <div className="pb-6 border-b border-[#EFE4DC] mb-8">
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#221C1D]">
            Terms & Policies
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6D70] mt-2 max-w-2xl leading-relaxed">
            Everything you need to know about ordering handcrafted personalized gifts, our privacy guarantees, India-wide delivery timelines, and replacement policies in one place.
          </p>

          {/* Quick Jump Anchors */}
          <div className="flex flex-wrap gap-2 pt-4">
            <a
              href="#terms"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF4F0] hover:bg-[#F2E5DC] text-[#221C1D] text-xs font-medium rounded-lg border border-[#EDE0D6] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#C85250]" />
              <span>Terms of Service</span>
            </a>
            <a
              href="#privacy"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF4F0] hover:bg-[#F2E5DC] text-[#221C1D] text-xs font-medium rounded-lg border border-[#EDE0D6] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C85250]" />
              <span>Privacy Policy</span>
            </a>
            <a
              href="#shipping"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF4F0] hover:bg-[#F2E5DC] text-[#221C1D] text-xs font-medium rounded-lg border border-[#EDE0D6] transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-[#C85250]" />
              <span>Shipping & Delivery</span>
            </a>
            <a
              href="#refunds"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF4F0] hover:bg-[#F2E5DC] text-[#221C1D] text-xs font-medium rounded-lg border border-[#EDE0D6] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C85250]" />
              <span>Refunds & Replacements</span>
            </a>
          </div>
        </div>

        {/* Unified Content Sections */}
        <div className="space-y-12">
          {/* Section 1: Terms of Service */}
          <section id="terms" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-2xl border border-[#EDE2DA] shadow-2xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0E6DE]">
              <div className="w-9 h-9 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#C85250]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
                  Terms & Conditions
                </h2>
                <p className="text-xs text-[#8C7D80]">Official order & service guidelines</p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">1. Orders & WhatsApp Confirmation</h3>
                <p>
                  Giftly operates as an artisanal personalized gift creation studio. Placing an order sends your gift details to our workshop. Since every gift is custom-designed, our design team connects with you on WhatsApp to collect your high-resolution photos and share a digital design preview before handcrafting begins.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">2. Personalization & Client Proof Approval</h3>
                <p>
                  Customers are responsible for ensuring that names, dates, quotes, and submitted photos are accurate. We provide a complimentary digital preview for your review. Once you approve the final digital proof on WhatsApp, physical manufacturing begins and text changes cannot be made without incurring reprinting costs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">3. Transparent Pricing & Taxes</h3>
                <p>
                  All prices listed on Giftly are in Indian Rupees (₹ INR) and include all applicable taxes. Standard shipping is completely FREE on orders of ₹999 and above. For orders below ₹999, a nominal flat delivery charge of ₹50 applies. We never charge hidden handling or packing fees.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">4. Photo Ownership & Intellectual Property</h3>
                <p>
                  You retain all ownership rights to personal photos and artwork shared with Giftly. We do not use customer personal portrait photos for promotional or marketing materials without your explicit written permission. Photos are purged from our design workstations after order fulfillment.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">5. Limitation of Liability</h3>
                <p>
                  Giftly works diligently to meet promised dispatch times. However, we cannot be held liable for third-party courier delays caused by extreme weather, regional transit restrictions, or public holidays. In the rare event of transit damage, our liability is strictly fulfilled by dispatching a 100% free replacement.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Privacy Policy */}
          <section id="privacy" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-2xl border border-[#EDE2DA] shadow-2xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0E6DE]">
              <div className="w-9 h-9 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#C85250]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
                  Privacy Policy
                </h2>
                <p className="text-xs text-[#8C7D80]">Confidentiality & image protection guarantee</p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">1. Information We Collect</h3>
                <p>
                  When you place an order on Giftly, we collect only the essential details needed for delivery and personalization: your full name, delivery address, and landmark. We do not require account creation, password storage, or invasive data tracking.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">2. Photo & Image Privacy Guarantee</h3>
                <p>
                  Your couple, wedding, and family photos are treated with strict confidentiality. Photos sent for printing are accessed exclusively by the designer working on your layout. We never sell, rent, or publicly display customer photos.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">3. Direct WhatsApp Communication</h3>
                <p>
                  Communication regarding your order proofs and shipping updates happens directly via WhatsApp. We do not make unsolicited telemarketing calls or share your phone number with external advertising networks.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">4. Data Retention & Immediate Deletion Requests</h3>
                <p>
                  You can request deletion of your order records and photo files at any time by contacting our support. Project files are routinely cleared from workstations 30 days after package delivery.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Shipping & Delivery Policy */}
          <section id="shipping" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-2xl border border-[#EDE2DA] shadow-2xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0E6DE]">
              <div className="w-9 h-9 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#C85250]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
                  Shipping & Delivery Policy
                </h2>
                <p className="text-xs text-[#8C7D80]">Timelines, courier partners & rates across India</p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">1. Handcrafting & Production Timelines</h3>
                <p>
                  Because every item is custom-crafted with your personal details, physical production starts once you approve the digital design proof:
                </p>
                <ul className="list-disc pl-5 mt-1.5 space-y-1 text-[#4A3E40]">
                  <li><strong>Digital Proof Preview:</strong> Sent on WhatsApp within 2–6 hours of order submission.</li>
                  <li><strong>Crafting & Assembly:</strong> 1–2 business days for printing, framing, laser etching, and careful packaging.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">2. Delivery Timelines Across India</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 bg-[#FAF5F1] rounded-xl border border-[#EDE1D7]">
                    <p className="font-semibold text-sm text-[#221C1D]">Metro Cities (2–4 Days)</p>
                    <p className="text-xs text-[#7A6D70] mt-0.5">Bengaluru, Hyderabad, Mumbai, Delhi-NCR, Chennai, Kolkata</p>
                  </div>
                  <div className="p-3.5 bg-[#FAF5F1] rounded-xl border border-[#EDE1D7]">
                    <p className="font-semibold text-sm text-[#221C1D]">Rest of India (4–6 Days)</p>
                    <p className="text-xs text-[#7A6D70] mt-0.5">Tier 2/3 cities, district headquarters, and towns</p>
                  </div>
                </div>
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
                  We dispatch with leading express courier networks including Delhivery, Blue Dart, DTDC, and XpressBees. Courier dispatch details and live tracking updates are shared with you on WhatsApp once dispatched.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Refund & Replacement Policy */}
          <section id="refunds" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-2xl border border-[#EDE2DA] shadow-2xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0E6DE]">
              <div className="w-9 h-9 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#C85250]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
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
                  We package our frames and gifts in multi-layer shockproof bubble wrap and corner guards. However, if your order arrives damaged, broken, or defective, we provide an immediate <strong>100% Free Replacement</strong>:
                </p>
                <ul className="list-disc pl-5 mt-1.5 space-y-1 text-[#4A3E40]">
                  <li>Take a short 10-second unboxing video or clear photos showing the parcel label and the damaged product.</li>
                  <li>WhatsApp the photos to our team at <strong>+91 98765 43210</strong> within 48 hours of delivery.</li>
                  <li>We immediately re-craft and dispatch a brand new replacement with priority express shipping.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#221C1D] mb-1">3. Workshop Error Correction</h3>
                <p>
                  If our workshop makes an error contrary to your approved proof (e.g. spelling discrepancy or incorrect frame size), we remanufacture and dispatch the corrected gift at zero cost to you.
                </p>
              </div>
            </div>
          </section>

          {/* Need Assistance Bar */}
          <div className="bg-[#FAF4F0] p-6 rounded-2xl border border-[#EDE2DA] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-base font-bold text-[#221C1D]">Have any questions about our policies?</h3>
              <p className="text-xs text-[#6C5E61] mt-0.5">Our design coordinators are available on WhatsApp Mon–Sat (10 AM – 7 PM IST).</p>
            </div>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#128C7E] hover:bg-[#075E54] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 shadow-xs"
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
