"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  Plus,
  Minus,
  Check,
  Share2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Product } from "@/types/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/catalog/ProductCard";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '8" × 10"');
  const [selectedColor, setSelectedColor] = useState<string>(product.frameColors[0]?.name || "Black");
  const [selectedMaterial, setSelectedMaterial] = useState<string>(product.materials[0] || "Wood");
  const [customizationText, setCustomizationText] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeThumbnail, setActiveThumbnail] = useState<number>(0);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Derive dynamic price based on size variant if available
  const variant = product.variants?.find((v) => v.size === selectedSize);
  const currentPrice = variant ? variant.price : product.price;
  const currentCompareAtPrice = variant ? variant.compareAtPrice : product.compareAtPrice;

  const discountPercent =
    currentCompareAtPrice && currentCompareAtPrice > currentPrice
      ? Math.round(((currentCompareAtPrice - currentPrice) / currentCompareAtPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addItem({
      product,
      selectedSize,
      selectedFrameColor: selectedColor,
      selectedMaterial,
      customizationText: customizationText.trim() || undefined,
      price: currentPrice,
      quantity,
    });
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 3000);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  return (
    <div className="pt-4 pb-28 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb matching screenshot */}
      <nav className="flex items-center gap-1.5 text-xs text-[#7A6D70] mb-6 overflow-x-auto no-scrollbar whitespace-nowrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#C85250] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9] shrink-0" />
        <Link href={`/categories/${product.categorySlug}`} className="capitalize hover:text-[#C85250] transition-colors">
          {product.categorySlug.replace(/-/g, " ")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9] shrink-0" />
        <span className="text-[#221C1D] font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails Strip */}
          <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible shrink-0 pb-1 sm:pb-0">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveThumbnail(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  activeThumbnail === idx
                    ? "border-[#C85250] ring-2 ring-[#C85250]/20 shadow-xs"
                    : "border-[#EDE2DA] opacity-75 hover:opacity-100 hover:border-[#DDCBBE]"
                }`}
                aria-label={`View angle ${idx + 1}`}
              >
                <ProductImage
                  slug={product.slug}
                  name={product.name}
                  categorySlug={product.categorySlug}
                  aspectRatio="square"
                />
              </button>
            ))}
          </div>

          {/* Large Main Photo */}
          <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-[#FAF3EE] border border-[#EDE2DA] shadow-sm">
            <ProductImage
              slug={product.slug}
              name={product.name}
              categorySlug={product.categorySlug}
              priority
              aspectRatio="square"
            />

            {discountPercent && (
              <span className="absolute top-4 left-4 bg-[#FDEBEB] text-[#C85250] text-xs font-bold px-3 py-1 rounded-full border border-[#F8CDCD] shadow-xs">
                {discountPercent}% OFF
              </span>
            )}

            {/* Mobile quick actions overlay */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share product"
                className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#5C4F51] hover:text-[#C85250] shadow-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Customization & Purchase Options */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE2DA] shadow-xs space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 text-xs text-[#7A6E70]">
              <div className="flex items-center text-[#F59E0B]">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-[#2B2325]">{product.rating}</span>
              <span className="text-[#9C8F92]">({product.reviewsCount} verified reviews)</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] mt-2">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#6C5E61] mt-2 leading-relaxed">
              {product.description}
            </p>

            {/* Price Tag matching screenshot */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#C85250]">
                ₹{currentPrice.toLocaleString("en-IN")}
              </span>
              {currentCompareAtPrice && currentCompareAtPrice > currentPrice && (
                <span className="text-base text-[#9C8F92] line-through font-normal">
                  ₹{currentCompareAtPrice.toLocaleString("en-IN")}
                </span>
              )}
              {discountPercent && (
                <span className="text-xs font-bold text-[#C85250] bg-[#FDEBEB] px-2.5 py-0.5 rounded-md border border-[#F8CDCD]">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-[#F0E6DE] pt-4 space-y-5">
            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#3C3234] mb-2">
                  <span>Size</span>
                  <span className="text-[#8F8385] font-normal">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        selectedSize === size
                          ? "bg-[#FDF2F0] text-[#C85250] border-2 border-[#C85250] shadow-xs font-semibold"
                          : "bg-white text-[#4A3E40] border border-[#E0D5CC] hover:border-[#C85250]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Frame Color Swatches */}
            {product.frameColors && product.frameColors.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#3C3234] mb-2">
                  <span>Frame Color</span>
                  <span className="text-[#8F8385] font-normal">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.frameColors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`group relative w-8 h-8 rounded-full transition-transform active:scale-95 flex items-center justify-center cursor-pointer ${
                          isSelected ? "ring-2 ring-offset-2 ring-[#C85250] scale-110 shadow-xs" : "border border-[#D1C5BD]"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        aria-label={`Select ${color.name} color`}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              color.hex === "#FFFFFF" || color.hex === "#FAF5F1"
                                ? "text-[#221C1D]"
                                : "text-white"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Material Radios */}
            {product.materials && product.materials.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#3C3234] mb-2">
                  <span>Material</span>
                  <span className="text-[#8F8385] font-normal">{selectedMaterial}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {product.materials.map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setSelectedMaterial(mat)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-center cursor-pointer ${
                        selectedMaterial === mat
                          ? "bg-[#FDF2F0] text-[#C85250] border-2 border-[#C85250] font-semibold"
                          : "bg-white text-[#4A3E40] border border-[#E0D5CC] hover:border-[#C85250]"
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Details Input */}
            <div>
              <label htmlFor="pdpCustomText" className="block text-xs font-semibold text-[#3C3234] mb-1.5">
                Names or Special Date to Engrave (Optional)
              </label>
              <input
                id="pdpCustomText"
                type="text"
                value={customizationText}
                onChange={(e) => setCustomizationText(e.target.value)}
                placeholder="e.g. Rahul & Sneha · 14.02.2024"
                className="w-full bg-[#FAF5F1] text-xs sm:text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border border-[#EDE0D6] focus:border-[#C85250] outline-none"
              />
              <p className="text-[11px] text-[#7A6D70] mt-1">
                * High-resolution photos are collected on WhatsApp after checkout for maximum quality.
              </p>
            </div>

            {/* Quantity & Add to Cart button */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center border border-[#E0D5CC] rounded-xl overflow-hidden bg-[#FAF5F1] shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-[#5C4F51] hover:text-[#C85250] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#221C1D]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 text-[#5C4F51] hover:text-[#C85250] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-[#C85250] hover:bg-[#B14140] text-white py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base transition-transform active:scale-[0.98] shadow-md shadow-[#C85250]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Add to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {addedToast && (
              <div className="p-3 bg-[#EAF7ED] text-[#1E7238] border border-[#BDE5C8] rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
                <span>Added to your cart successfully!</span>
                <Link href="/cart" className="underline font-bold hover:text-[#14532D]">
                  View Cart →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-[#EFE4DC]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
              You May Also Like
            </h2>
            <Link
              href={`/categories/${product.categorySlug}`}
              className="text-xs sm:text-sm font-semibold text-[#C85250] hover:underline"
            >
              View More →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
