import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-3xl bg-[#FEF2F2] text-[#EC0B12] flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 stroke-[1.7]" />
        </div>
        <span className="text-xs font-bold text-[#EC0B12] tracking-widest uppercase">
          404 Error
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#221C1D] tracking-tight mt-2 mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-[#7A6D70] mb-8 leading-relaxed">
          The gift page or collection you are looking for may have been moved or is no longer available.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#EC0B12] hover:bg-[#D0080E] text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-white border border-[#DDCFC6] hover:bg-[#E6F7F9] hover:border-[#0194A3] text-[#221C1D] rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 group"
          >
            <span>Browse All Gifts</span>
            <ArrowRight className="w-4 h-4 text-[#0194A3] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
