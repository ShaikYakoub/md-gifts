"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/ui/ProductImage";
import { AutoExpandingTextarea } from "@/components/ui/AutoExpandingTextarea";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp";

interface FormErrors {
  fullName?: string;
  address?: string;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalQuantity } =
    useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [placedWhatsAppUrl, setPlacedWhatsAppUrl] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name (at least 2 characters).";
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address =
        "Please enter your complete address including Flat, Street, City, State & Pincode.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    if (!validateForm()) {
      return;
    }

    // Build the complete WhatsApp order message (Requirements 115-118)
    const whatsappUrl = buildOrderWhatsAppUrl({
      fullName: formData.fullName,
      address: formData.address,
      items,
      total: subtotal,
    });

    setPlacedWhatsAppUrl(whatsappUrl);
    clearCart();

    // Trigger WhatsApp in new tab / app
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank");
    }
  };

  // If order was successfully dispatched to WhatsApp
  if (placedWhatsAppUrl) {
    return (
      <SiteLayout showFooter={false}>
        <div className="py-16 pb-28 sm:py-24 text-center max-w-lg mx-auto px-4">
          <div className="w-16 h-16 bg-[#E8F5E9] text-[#128C7E] rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#221C1D] tracking-tight">
            Order Ready on WhatsApp!
          </h1>
          <p className="text-sm text-[#5C4F51] mt-3 leading-relaxed">
            Your customized order and delivery details have been prepared. Click below if WhatsApp did not open automatically to send your order and photos to our design team.
          </p>

          <div className="mt-8 space-y-3">
            <a
              href={placedWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5C] text-white py-3.5 px-6 rounded-xl font-semibold text-base transition-colors shadow-md cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>Send Order on WhatsApp</span>
            </a>

            <Link
              href="/shop"
              className="inline-block text-sm text-[#7A6D70] hover:text-[#C85250] font-medium pt-2 transition-colors cursor-pointer"
            >
              Continue Browsing Gifts →
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout showFooter={false}>
      <div className="pt-6 pb-48 sm:py-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Cart Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE4DC] mb-6">
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#221C1D] tracking-tight">
              Your Cart
            </h1>
            <span className="text-sm font-medium text-[#7A6D70]">
              ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
            </span>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-[#C85250] hover:underline cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* 1. CART ITEMS AT TOP (Requirement 85) */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#EDE2DA] p-3.5 sm:p-4 flex gap-3.5 sm:gap-4 items-center shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-[#FAF3EE] shrink-0 border border-[#F0E4DC]">
                    <ProductImage
                      slug={item.product.slug}
                      name={item.product.name}
                      categorySlug={item.product.categorySlug}
                      aspectRatio="square"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-[#221C1D] truncate">
                      {item.product.name}
                    </h3>

                    {/* Variant specs */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#7A6D70] mt-0.5">
                      {item.selectedSize && <span>{item.selectedSize}</span>}
                      {item.selectedSize && item.selectedFrameColor && <span>•</span>}
                      {item.selectedFrameColor && <span>{item.selectedFrameColor}</span>}
                      {item.selectedMaterial && (
                        <>
                          <span>•</span>
                          <span>{item.selectedMaterial}</span>
                        </>
                      )}
                    </div>

                    {/* Custom text snippet */}
                    {item.customizationText && (
                      <p className="text-[11px] text-[#C85250] bg-[#FAF2F0] px-2 py-0.5 rounded mt-1 truncate max-w-xs">
                        Custom: &ldquo;{item.customizationText}&rdquo;
                      </p>
                    )}

                    {/* Price and Quantity Controls */}
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="font-bold text-sm sm:text-base text-[#221C1D]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#E0D5CC] rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-[#5C4F51] hover:bg-[#FAF4F0] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-[#221C1D]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-[#5C4F51] hover:bg-[#FAF4F0] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove item button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-[#9C8F92] hover:text-[#C85250] hover:bg-[#FAF2EE] rounded-lg transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. CUSTOMER & DELIVERY DETAILS DIRECTLY BELOW CART ITEMS (Requirements 86-107) */}
            <div className="bg-white rounded-2xl border border-[#EDE2DA] p-5 sm:p-6 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#221C1D]">
                Delivery Details
              </h2>

              {/* Full Name Field (Requirements 94) */}
              <div>
                <label htmlFor="cartFullName" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Full Name <span className="text-[#C85250]">*</span>
                </label>
                <input
                  id="cartFullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full bg-[#FAF6F2] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none focus:bg-white transition-colors ${
                    errors.fullName ? "border-[#E53E3E]" : "border-[#EDE0D6] focus:border-[#C85250]"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-[#E53E3E] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Delivery Address Field with Auto-Expanding Input (Requirements 95-98, 103-107) */}
              <div>
                <label htmlFor="cartAddress" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Delivery Address <span className="text-[#C85250]">*</span>
                  <span className="font-normal text-[#7A6D70] ml-1">
                    (Flat, Street, City, State, Pincode & Landmark)
                  </span>
                </label>
                <AutoExpandingTextarea
                  id="cartAddress"
                  required
                  value={formData.address}
                  onChange={(val) => {
                    setFormData({ ...formData, address: val });
                    if (errors.address) setErrors({ ...errors, address: undefined });
                  }}
                  minHeight={72}
                  maxHeight={180}
                  placeholder="e.g. Flat 402, Sunshine Heights, 4th Main Road, Kadapa, Andhra Pradesh - 516001 (Near Post Office)"
                  className={`bg-[#FAF6F2] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border focus:bg-white transition-colors ${
                    errors.address ? "border-[#E53E3E]" : "border-[#EDE0D6] focus:border-[#C85250]"
                  }`}
                />
                {errors.address && (
                  <p className="text-xs text-[#E53E3E] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 3. PERSISTENT FIXED BOTTOM ACTION SECTION (Requirements 73-78, 112-118, 139) */}
            <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#EFE4DC] py-3.5 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
              <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                {/* Final Total Amount (Item 112) */}
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#7A6D70] uppercase tracking-wider font-semibold">
                    Total Amount
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#221C1D]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Single Place Order CTA Button (Requirements 113, 114) */}
                <button
                  type="submit"
                  className="bg-[#C85250] hover:bg-[#B14140] text-white py-3.5 px-7 rounded-xl font-bold text-sm sm:text-base transition-transform active:scale-[0.98] shadow-md shadow-[#C85250]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Place Order</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Empty Cart State */
          <div className="py-16 text-center bg-white rounded-3xl border border-[#EDE2DA] p-8 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FAF0EC] text-[#C85250] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
              Your Cart is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6D70] mt-1.5 mb-6 max-w-xs mx-auto">
              Looks like you haven&apos;t added any personalized keepsakes to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#C85250] hover:bg-[#B14140] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-transform active:scale-95 shadow-sm cursor-pointer"
            >
              <span>Explore Gifts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
