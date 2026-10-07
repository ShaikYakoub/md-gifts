import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CategoriesClientView } from "@/components/catalog/CategoriesClientView";

export const metadata: Metadata = {
  title: "All Categories — Personalized Gifts & Keepsakes",
  description:
    "Explore our complete collection of personalized gifts, custom photo frames, ceramic mugs, laser-engraved keychains, and luxury hampers.",
  alternates: {
    canonical: "https://giftly.in/categories",
  },
};

export default function CategoriesPage() {
  return (
    <SiteLayout>
      <div className="pt-6 pb-28 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#7A6D70] mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#C85250] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9]" />
          <span className="text-[#221C1D] font-medium">Categories</span>
        </nav>

        {/* Header */}
        <div className="mb-10 text-center max-w-xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#221C1D]">
            All Categories
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#6C5E61]">
            Explore handcrafted keepsakes thoughtfully organized for every taste and celebration.
          </p>
        </div>

        {/* Dynamic Categories, Occasions, and Recipients */}
        <CategoriesClientView />
      </div>
    </SiteLayout>
  );
}
