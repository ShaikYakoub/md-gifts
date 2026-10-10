"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types/catalog";
import { ProductImage } from "@/components/ui/ProductImage";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  // Compute MRP and Discount
  const mrp =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : Math.round(product.price * 1.25);

  const discountPercent = Math.max(
    5,
    Math.round(((mrp - product.price) / mrp) * 100)
  );

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative bg-white rounded-lg border border-[#E8DFD8] p-2.5 sm:p-3 shadow-xs hover:shadow-xl hover:border-[#D5C2B4] transition-all duration-300 cursor-pointer flex flex-col h-full select-none"
      aria-label={`View and customize ${product.name}`}
    >
      {/* 1. Image Container (Item 19: Price tag/badge removed) */}
      <div className="relative w-full aspect-[4/3] rounded-md bg-[#E8DDD2] p-2 sm:p-2.5 overflow-hidden">
        <div className="relative w-full h-full rounded-sm overflow-hidden bg-[#FAF6F0] flex items-center justify-center">
          <ProductImage
            slug={product.slug}
            name={product.name}
            categorySlug={product.categorySlug}
            image={product.images?.[0]}
            aspectRatio="wide"
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* 2. Text Content Area (Items 20, 21: Category/tag line removed; Item 25: Description removed) */}
      <div className="pt-3 px-1 pb-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Full Product Title: Not truncated with "...", no artificial fixed height (Item 24) */}
          <h3 className="font-sans text-sm sm:text-base font-bold text-[#191516] tracking-tight group-hover:text-[#C85250] transition-colors leading-snug">
            {product.name}
          </h3>
        </div>

        {/* 3. Horizontal Divider & Pricing Section (Items 26-29) */}
        <div className="mt-3">
          {/* Horizontal divider kept (Item 26) */}
          <div className="w-full h-px bg-[#ECE2DA] mb-2.5" />

          {/* Pricing order: Marked off price (left) -> Real price -> Discount tag */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs text-[#8C7D80] line-through font-normal">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
            <span className="text-sm sm:text-base font-bold text-[#221C1D]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] font-bold text-[#1E7238] bg-[#EBF7EE] px-1.5 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
