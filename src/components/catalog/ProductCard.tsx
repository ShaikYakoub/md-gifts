"use client";

import React from "react";
import { Star, Heart } from "lucide-react";
import { Product } from "@/types/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { openQuickView } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div
      onClick={() => openQuickView(product)}
      className="group relative bg-white rounded-2xl border border-[#EDE2DA] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#DDCBBE] cursor-pointer flex flex-col h-full"
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
      {/* Product Image Area */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#FAF3EE]">
        <ProductImage
          slug={product.slug}
          name={product.name}
          categorySlug={product.categorySlug}
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-2.5 left-2.5 bg-[#FDEBEB] text-[#C85250] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#F8CDCD] shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Button matching screenshot */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? "bg-white text-[#C85250] shadow-sm scale-105"
              : "bg-white/80 hover:bg-white text-[#7A6D70] hover:text-[#C85250] shadow-2xs hover:scale-105"
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-[#C85250] text-[#C85250]" : "stroke-[1.8]"
            }`}
          />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-medium text-sm sm:text-[15px] text-[#221C1D] line-clamp-1 group-hover:text-[#C85250] transition-colors">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#221C1D]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs sm:text-sm text-[#94888A] line-through">
                ₹{product.compareAtPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#7A6E70]">
          <div className="flex items-center text-[#F59E0B]">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-semibold text-[#2B2325]">{product.rating}</span>
          <span className="text-[#9C8F92]">({product.reviewsCount})</span>
        </div>
      </div>
    </div>
  );
}
