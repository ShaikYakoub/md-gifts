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
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Gallery angles/views for the scrollable main image area (Requirements 33-34)
  const imageSlides = [
    { id: "front", label: "Front View", angleClass: "scale-100" },
    { id: "perspective", label: "Perspective Angle", angleClass: "scale-105" },
    { id: "detail", label: "Close-up Craftsmanship", angleClass: "scale-110" },
  ];

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollPos = el.scrollLeft;
    const slideWidth = el.offsetWidth;
    if (slideWidth > 0) {
      const newIdx = Math.round(scrollPos / slideWidth);
      if (newIdx !== activeImageIndex && newIdx >= 0 && newIdx < imageSlides.length) {
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
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 4000);
  };

  return (
    <div className="pt-4 pb-44 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation - browser back action closes/navigates back (Requirements 30-32: No X button) */}
      <nav
        className="flex items-center gap-1.5 text-xs text-[#7A6D70] mb-6 overflow-x-auto no-scrollbar whitespace-nowrap"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-[#C85250] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9] shrink-0" />
        <Link
          href={`/categories/${product.categorySlug}`}
          className="capitalize hover:text-[#C85250] transition-colors"
        >
          {product.categorySlug.replace(/-/g, " ")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9] shrink-0" />
        <span className="text-[#221C1D] font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Horizontally Scrollable / Swipeable Main Product Image Area (Requirements 33-34) */}
        <div className="lg:col-span-7">
          <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF3EE] border border-[#EDE2DA] shadow-sm select-none">
            {/* Scrollable / Swipeable Track */}
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
              aria-label="Product image gallery"
            >
              {imageSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="w-full h-full shrink-0 snap-center relative flex items-center justify-center"
                >
                  <ProductImage
                    slug={product.slug}
                    name={product.name}
                    categorySlug={product.categorySlug}
                    priority={idx === 0}
                    aspectRatio="square"
                    className={`w-full h-full transition-transform duration-500 ${slide.angleClass}`}
                  />
                </div>
              ))}
            </div>

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <span className="absolute top-3.5 left-3.5 bg-[#FDEBEB] text-[#C85250] text-xs font-bold px-3 py-1 rounded-full border border-[#F8CDCD] shadow-xs z-10 pointer-events-none">
                {discountPercent}% OFF
              </span>
            )}

            {/* Carousel Arrow Controls (Desktop/Tablet) */}
            <button
              type="button"
              onClick={() => scrollToSlide((activeImageIndex - 1 + imageSlides.length) % imageSlides.length)}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#221C1D] hover:text-[#C85250] items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSlide((activeImageIndex + 1) % imageSlides.length)}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#221C1D] hover:text-[#C85250] items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Indicator Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {imageSlides.map((_, idx) => (
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
          </div>
        </div>

        {/* Right Column: Details & Customization Options */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#EDE2DA] shadow-xs space-y-6">
          {/* Header Info: Title & Price (Requirement 35: Ratings/reviews removed completely) */}
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D]">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#6C5E61] mt-2 leading-relaxed">
              {product.description}
            </p>

            {/* Price section */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#C85250]">
                ₹{currentPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-base text-[#9C8F92] line-through font-normal">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-[#1E7238] bg-[#EBF7EE] px-2.5 py-0.5 rounded-md">
                {discountPercent}% OFF
              </span>
            </div>
          </div>

          <div className="border-t border-[#F0E6DE] pt-4 space-y-5">
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

            {/* Customization Details & Notes Input (Requirements 45-51: Auto-expanding, no resize handle) */}
            <div className="p-3.5 bg-[#FAF5F1] rounded-xl border border-[#EDE0D6]">
              <label htmlFor="pdpCustomText" className="block text-xs font-bold text-[#221C1D] mb-1">
                Customization Notes & Names (Optional)
              </label>
              <AutoExpandingTextarea
                id="pdpCustomText"
                value={customizationText}
                onChange={setCustomizationText}
                minHeight={64}
                maxHeight={180}
                placeholder="e.g. Names (Rahul & Priya), Anniversary date (14 Feb 2023), or custom quote..."
                className="bg-white text-xs sm:text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border border-[#EDE0D6] focus:border-[#C85250] focus:ring-1 focus:ring-[#C85250]"
              />
              <p className="text-[11px] text-[#7A6D70] mt-1.5">
                📸 High-resolution photos are collected on WhatsApp after placing your order.
              </p>
            </div>
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
              /* Added State: Combined Quantity Controller (Items 56, 60, 62) */
              <div className="w-full flex items-center justify-between bg-[#FDF2F0] border border-[#F5C2BC] rounded-xl px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => cartItem && updateQuantity(cartItem.id, -1)}
                  className="w-8 h-8 rounded-lg bg-white border border-[#E0D5CC] flex items-center justify-center text-[#5C4F51] hover:text-[#C85250] transition-colors cursor-pointer active:scale-95"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="flex flex-col items-center">
                  <span className="font-bold text-sm text-[#221C1D]">
                    {quantityInCart} in Cart
                  </span>
                  <span className="text-[10px] text-[#1E7238] font-medium flex items-center gap-0.5">
                    <Check className="w-3 h-3" />
                    <span>Added</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => cartItem && updateQuantity(cartItem.id, 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-[#E0D5CC] flex items-center justify-center text-[#5C4F51] hover:text-[#C85250] transition-colors cursor-pointer active:scale-95"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Temporary Added to Cart feedback toast */}
        {justAdded && (
          <div className="max-w-7xl mx-auto mt-2 text-center text-xs font-semibold text-[#1E7238] bg-[#EAF7ED] py-1 px-3 rounded-lg border border-[#BDE5C8] flex items-center justify-center gap-2 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Item added to cart!</span>
            <Link href="/cart" className="underline font-bold text-[#14532D] ml-1">
              View Cart →
            </Link>
          </div>
        )}
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
