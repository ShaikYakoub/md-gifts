"use client";

import React from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { Product } from "@/types/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();

  // Find if this product is in the cart
  const cartItems = items.filter((i) => i.product.id === product.id);
  const totalInCart = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const primaryCartItem = cartItems[0];

  // Compute MRP and Discount
  const mrp =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : Math.round(product.price * 1.25);

  const discountPercent = Math.max(
    5,
    Math.round(((mrp - product.price) / mrp) * 100)
  );

  const handleInitialAdd = (e: React.MouseEvent) => {
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
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (primaryCartItem) {
      updateQuantity(primaryCartItem.id, -1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (totalInCart >= 99) return;
    if (primaryCartItem) {
      updateQuantity(primaryCartItem.id, 1);
    } else {
      handleInitialAdd(e);
    }
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#EDE2DA] p-1.5 pb-2.5 sm:p-2.5 sm:pb-3.5 md:p-3 md:pb-4 shadow-2xs hover:shadow-md hover:border-[#D9C4B7] transition-shadow duration-200 ease-out cursor-pointer flex flex-col select-none"
      aria-label={`View and customize ${product.name}`}
    >
      <div>
        {/* 1. Image Container */}
        <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl bg-[#FAF5F0] overflow-hidden flex items-center justify-center">
          <ProductImage
            slug={product.slug}
            name={product.name}
            categorySlug={product.categorySlug}
            image={product.images?.[0]}
            aspectRatio="square"
            priority={priority}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2. Text Content Area */}
        <div className="pt-2 sm:pt-2.5 md:pt-3 px-1 sm:px-1.5 md:px-2">
          <h3
            className="font-sans text-xs sm:text-sm md:text-base font-bold text-[#1E191A] tracking-tight group-hover:text-[#EC0B12] transition-colors leading-snug truncate w-full"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>
      </div>

      {/* 3. Bottom Row: Price & Circular Action Button / Adder-Reducer Pill */}
      <div className="mt-1.5 sm:mt-2 md:mt-3 px-1 sm:px-1.5 md:px-2 flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1 sm:gap-1.5">
            <span className="text-xs sm:text-base md:text-lg font-bold text-[#1E191A]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] sm:text-xs md:text-sm text-[#8C7D80] line-through font-normal">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
          </div>
          <span className="text-[9px] sm:text-xs md:text-xs font-semibold text-[#1E7238] tracking-tight">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Action: Single '+' button when 0 in cart, or Adder/Reducer (- N +) Pill when in cart */}
        {totalInCart === 0 ? (
          <button
            type="button"
            onClick={handleInitialAdd}
            className="w-7 h-7 sm:w-8.5 sm:h-8.5 md:w-9.5 md:h-9.5 rounded-full btn-lit-red text-white flex items-center justify-center cursor-pointer shrink-0 shadow-2xs"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-4 h-4 md:w-4.5 md:h-4.5 stroke-[2.4]" />
          </button>
        ) : (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-[76px] sm:w-[92px] md:w-[102px] inline-flex items-center justify-between bg-white border border-[#D5C7BC] rounded-full p-0.5 sm:p-1 shrink-0 select-none shadow-2xs"
          >
            <button
              type="button"
              onClick={handleDecrease}
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[#16A34A] hover:bg-[#F0FDF4] active:bg-[#DCFCE7] transition-colors cursor-pointer shrink-0"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[2.5]" />
            </button>
            <span className="w-5.5 sm:w-7 md:w-8 text-center font-bold tabular-nums text-xs sm:text-sm md:text-base text-[#221C1D] inline-flex items-center justify-center shrink-0 leading-none">
              {totalInCart}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              disabled={totalInCart >= 99}
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[#16A34A] hover:bg-[#F0FDF4] active:bg-[#DCFCE7] transition-colors cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
