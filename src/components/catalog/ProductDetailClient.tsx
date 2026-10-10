"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Minus,
  Check,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";
import { Product } from "@/types/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/catalog/ProductCard";
import { AutoExpandingTextarea } from "@/components/ui/AutoExpandingTextarea";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { items, addItem, updateQuantity } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '8" × 10"');
  const [selectedColor, setSelectedColor] = useState<string>(product.frameColors[0]?.name || "Black");
  const [selectedMaterial, setSelectedMaterial] = useState<string>(product.materials[0] || "Wood");
  const [customizationText, setCustomizationText] = useState<string>("");

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Gallery angles/views for the horizontally scrollable image area
  const rawImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.slug];

  const slides =
    rawImages.length >= 2
      ? rawImages.map((img, idx) => ({
          id: `img-${idx}`,
          image: img,
          label: idx === 0 ? "Front View" : idx === 1 ? "Perspective Angle" : `Detail View ${idx}`,
          angleClass: idx === 0 ? "scale-100" : idx === 1 ? "scale-105 rotate-1" : "scale-110 -rotate-1",
        }))
      : [
          { id: "view-1", image: rawImages[0] || "", label: "Front View", angleClass: "scale-100" },
          { id: "view-2", image: rawImages[0] || "", label: "Perspective Angle", angleClass: "scale-105 rotate-1" },
          { id: "view-3", image: rawImages[0] || "", label: "Craftsmanship Detail", angleClass: "scale-110 -rotate-1" },
        ];

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const slideWidth = el.offsetWidth;
    if (slideWidth > 0) {
      const newIdx = Math.round(el.scrollLeft / slideWidth);
      if (newIdx !== activeImageIndex && newIdx >= 0 && newIdx < slides.length) {
        setActiveImageIndex(newIdx);
      }
    }
  };

  const scrollToSlide = (idx: number) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTo({
      left: idx * el.offsetWidth,
      behavior: "smooth",
    });
    setActiveImageIndex(idx);
  };

  // Derive dynamic price based on size variant if available
  const variant = product.variants?.find((v) => v.size === selectedSize);
  const currentPrice = variant ? variant.price : product.price;
  const currentCompareAtPrice = variant ? variant.compareAtPrice : product.compareAtPrice;

  const mrp =
    currentCompareAtPrice && currentCompareAtPrice > currentPrice
      ? currentCompareAtPrice
      : Math.round(currentPrice * 1.25);

  const discountPercent = Math.max(
    5,
    Math.round(((mrp - currentPrice) / mrp) * 100)
  );

  // Check if this variant is currently in the cart
  const currentItemId = `${product.id}_${selectedSize || "default"}_${selectedColor || "default"}_${selectedMaterial || "default"}`;
  const cartItem = items.find((i) => i.id === currentItemId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const handleInitialAddToCart = () => {
    addItem({
      product,
      selectedSize,
      selectedFrameColor: selectedColor,
      selectedMaterial,
      customizationText: customizationText.trim() || undefined,
      price: currentPrice,
      quantity: 1,
    });
  };

  // Concise reduced description (smaller size & smaller text)
  const displayDescription =
    product.shortDescription ||
    (product.description ? product.description.split(/(?<=[.!?])\s+/)[0] : "");

  return (
    <div className="pt-4 pb-44 sm:py-10 max-w-7xl mx-auto">
      {/* Header Info: Title on top with smaller size & reduced description */}
      <div className="px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#221C1D] tracking-tight">
          {product.name}
        </h1>
        <p className="text-xs sm:text-[13px] text-[#7A6D70] max-w-xl leading-relaxed">
          {displayDescription}
        </p>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start sm:px-6 lg:px-8">
        {/* Left Column: Horizontally Scrollable / Swipeable Main Product Image Area (Full-bleed on mobile) */}
        <div className="lg:col-span-7">
          <div className="relative aspect-square w-full rounded-none sm:rounded-3xl overflow-hidden bg-[#FAF3EE] border-y sm:border border-[#EDE2DA] select-none">
            {/* Scrollable / Swipeable Track - Strictly Horizontal */}
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing touch-pan-x"
              aria-label="Product image gallery"
            >
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="w-full h-full shrink-0 snap-center relative flex items-center justify-center overflow-hidden select-none"
                >
                  <ProductImage
                    slug={product.slug}
                    name={product.name}
                    categorySlug={product.categorySlug}
                    image={slide.image}
                    priority={idx === 0}
                    aspectRatio="square"
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>

            {/* Carousel Arrow Controls (Desktop/Tablet) */}
            <button
              type="button"
              onClick={() => scrollToSlide((activeImageIndex - 1 + slides.length) % slides.length)}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#221C1D] hover:text-[#C85250] items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSlide((activeImageIndex + 1) % slides.length)}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#221C1D] hover:text-[#C85250] items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Indicator Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  className={`rounded-full transition-all cursor-pointer ${
                    activeImageIndex === idx ? "w-5 h-1.5 bg-white shadow-xs" : "w-1.5 h-1.5 bg-white/50"
                  }`}
                  aria-label={`Go to image slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Slide counter chip */}
            <div className="absolute top-3.5 right-3.5 z-10 bg-black/40 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
              {activeImageIndex + 1} / {slides.length}
            </div>
          </div>
        </div>

        {/* Right Column: Selections, Price & Actions (Unboxed, full-width) */}
        <div className="lg:col-span-5 px-4 sm:px-0 space-y-6 pt-2 sm:pt-0">
          {/* Prominent Price & Discount Header (Above Size) */}
          <div className="pb-3 border-b border-[#EFE4DC]">
            <div className="flex items-baseline gap-2">
              {discountPercent > 0 && (
                <span className="text-[28px] sm:text-[32px] font-light text-[#CC0C39] leading-none tracking-tight relative -top-1 sm:-top-1.5">
                  -{discountPercent}%
                </span>
              )}
              <span className="inline-flex items-baseline text-[#0F1111] font-bold leading-none tracking-tight">
                <span className="text-xs sm:text-base font-normal -translate-y-3.5 sm:-translate-y-4 mr-0.5 select-none leading-none">
                  ₹
                </span>
                <span className="text-[34px] sm:text-[40px] font-bold leading-none tracking-tight">
                  {currentPrice.toLocaleString("en-IN")}
                </span>
              </span>
            </div>

            {mrp > currentPrice && (
              <div className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#565959] flex items-baseline gap-1 font-normal">
                <span>M.R.P.: </span>
                <span className="line-through">₹{mrp.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          {/* Selections Section */}
          <div className="space-y-5">
            {/* Size Selector (Requirements 36-40: No layout wobble, no size text beside heading) */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-[#3C3234] mb-2">
                  <span>Size</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer border-2 ${
                          isSelected
                            ? "bg-[#FDF2F0] text-[#C85250] border-[#C85250] font-semibold"
                            : "bg-white text-[#4A3E40] border-[#E0D5CC] hover:border-[#C85250]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Frame Color Swatches (Requirements 41-44: No text beside heading, selected color name BELOW, stable layout) */}
            {product.frameColors && product.frameColors.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-[#3C3234] mb-2">
                  <span>Frame Color</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.frameColors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`relative w-8 h-8 rounded-full transition-transform active:scale-95 flex items-center justify-center cursor-pointer ring-2 ring-offset-2 ${
                          isSelected
                            ? "ring-[#C85250] shadow-xs"
                            : "ring-transparent hover:ring-[#D1C5BD]"
                        } border border-black/15`}
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

                {/* Selected Color Name shown dynamically BELOW the color options (Requirements 42, 43) */}
                <div className="mt-2 text-xs font-medium text-[#6C5E61]">
                  Selected: <span className="font-semibold text-[#221C1D]">{selectedColor}</span>
                </div>
              </div>
            )}

            {/* Material Radios */}
            {product.materials && product.materials.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-[#3C3234] mb-2">
                  <span>Material</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {product.materials.map((mat) => {
                    const isSelected = selectedMaterial === mat;
                    return (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setSelectedMaterial(mat)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors text-center cursor-pointer border-2 ${
                          isSelected
                            ? "bg-[#FDF2F0] text-[#C85250] border-[#C85250] font-semibold"
                            : "bg-white text-[#4A3E40] border-[#E0D5CC] hover:border-[#C85250]"
                        }`}
                      >
                        {mat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customization Details & Notes Input */}
            <div className="space-y-1.5">
              <label htmlFor="pdpCustomText" className="block text-xs font-bold text-[#221C1D]">
                Customization Notes & Names (Optional)
              </label>
              <AutoExpandingTextarea
                id="pdpCustomText"
                value={customizationText}
                onChange={setCustomizationText}
                minHeight={64}
                maxHeight={180}
                placeholder="e.g. Names (Rahul & Priya), Anniversary date (14 Feb 2023), or custom quote..."
                className="w-full bg-white text-xs sm:text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border border-[#EDE0D6] focus:border-[#C85250] focus:ring-1 focus:ring-[#C85250] shadow-2xs"
              />
              <p className="text-[11px] text-[#7A6D70]">
                📸 High-resolution photos are collected on WhatsApp after placing your order.
              </p>
            </div>
          </div>

          {/* In-page action button for desktop */}
          <div className="hidden lg:block pt-2">
            {quantityInCart === 0 ? (
              <button
                type="button"
                onClick={handleInitialAddToCart}
                className="w-full bg-[#C85250] hover:bg-[#B14140] text-white py-3.5 px-6 rounded-xl font-bold text-base transition-transform active:scale-[0.98] shadow-md shadow-[#C85250]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between bg-[#FDF2F0] border border-[#F5C2BC] rounded-xl px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => cartItem && updateQuantity(cartItem.id, -1)}
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-[#4A3E40] hover:text-[#C85250] hover:bg-black/5 transition-all cursor-pointer active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-6 h-6 stroke-[2.5]" />
                </button>

                <span className="font-bold text-base text-[#221C1D]">
                  {quantityInCart} in Cart
                </span>

                <button
                  type="button"
                  onClick={() => cartItem && updateQuantity(cartItem.id, 1)}
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-[#4A3E40] hover:text-[#C85250] hover:bg-black/5 transition-all cursor-pointer active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMBINED ADD-TO-CART + QUANTITY FIXED BOTTOM ACTION SECTION (Requirements 54-63, 139) */}
      <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#EFE4DC] py-3 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Price information summary */}
          <div className="flex flex-col">
            <span className="text-[11px] text-[#7A6D70] uppercase tracking-wider font-semibold">Total</span>
            <span className="text-lg sm:text-xl font-bold text-[#221C1D]">
              ₹{((cartItem ? cartItem.price * cartItem.quantity : currentPrice)).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Action Controller */}
          <div className="flex-1 max-w-sm flex items-center justify-end gap-3">
            {quantityInCart === 0 ? (
              /* Initial State: Add to Cart button (Item 55) */
              <button
                type="button"
                onClick={handleInitialAddToCart}
                className="w-full bg-[#C85250] hover:bg-[#B14140] text-white py-3 px-6 rounded-xl font-bold text-sm sm:text-base transition-transform active:scale-[0.98] shadow-md shadow-[#C85250]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            ) : (
              /* Added State: Combined Quantity Controller without tick mark, no borders/bg, bigger buttons */
              <div className="w-full flex items-center justify-between bg-[#FDF2F0] border border-[#F5C2BC] rounded-xl px-2 py-1">
                <button
                  type="button"
                  onClick={() => cartItem && updateQuantity(cartItem.id, -1)}
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-[#4A3E40] hover:text-[#C85250] hover:bg-black/5 transition-all cursor-pointer active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-6 h-6 stroke-[2.5]" />
                </button>

                <span className="font-bold text-sm sm:text-base text-[#221C1D]">
                  {quantityInCart} in Cart
                </span>

                <button
                  type="button"
                  onClick={() => cartItem && updateQuantity(cartItem.id, 1)}
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-[#4A3E40] hover:text-[#C85250] hover:bg-black/5 transition-all cursor-pointer active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-[#EFE4DC]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
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
