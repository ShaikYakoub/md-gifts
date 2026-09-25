"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Sparkles } from "lucide-react";

export function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "GF-789123";

  return (
    <div className="pt-8 pb-28 sm:py-20 max-w-xl mx-auto px-4 text-center">
      {/* Gift Box with Check Artwork (matching screenshot) */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-6 flex items-center justify-center">
        {/* Soft background aura */}
        <div className="absolute inset-0 bg-[#FCEEEA] rounded-full blur-xl opacity-70" />

        <svg viewBox="0 0 200 200" className="w-full h-full relative z-10" fill="none">
          {/* Confetti & Sparkles */}
          <circle cx="45" cy="45" r="4" fill="#F59E0B" />
          <circle cx="155" cy="40" r="3.5" fill="#C85250" />
          <circle cx="30" cy="120" r="3" fill="#E88B88" />
          <circle cx="170" cy="115" r="4" fill="#F59E0B" />
          <path d="M50 30 L55 35 M150 25 L145 30" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

          {/* Isometric Gift Box Body */}
          <g className="filter drop-shadow-lg">
            <rect x="50" y="85" width="100" height="80" rx="8" fill="#FAD2E1" stroke="#F4ACB7" strokeWidth="2.5" />
            <rect x="42" y="68" width="116" height="24" rx="6" fill="#F7CAD0" stroke="#F4ACB7" strokeWidth="2.5" />
            {/* Terracotta Satin Ribbon */}
            <rect x="92" y="68" width="16" height="97" fill="#C85250" />
            <rect x="50" y="115" width="100" height="16" fill="#C85250" />
            {/* Big Bow on Top */}
            <path d="M100 68 C80 35 55 45 88 65 Z" fill="#B74341" />
            <path d="M100 68 C120 35 145 45 112 65 Z" fill="#B74341" />
            <circle cx="100" cy="67" r="7" fill="#E06462" />
          </g>

          {/* Floating Checkmark Badge */}
          <g className="filter drop-shadow-md">
            <circle cx="100" cy="42" r="18" fill="#C85250" />
            <path
              d="M93 42 L98 47 L108 37"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {/* Main Order Confirmation Header */}
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#221C1D] mb-2">
        Order Placed Successfully!
      </h1>

      <div className="inline-block bg-[#FAF0EC] text-[#C85250] font-mono text-sm sm:text-base font-bold px-4 py-1.5 rounded-full border border-[#F2DDD5] mb-4">
        Order #{orderId}
      </div>

      <p className="text-sm sm:text-base text-[#6C5E61] max-w-md mx-auto leading-relaxed mb-8">
        We have received your order and will contact you shortly to confirm the customization details.
      </p>

      {/* Next Steps Box */}
      <div className="bg-white rounded-2xl border border-[#EDE2DA] p-6 text-left shadow-2xs mb-8 space-y-4">
        <h2 className="font-semibold text-sm text-[#221C1D] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C85250]" />
          <span>What happens next?</span>
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-[#5C4F51]">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FAF0EC] text-[#C85250] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium text-[#221C1D]">Design Consultation via WhatsApp</p>
              <p className="text-xs text-[#7A6D70] mt-0.5">
                Our designer will reach out on your phone number to collect your high-res photos and share a 3D digital preview for approval.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FAF0EC] text-[#C85250] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium text-[#221C1D]">Handcrafting & Laser Precision</p>
              <p className="text-xs text-[#7A6D70] mt-0.5">
                Once you approve the digital mock, our workshop crafts your personalized keepsake using premium archival materials.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FAF0EC] text-[#C85250] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-medium text-[#221C1D]">Safe Bubble-Wrap Dispatch</p>
              <p className="text-xs text-[#7A6D70] mt-0.5">
                Carefully packaged in tamper-evident cushioning and dispatched via express courier with live tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#F0E6DE] flex flex-wrap items-center justify-between text-xs text-[#7A6D70] gap-2">
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Support: +91 98765 43210</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C85250]" />
            <span>Mon – Sat, 10 AM – 7 PM</span>
          </span>
        </div>
      </div>

      {/* CTAs matching screenshot */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/order/track?id=${encodeURIComponent(orderId)}`}
          className="w-full sm:w-auto inline-flex items-center justify-center bg-[#C85250] hover:bg-[#B14140] text-white px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-transform active:scale-95 shadow-md shadow-[#C85250]/20"
        >
          View Order
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-[#FAF4F0] text-[#5C4F51] hover:text-[#221C1D] border border-[#EDE0D6] px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
