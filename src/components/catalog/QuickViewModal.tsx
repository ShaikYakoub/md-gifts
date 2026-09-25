"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Star,
  Plus,
  Minus,
  Check,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/ui/ProductImage";

export function QuickViewModal() {
  const { activeQuickViewProduct, closeQuickView, addItem } = useCart();

  const product = activeQuickViewProduct;

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [customizationText, setCustomizationText] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [activeThumbnail, setActiveThumbnail] = useState<number>(0);

  // Initialize variant defaults when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '8" × 10"');
      setSelectedColor(product.frameColors[0]?.name || "Black");
      setSelectedMaterial(product.materials[0] || "Wood");
      setCustomizationText("");
      setQuantity(1);
      setAddedToast(false);
      setActiveThumbnail(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && activeQuickViewProduct) {
        closeQuickView();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeQuickViewProduct, closeQuickView]);

  if (!product) return null;

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
    }, 2800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Configure ${product.name}`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeQuickView}
      />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative w-full sm:max-w-4xl max-h-[90vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden animate-slide-up sm:animate-fade-in border border-[#EDE2DA]">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-[#E0D5CC] rounded-full mx-auto my-2.5 shrink-0" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeQuickView}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 text-[#6C5F61] hover:text-[#221C1D] hover:bg-[#FAF2EE] rounded-full transition-colors bg-white/80 backdrop-blur-xs"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div
          className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-8"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))" }}
        >
          {/* Left Column: Product Image Gallery with Thumbnail Strip matching screenshot */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2 shrink-0 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveThumbnail(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border transition-all shrink-0 ${
                    activeThumbnail === idx
                      ? "border-[#C85250] ring-2 ring-[#C85250]/20"
                      : "border-[#EDE2DA] opacity-75 hover:opacity-100"
                  }`}
                  aria-label={`Product view angle ${idx + 1}`}
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

            {/* Main Product View */}
            <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-[#FAF3EE] border border-[#EFE4DC]">
              <ProductImage
                slug={product.slug}
                name={product.name}
                categorySlug={product.categorySlug}
                aspectRatio="square"
              />
              {discountPercent && (
                <span className="absolute top-3 left-3 bg-[#FDEBEB] text-[#C85250] text-xs font-bold px-2.5 py-1 rounded-full border border-[#F8CDCD]">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Configuration & Variant Options */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#7A6E70]">
                <div className="flex items-center text-[#F59E0B]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-semibold text-[#2B2325]">{product.rating}</span>
                <span className="text-[#9C8F92]">({product.reviewsCount} reviews)</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D] mt-1">
                {product.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#6C5F61] mt-1.5 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Price Banner */}
              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#C85250]">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                {currentCompareAtPrice && currentCompareAtPrice > currentPrice && (
                  <span className="text-sm sm:text-base text-[#9C8F92] line-through">
                    ₹{currentCompareAtPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs font-bold text-[#C85250] bg-[#FDEBEB] px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Variant 1: Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
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
                        className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          selectedSize === size
                            ? "bg-[#FDF2F0] text-[#C85250] border-2 border-[#C85250] shadow-xs"
                            : "bg-white text-[#4A3E40] border border-[#E0D5CC] hover:border-[#C85250]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant 2: Frame Color */}
              {product.frameColors && product.frameColors.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#3C3234] mb-2">
                    <span>Frame Color</span>
                    <span className="text-[#8F8385] font-normal">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.frameColors.map((color) => {
                      const isSelected = selectedColor === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`group relative w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform active:scale-90 flex items-center justify-center ${
                            isSelected ? "ring-2 ring-offset-2 ring-[#C85250] scale-105" : "border border-[#D1C5BD]"
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

              {/* Variant 3: Material */}
              {product.materials && product.materials.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-[#3C3234] mb-2">
                    <span>Material</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((mat) => (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setSelectedMaterial(mat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedMaterial === mat
                            ? "bg-[#221C1D] text-white border border-[#221C1D]"
                            : "bg-white text-[#5C4F51] border border-[#E0D5CC] hover:border-[#221C1D]"
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customization Text Field */}
              {product.hasCustomizationText && (
                <div className="mt-4">
                  <label htmlFor="customizationText" className="block text-xs font-semibold text-[#3C3234] mb-1.5">
                    Customization Details
                  </label>
                  <input
                    id="customizationText"
                    type="text"
                    value={customizationText}
                    onChange={(e) => setCustomizationText(e.target.value)}
                    placeholder={product.customizationPlaceholder || "Names, date, or special message..."}
                    className="w-full bg-[#FAF5F1] text-xs sm:text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border border-[#EDE0D6] focus:border-[#C85250] focus:bg-white outline-none"
                  />
                  <p className="text-[11px] text-[#8F8385] mt-1">
                    * Our team will WhatsApp / call you to verify photos and design previews before making.
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#3C3234]">Quantity</span>
                <div className="flex items-center border border-[#E0D5CC] rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-[#5C4F51] hover:bg-[#FAF4F0] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs sm:text-sm font-semibold text-[#221C1D]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="p-2 text-[#5C4F51] hover:bg-[#FAF4F0] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions: Add to Cart button */}
            <div className="pt-4 border-t border-[#EFE4DC]">
              {addedToast ? (
                <div className="flex items-center justify-between bg-[#EAF7ED] border border-[#BCE5C4] text-[#1E7238] px-4 py-3 rounded-xl text-sm font-medium animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </div>
                  <Link
                    href="/cart"
                    onClick={closeQuickView}
                    className="flex items-center gap-1 font-bold underline hover:text-[#14532D]"
                  >
                    <span>View Cart</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-[#C85250] hover:bg-[#B14140] text-white py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
                >
                  <span>Add to Cart</span>
                  <span>•</span>
                  <span>₹{(currentPrice * quantity).toLocaleString("en-IN")}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
