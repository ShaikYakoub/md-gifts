import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CATEGORIES, OCCASIONS, RECIPIENTS } from "@/data/categories";
import { ProductImage } from "@/components/ui/ProductImage";

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

        {/* Primary Categories Grid (matching screenshot) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-16">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-2xl border border-[#EDE2DA] overflow-hidden hover:border-[#C85250] transition-all hover:shadow-md flex flex-col text-center p-3 sm:p-4"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FAF3EE] mb-3">
                <ProductImage
                  slug={cat.slug}
                  categorySlug={cat.slug}
                  aspectRatio="square"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="font-semibold text-sm sm:text-base text-[#221C1D] group-hover:text-[#C85250] transition-colors">
                {cat.name}
              </h2>
              <span className="text-xs text-[#8C7D80] mt-0.5">
                ({cat.productCount} products)
              </span>
            </Link>
          ))}
        </div>

        {/* Shop by Occasion Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#EFE4DC]">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
              Shop by Occasion
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
            {OCCASIONS.map((occ) => (
              <Link
                key={occ.slug}
                href={`/categories/${occ.slug}`}
                className="group p-4 bg-white rounded-xl border border-[#EDE2DA] hover:border-[#C85250] hover:bg-[#FAF4F0] transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-sm text-[#221C1D] group-hover:text-[#C85250] transition-colors">
                    {occ.name}
                  </h3>
                  <p className="text-[11px] text-[#7A6D70] mt-1 line-clamp-2">
                    {occ.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-[#C85250] font-medium">
                  <span>Browse gifts</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Shop by Recipient Section */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#EFE4DC]">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
              Shop by Recipient
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
            {RECIPIENTS.map((rec) => (
              <Link
                key={rec.slug}
                href={`/categories/${rec.slug}`}
                className="group p-4 bg-white rounded-xl border border-[#EDE2DA] hover:border-[#C85250] hover:bg-[#FAF4F0] transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-sm text-[#221C1D] group-hover:text-[#C85250] transition-colors">
                    {rec.name}
                  </h3>
                  <p className="text-[11px] text-[#7A6D70] mt-1 line-clamp-2">
                    {rec.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-[#C85250] font-medium">
                  <span>Explore items</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
