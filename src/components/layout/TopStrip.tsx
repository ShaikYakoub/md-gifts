import React from "react";
import { Truck, Gift, ShieldCheck } from "lucide-react";

export function TopStrip() {
  return (
    <div className="bg-[#FAF0E8] border-b border-[#F0E2D8] text-[#5C4F51] text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-3 sm:gap-10 overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-1.5 font-medium shrink-0">
          <Truck className="w-3.5 h-3.5 text-[#C85250] shrink-0" />
          <span>Free delivery above ₹999</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium shrink-0">
          <Gift className="w-3.5 h-3.5 text-[#C85250] shrink-0" />
          <span>Easy customization</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C85250] shrink-0" />
          <span>Secure payments</span>
        </div>
      </div>
    </div>
  );
}
