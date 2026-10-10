"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Plus, Check } from "lucide-react";
import { Product } from "@/types/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  // Compute MRP and Discount
  const mrp =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : Math.round(product.price * 1.25);

  const discountPercent = Math.max(
    5,
    Math.round(((mrp - product.price) / mrp) * 100)
  );

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product,
      selectedSize: product.sizes[0] || '8" × 10"',
      selectedFrameColor: product.frameColors[0]?.name || "Black",
      selectedMaterial: product.materials[0] || "Wood",
      price: product.price,
      quantity: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#EDE2DA] p-2.5 sm:p-3 shadow-2xs hover:shadow-lg hover:border-[#D9C4B7] transition-all duration-300 cursor-pointer flex flex-col justify-between h-full select-none"
      aria-label={`View and customize ${product.name}`}
    >
      <div>
        {/* 1. Image Container with Floating Wishlist Heart */}
        <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl bg-[#FAF5F0] overflow-hidden flex items-center justify-center">
          <ProductImage
            slug={product.slug}
            name={product.name}
            categorySlug={product.categorySlug}
            image={product.images?.[0]}
            aspectRatio="square"
            priority={priority}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Floating Wishlist Heart Button (App-Style) */}
          <button
            type="button"
            onClick={toggleWishlist}
            className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-85 ${
              isWishlisted
                ? "bg-[#C85250] text-white shadow-xs"
                : "bg-white/80 hover:bg-white text-[#6C5E61] hover:text-[#C85250] shadow-2xs"
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isWishlisted ? "fill-white stroke-white" : "stroke-[2]"
              }`}
            />
          </button>
        </div>

        {/* 2. Text Content Area */}
        <div className="pt-2.5 px-0.5">
          <h3 className="font-sans text-xs sm:text-sm font-bold text-[#1E191A] tracking-tight group-hover:text-[#C85250] transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-[#8A7B7E] font-medium mt-0.5 capitalize">
            {product.categorySlug?.replace(/-/g, " ") || "Personalized Gift"}
          </p>
        </div>
      </div>

      {/* 3. Bottom Row: Price & Circular Action Button (No line divider, matching mockup) */}
      <div className="mt-2.5 flex items-center justify-between gap-1.5">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-sm font-bold text-[#1E191A]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-[#8C7D80] line-through font-normal">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-semibold text-[#1E7238] tracking-tight">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Circular Accent '+' Button (Mockup App-Style) */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-90 shadow-2xs ${
            justAdded
              ? "bg-[#25D366] text-white"
              : "bg-gradient-to-tr from-[#C85250] to-[#E26D68] text-white hover:opacity-95"
          }`}
          aria-label={`Quick add ${product.name} to cart`}
        >
          {justAdded ? (
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          ) : (
            <Plus className="w-4 h-4 stroke-[2.4]" />
          )}
        </button>
      </div>
    </Link>
  );
}
