"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Product } from "@/types/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { openQuickView } = useCart();

  // Default color swatches or fallback to product frame colors
  const colorSwatches =
    product.frameColors && product.frameColors.length > 0
      ? product.frameColors.slice(0, 3)
      : [
          { name: "Natural Oak", hex: "#C8A27A" },
          { name: "Walnut", hex: "#5C3826" },
          { name: "Matte Black", hex: "#1C1B1A" },
        ];

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  // Formatted category eyebrow
  const eyebrowText = `${product.categorySlug.replace(/-/g, " ")} · ${
    product.occasionSlugs?.[0]?.replace(/-/g, " ") || "gift"
  }`.toUpperCase();

  return (
    <div
      onClick={() => openQuickView(product)}
      className="group relative bg-white rounded-lg border border-[#E8DFD8] p-2.5 sm:p-3 shadow-xs hover:shadow-xl hover:border-[#D5C2B4] transition-all duration-300 cursor-pointer flex flex-col h-full select-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openQuickView(product);
        }
      }}
      aria-label={`View and customize ${product.name}`}
    >
      {/* 1. Image Container with cream border matching screenshot */}
      <div className="relative w-full aspect-[4/3] rounded-md bg-[#E8DDD2] p-2 sm:p-2.5 overflow-hidden">
        <div className="relative w-full h-full rounded-sm overflow-hidden bg-[#FAF6F0] flex items-center justify-center">
          <ProductImage
            slug={product.slug}
            name={product.name}
            categorySlug={product.categorySlug}
            aspectRatio="wide"
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-105"
          />

          {/* Floating Top-Left Price Badge */}
          <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10 bg-white text-[#1C1819] font-medium text-xs sm:text-sm px-3 sm:px-3.5 py-1 rounded-md shadow-xs">
            ₹{product.price.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* 2. Text Content Area */}
      <div className="pt-3.5 sm:pt-4 px-2 sm:px-2.5 pb-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Eyebrow: Category · Occasion */}
          <span className="block text-[11px] sm:text-xs font-medium tracking-[0.16em] text-[#82756E] uppercase truncate">
            {eyebrowText}
          </span>

          {/* Product Title */}
          <h3 className="mt-1.5 font-sans text-lg sm:text-xl font-bold text-[#191516] tracking-tight line-clamp-1 group-hover:text-[#C85250] transition-colors">
            {product.name}
          </h3>

          {/* Subtitle / Short Description */}
          <p className="mt-1 text-xs sm:text-sm text-[#665B57] leading-relaxed line-clamp-2 min-h-[2.6em]">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* 3. Bottom Divider & Footer Swatches / Action */}
        <div className="mt-3.5 sm:mt-4">
          <div className="w-full h-px bg-[#ECE2DA] mb-3" />

          <div className="flex items-center justify-between gap-2">
            {/* Color Swatches and Active Name */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                {colorSwatches.map((color, idx) => {
                  const isSelected = idx === selectedColorIndex;
                  return (
                    <button
                      key={color.name + idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColorIndex(idx);
                      }}
                      title={color.name}
                      aria-label={`Select ${color.name}`}
                      className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-transform ${
                        isSelected
                          ? "ring-2 ring-[#191516] ring-offset-2 scale-105"
                          : "hover:scale-105 border border-black/10"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  );
                })}
              </div>

              {/* Active Color Name */}
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.14em] text-[#7A6D66] uppercase truncate ml-0.5">
                {colorSwatches[selectedColorIndex]?.name}
              </span>
            </div>

            {/* Circular Dark Action Button */}
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1C1819] group-hover:bg-[#C85250] transition-colors duration-300 shrink-0 flex items-center justify-center text-white shadow-xs"
              aria-hidden="true"
            >
              <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
