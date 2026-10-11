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
    if (primaryCartItem) {
      updateQuantity(primaryCartItem.id, 1);
    } else {
      handleInitialAdd(e);
    }
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#EDE2DA] p-1 pb-2 sm:p-1.5 sm:pb-2.5 shadow-2xs hover:shadow-lg hover:border-[#D9C4B7] transition-all duration-300 cursor-pointer flex flex-col select-none"
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
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* 2. Text Content Area */}
        <div className="pt-1.5 sm:pt-2 px-1 sm:px-1.5">
          <h3 className="font-sans text-xs sm:text-sm font-bold text-[#1E191A] tracking-tight group-hover:text-[#C85250] transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>
      </div>

      {/* 3. Bottom Row: Price & Circular Action Button / Adder-Reducer Pill */}
      <div className="mt-1 sm:mt-1.5 px-1 sm:px-1.5 flex items-center justify-between gap-1.5">
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

        {/* Action: Single '+' button when 0 in cart, or Adder/Reducer (- N +) Pill when in cart */}
        {totalInCart === 0 ? (
          <button
            type="button"
            onClick={handleInitialAdd}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#C85250] to-[#E26D68] text-white flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-90 shadow-2xs hover:opacity-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-4 h-4 stroke-[2.4]" />
          </button>
        ) : (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="inline-flex items-center bg-[#FDF2F0] border border-[#F5C2BC] rounded-full p-0.5 shadow-2xs shrink-0 select-none"
          >
            <button
              type="button"
              onClick={handleDecrease}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[#C85250] hover:bg-[#C85250] hover:text-white transition-all cursor-pointer active:scale-90"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="px-1.5 sm:px-2 text-xs sm:text-sm font-bold text-[#221C1D] min-w-4 sm:min-w-5 text-center leading-none">
              {totalInCart}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[#C85250] hover:bg-[#C85250] hover:text-white transition-all cursor-pointer active:scale-90"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
