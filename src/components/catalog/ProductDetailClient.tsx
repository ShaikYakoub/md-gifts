"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Minus,
  Check,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  X,
  ChevronDown,
} from "lucide-react";
import { Product, ColorOption } from "@/types/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/catalog/ProductCard";
import { AutoExpandingTextarea } from "@/components/ui/AutoExpandingTextarea";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { items, addItem, updateQuantity, totalQuantity } = useCart();

  // Ensure the color with the longest/biggest name is always at the very end
  const displayFrameColors = useMemo<ColorOption[]>(() => {
    if (!product.frameColors || product.frameColors.length <= 1) {
      return product.frameColors || [];
    }
    let maxIdx = 0;
    for (let i = 1; i < product.frameColors.length; i++) {
      if (product.frameColors[i].name.length > product.frameColors[maxIdx].name.length) {
        maxIdx = i;
      }
    }
    if (maxIdx === product.frameColors.length - 1) {
      return product.frameColors;
    }
    const colors = [...product.frameColors];
    const [biggest] = colors.splice(maxIdx, 1);
    colors.push(biggest);
    return colors;
  }, [product.frameColors]);

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '8" × 10"');
  const [selectedColor, setSelectedColor] = useState<string>(
    displayFrameColors[0]?.name || product.frameColors[0]?.name || "Black"
  );
  const [selectedMaterial, setSelectedMaterial] = useState<string>(product.materials[0] || "Wood");
  const [customizationText, setCustomizationText] = useState<string>("");
  const [showCustomization, setShowCustomization] = useState<boolean>(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

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
    <div className="relative pt-0 sm:pt-4 pb-28 sm:pb-36 max-w-7xl mx-auto">
      {/* Floating Back Button (Follows everywhere as user scrolls on mobile) */}
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = "/";
          }
        }}
        className="fixed top-3.5 left-3.5 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full btn-lit-red text-white flex md:hidden items-center justify-center cursor-pointer"
        aria-label="Go back"
      >
        <ArrowLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2.4]" />
      </button>

      {/* Header Info for Desktop */}
      <div className="hidden sm:block px-6 lg:px-8 mb-6 space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#221C1D] tracking-tight">
          {product.name}
        </h1>
        <p className="text-xs sm:text-[13px] text-[#7A6D70] max-w-xl leading-relaxed">
          {displayDescription}
        </p>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-6 lg:gap-12 items-start sm:px-6 lg:px-8">
        {/* Left Column: Main Product Image Area (Symmetric 16px padding on mobile: pt-4 px-4) */}
        <div className="lg:col-span-7 px-4 pt-4 sm:px-0 sm:pt-0">
          <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF5F0] border border-[#EDE2DA] select-none shadow-xs">
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
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#221C1D] hover:text-[#EC0B12] items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSlide((activeImageIndex + 1) % slides.length)}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#221C1D] hover:text-[#EC0B12] items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
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

        {/* Right Column: Selections, Price & Actions */}
        <div className="lg:col-span-5 px-4 sm:px-0 space-y-3 pt-0">
          {/* Mobile-only Title Header */}
          <div className="sm:hidden">
            <h1 className="font-serif text-2xl font-bold text-[#221C1D] tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Prominent Price & Discount Header (Above Size) */}
          <div className="pb-2.5 border-b border-[#EFE4DC]">
            {/* Selling price on top */}
            <div className="text-2xl sm:text-3xl font-bold text-[#1E191A] tracking-tight leading-none">
              ₹{currentPrice.toLocaleString("en-IN")}
            </div>

            {/* Below: First the MRP crossed off, then the discount */}
            <div className="flex items-center gap-2 mt-1.5">
              {mrp > currentPrice && (
                <span className="text-sm sm:text-base text-[#8C7D80] line-through font-normal">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs sm:text-sm font-semibold text-[#1E7238] tracking-tight">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Selections Section */}
          <div className="space-y-4">
            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-[#3C3234] mb-1.5">
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
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-[#FEF2F2] text-[#EC0B12] border-[#EC0B12]"
                            : "bg-white text-[#4A3E40] border-[#DCD0C7] hover:border-[#EC0B12]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Frame Color Swatches: Rounded squares with name right below selected color */}
            {displayFrameColors && displayFrameColors.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-[#3C3234] mb-1.5">
                  <span>Frame Color</span>
                </div>
                <div className="flex items-center gap-3.5 pb-6.5 relative">
                  {displayFrameColors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <div key={color.name} className="relative flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`relative w-8 h-8 rounded-lg transition-transform active:scale-95 flex items-center justify-center cursor-pointer ring-2 ring-offset-2 ${
                            isSelected
                              ? "ring-[#EC0B12] shadow-xs"
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
                        {isSelected && (
                          <span className="absolute top-full mt-2.5 text-[11px] font-semibold text-[#221C1D] whitespace-nowrap text-center leading-tight select-none">
                            {color.name}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Material Radios */}
            {product.materials && product.materials.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-[#3C3234] mb-1.5">
                  <span>Material</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((mat) => {
                    const isSelected = selectedMaterial === mat;
                    return (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setSelectedMaterial(mat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors text-center cursor-pointer border ${
                          isSelected
                            ? "bg-[#FEF2F2] text-[#EC0B12] border-[#EC0B12]"
                            : "bg-white text-[#4A3E40] border-[#DCD0C7] hover:border-[#EC0B12]"
                        }`}
                      >
                        {mat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customization Details: Compact Add Customization button */}
            {product.hasCustomizationText !== false && (
              <div>
                {!showCustomization && !customizationText ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomization(true)}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg border border-dashed border-[#DCD0C7] hover:border-[#EC0B12] bg-[#FAF7F5] hover:bg-[#FFF8F7] text-xs font-semibold text-[#4A3E40] hover:text-[#EC0B12] transition-colors cursor-pointer"
                  >
                    Add Customization
                  </button>
                ) : !showCustomization && customizationText ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[#EC0B12]/25 bg-[#FEF2F2]/60 text-xs text-[#221C1D]">
                    <span className="truncate max-w-[200px] text-xs text-[#4A3E40]">
                      <span className="font-semibold text-[#221C1D]">Custom: </span>
                      &ldquo;{customizationText}&rdquo;
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCustomization(true)}
                      className="text-xs font-semibold text-[#EC0B12] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomizationText("");
                        setShowCustomization(false);
                      }}
                      className="text-[#8C7E81] hover:text-[#EC0B12] cursor-pointer p-0.5"
                      title="Remove customization"
                      aria-label="Remove customization"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 transition-all">
                    <div className="flex items-center justify-between">
                      <label htmlFor="pdpCustomText" className="text-xs font-semibold text-[#3C3234]">
                        Customization Note
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCustomization(false)}
                        className="text-[11px] font-semibold text-[#EC0B12] hover:text-[#C50A10] transition-colors cursor-pointer"
                      >
                        {customizationText.trim() ? "Done" : "Cancel"}
                      </button>
                    </div>
                    <AutoExpandingTextarea
                      id="pdpCustomText"
                      value={customizationText}
                      onChange={setCustomizationText}
                      autoFocus
                      minHeight={56}
                      maxHeight={140}
                      placeholder={
                        product.customizationPlaceholder ||
                        "e.g. Names (Rahul & Priya), Anniversary date (14 Feb 2023), or custom quote..."
                      }
                      className="w-full bg-white text-xs sm:text-sm text-[#221C1D] placeholder-[#9E9093] px-3 py-2 rounded-xl border border-[#EDE0D6] focus:border-[#EC0B12] focus:ring-1 focus:ring-[#EC0B12] shadow-2xs"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Description Dropdown: Clicking toggles showing the description */}
            {product.description && (
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0 py-3 sm:py-3.5 border-t border-[#EFE4DC]">
                <button
                  type="button"
                  onClick={() => setIsDescriptionOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between text-left py-0.5 cursor-pointer group select-none"
                  aria-expanded={isDescriptionOpen}
                >
                  <span className="text-xs font-bold text-[#221C1D] uppercase tracking-wider group-hover:text-[#EC0B12] transition-colors">
                    Description
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C7E81] group-hover:text-[#EC0B12] transition-transform duration-200 ${
                      isDescriptionOpen ? "rotate-180 text-[#EC0B12]" : ""
                    }`}
                  />
                </button>
                {isDescriptionOpen && (
                  <div className="pt-2.5 text-xs sm:text-sm text-[#6C5E61] leading-relaxed transition-all">
                    <p>{product.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* In-page action button for desktop */}
          <div className="hidden lg:block pt-2">
            {quantityInCart === 0 ? (
              <button
                type="button"
                onClick={handleInitialAddToCart}
                className="w-full btn-lit-red text-white py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between bg-white border border-[#D5C7BC] rounded-xl px-3 py-1.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => cartItem && updateQuantity(cartItem.id, -1)}
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#F0FDF4] active:bg-[#DCFCE7] transition-colors cursor-pointer"
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
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#F0FDF4] active:bg-[#DCFCE7] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM ACTION BAR: Cart link + Add to Cart Controller */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#EFE4DC] py-2.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          {/* Direct Cart Navigation Icon Button */}
          <Link
            href="/cart"
            className="relative w-11 h-11 rounded-full bg-[#FAF5F0] hover:bg-[#F3EAE4] border border-[#E8DDD4] text-[#221C1D] hover:text-[#EC0B12] flex items-center justify-center shrink-0 transition-colors group cursor-pointer"
            aria-label="View Shopping Cart"
            title="View Cart"
          >
            <ShoppingCart className="w-5 h-5 text-[#221C1D] group-hover:text-[#EC0B12] transition-colors" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EC0B12] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Action Controller: Add to Cart taking the remaining space */}
          <div className="flex-1 flex items-center justify-end max-w-md">
            {quantityInCart === 0 ? (
              <button
                type="button"
                onClick={handleInitialAddToCart}
                className="w-full btn-lit-red text-white py-2.5 sm:py-3 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
              >
                <Plus className="w-4 h-4 stroke-[2.4]" />
                <span>Add to Cart</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between bg-white border border-[#D5C7BC] rounded-full px-2 py-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => cartItem && updateQuantity(cartItem.id, -1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#16A34A] hover:bg-[#F0FDF4] active:bg-[#DCFCE7] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 stroke-[2.5]" />
                </button>

                <span className="font-bold text-xs sm:text-sm text-[#221C1D]">
                  {quantityInCart} in Cart
                </span>

                <button
                  type="button"
                  onClick={() => cartItem && updateQuantity(cartItem.id, 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#16A34A] hover:bg-[#F0FDF4] active:bg-[#DCFCE7] transition-colors cursor-pointer active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 mt-0 pt-3.5 sm:mt-8 sm:pt-8 border-t border-[#EFE4DC]">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
              You May Also Like
            </h2>
            <Link
              href={`/categories/${product.categorySlug}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[#E8DFD8] bg-white text-[#221C1D] hover:bg-[#FAF5F1] hover:border-[#EC0B12]/40 hover:text-[#EC0B12] transition-colors shadow-2xs group"
            >
              <span>View more</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7A6D70] group-hover:text-[#EC0B12] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
