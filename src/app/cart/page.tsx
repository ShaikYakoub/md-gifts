"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Store,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/ui/ProductImage";
import { AutoExpandingTextarea } from "@/components/ui/AutoExpandingTextarea";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { GoogleMapsLogo } from "@/components/ui/GoogleMapsLogo";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/lib/siteConfig";

interface FormErrors {
  fullName?: string;
  address?: string;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalQuantity } =
    useCart();

  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">("delivery");
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

    if (fulfillmentType === "delivery") {
      if (!formData.address.trim() || formData.address.trim().length < 5) {
        errs.address =
          "Please enter your complete address including Flat, Street, City, State & Pincode.";
      }
    }

    setErrors(errs);

    if (errs.fullName) {
      const el = document.getElementById("cartFullName");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    } else if (errs.address && fulfillmentType === "delivery") {
      const el = document.getElementById("cartAddress");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    }

    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    if (!validateForm()) {
      return;
    }

    // Build the complete WhatsApp order message (Requirements 115-118)
    const formattedAddress =
      fulfillmentType === "pickup"
        ? `Store Pickup (${SITE_CONFIG.fullName}, ${SITE_CONFIG.address.streetDisplay}, ${SITE_CONFIG.address.city})`
        : formData.address;

    const whatsappUrl = buildOrderWhatsAppUrl({
      fullName: formData.fullName,
      address: formattedAddress,
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
              className="inline-block text-sm text-[#7A6D70] hover:text-[#EC0B12] font-medium pt-2 transition-colors cursor-pointer"
            >
              Continue Browsing Gifts →
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Empty Cart State: Centered cleanly with big bag icon, text, and button (no card or subtitles)
  if (items.length === 0) {
    return (
      <SiteLayout showFooter={false}>
        <div className="min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center text-center px-4 py-8">
          <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-[#EC0B12] stroke-[1.6] mb-5" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight mb-5">
            Your Cart is Empty
          </h1>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#EC0B12] hover:bg-[#D0080E] text-white px-7 py-3 rounded-xl font-semibold text-sm transition-transform active:scale-95 shadow-sm cursor-pointer"
          >
            <span>Explore Gifts</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout showFooter={false}>
      <div className="pt-4 pb-24 sm:pt-10 sm:pb-24 max-w-3xl mx-auto px-0 sm:px-6">
        {/* Cart Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#EDE2DA] mb-0 sm:mb-6 px-4 sm:px-0">
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#221C1D] tracking-tight">
              Your Cart
            </h1>
            <span className="text-sm font-medium text-[#7A6D70]">
              ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
            </span>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-[#EC0B12] hover:underline cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        <form noValidate onSubmit={handlePlaceOrder} className="space-y-0 sm:space-y-6">
            {/* 1. CART ITEMS - Contiguous full-width with dividers, touching the line below Your Cart with NO gap */}
            <div className="bg-white border-b sm:border border-[#EDE2DA] rounded-b-2xl sm:rounded-2xl divide-y divide-[#EDE2DA] overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white p-3.5 sm:p-5 flex gap-3.5 sm:gap-4 items-stretch"
                >
                  {/* Delete button on top right of the card - Red */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 p-1.5 text-[#EC0B12] hover:text-[#B9080E] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                    aria-label={`Remove ${item.product.name} from cart`}
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                  </button>

                  {/* Thumbnail - Zero padding, easily visible illustration/photo */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#FAF5F0] shrink-0 border border-[#EDE2DA] p-0 relative self-center">
                    <ProductImage
                      slug={item.product.slug}
                      name={item.product.name}
                      categorySlug={item.product.categorySlug}
                      image={item.product.images?.[0]}
                      aspectRatio="square"
                      noPadding
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details - Spanning height of image with good vertical spacing */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    {/* Top Group: Title & Specs (padded right to leave room for delete button) */}
                    <div className="pr-7 sm:pr-8">
                      <h3 className="font-bold text-base sm:text-lg text-[#221C1D] truncate leading-tight mb-2 sm:mb-2.5">
                        {item.product.name}
                      </h3>

                      {/* Variant specs */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#7A6D70]">
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
                        <p className="text-[11px] text-[#EC0B12] bg-[#FEF2F2] px-2 py-0.5 rounded mt-2 truncate max-w-xs font-medium">
                          Custom: &ldquo;{item.customizationText}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Bottom Group: Bigger Price and Quantity Controls aligned to right edge */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <span className="font-extrabold text-base sm:text-lg text-[#221C1D]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>

                      {/* Quantity Counter with green + and - and default background/border */}
                      <div className="flex items-center h-8 sm:h-8.5 border border-[#D5C7BC] rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-full px-2.5 flex items-center justify-center text-[#16A34A] hover:bg-[#F0FDF4] active:bg-[#DCFCE7] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <span className="w-6 sm:w-7 h-full text-center text-xs sm:text-sm font-bold text-[#221C1D] tabular-nums inline-flex items-center justify-center shrink-0">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={item.quantity >= 99}
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-full px-2.5 flex items-center justify-center text-[#16A34A] hover:bg-[#F0FDF4] active:bg-[#DCFCE7] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. FULFILLMENT TOGGLE - Delivery vs Store Pickup (Smooth Sliding Indicator) */}
            <div className="relative mt-3.5 sm:mt-6 bg-[#FAF5F0] p-1 rounded-2xl border border-[#EDE2DA] flex select-none">
              {/* Smooth Animated Sliding Indicator Pill */}
              <div
                aria-hidden="true"
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-xs border border-[#EDE2DA]/80 transition-transform duration-300 ease-out pointer-events-none will-change-transform ${
                  fulfillmentType === "pickup" ? "translate-x-full" : "translate-x-0"
                }`}
              />

              <button
                type="button"
                onClick={() => setFulfillmentType("delivery")}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer ${
                  fulfillmentType === "delivery"
                    ? "text-[#221C1D]"
                    : "text-[#7A6D70] hover:text-[#221C1D]"
                }`}
              >
                <Truck
                  className={`w-4 h-4 transition-colors duration-200 ${
                    fulfillmentType === "delivery" ? "text-[#EC0B12]" : "text-[#7A6D70]"
                  }`}
                />
                <span>Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType("pickup")}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer ${
                  fulfillmentType === "pickup"
                    ? "text-[#221C1D]"
                    : "text-[#7A6D70] hover:text-[#221C1D]"
                }`}
              >
                <Store
                  className={`w-4 h-4 transition-colors duration-200 ${
                    fulfillmentType === "pickup" ? "text-[#0194A3]" : "text-[#7A6D70]"
                  }`}
                />
                <span>Pickup</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0194A3] bg-[#E6F7F9] px-2 py-0.5 rounded-full shrink-0">
                  Free
                </span>
              </button>
            </div>

            {/* 3. CONDITIONALLY DISPLAYED FULFILLMENT CARD */}
            {fulfillmentType === "delivery" ? (
              /* DELIVERY DETAILS CARD */
              <div className="mt-2.5 sm:mt-3 bg-white border border-[#EDE2DA] rounded-2xl p-4 sm:p-6 space-y-4 animate-fade-in">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D] tracking-tight">
                  Delivery Details
                </h2>

                {/* Full Name Field (Requirements 94) */}
                <div>
                  <label htmlFor="cartFullName" className="block text-xs font-semibold text-[#3C3234] mb-1">
                    Full Name <span className="text-[#EC0B12]">*</span>
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
                    className={`w-full bg-[#FAF6F2] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none focus:bg-white transition-all ${
                      errors.fullName
                        ? "border-[#EC0B12] ring-2 ring-[#EC0B12]/20 bg-[#FFF5F5]"
                        : "border-[#EDE0D6] focus:border-[#EC0B12]"
                    }`}
                  />
                  {errors.fullName && (
                    <div className="animate-fade-in relative mt-2 inline-flex items-center gap-1.5 bg-[#EC0B12] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md">
                      <div className="absolute -top-1 left-4 w-2 h-2 bg-[#EC0B12] rotate-45" />
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-white" />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                {/* Delivery Address Field with Auto-Expanding Input (Requirements 95-98, 103-107) */}
                <div>
                  <label htmlFor="cartAddress" className="block text-xs font-semibold text-[#3C3234] mb-1">
                    Address <span className="text-[#EC0B12]">*</span>
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
                    placeholder="e.g. 3/511, Raja Reddy Street, Opp Krupa Church, Kadapa, Andhra Pradesh - 516001"
                    className={`bg-[#FAF6F2] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border focus:bg-white transition-all ${
                      errors.address
                        ? "border-[#EC0B12] ring-2 ring-[#EC0B12]/20 bg-[#FFF5F5]"
                        : "border-[#EDE0D6] focus:border-[#EC0B12]"
                    }`}
                  />
                  {errors.address && (
                    <div className="animate-fade-in relative mt-2 inline-flex items-center gap-1.5 bg-[#EC0B12] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md">
                      <div className="absolute -top-1 left-4 w-2 h-2 bg-[#EC0B12] rotate-45" />
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-white" />
                      <span>{errors.address}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* STORE PICKUP DETAILS CARD */
              <div className="mt-2.5 sm:mt-3 bg-white border border-[#EDE2DA] rounded-2xl p-4 sm:p-6 space-y-4 animate-fade-in">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D] tracking-tight">
                    Pickup Address
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A6D70] mt-0.5">
                    Self-pickup available from our workshop in Kadapa
                  </p>
                </div>

                {/* Full Name Field for Pickup */}
                <div>
                  <label htmlFor="cartFullName" className="block text-xs font-semibold text-[#3C3234] mb-1">
                    Full Name <span className="text-[#EC0B12]">*</span>
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
                    className={`w-full bg-[#FAF6F2] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none focus:bg-white transition-all ${
                      errors.fullName
                        ? "border-[#EC0B12] ring-2 ring-[#EC0B12]/20 bg-[#FFF5F5]"
                        : "border-[#EDE0D6] focus:border-[#EC0B12]"
                    }`}
                  />
                  {errors.fullName && (
                    <div className="animate-fade-in relative mt-2 inline-flex items-center gap-1.5 bg-[#EC0B12] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md">
                      <div className="absolute -top-1 left-4 w-2 h-2 bg-[#EC0B12] rotate-45" />
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-white" />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                {/* Direct Store Location & Hours */}
                <div className="space-y-1 pt-2 border-t border-[#EDE2DA]/70">
                  <p className="text-xs sm:text-sm font-semibold text-[#221C1D]">
                    {SITE_CONFIG.fullName}
                  </p>
                  <p className="text-xs sm:text-sm text-[#5C4F51] leading-relaxed">
                    {SITE_CONFIG.address.formatted}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#7A6D70]">
                    Store Hours: Mon – Sat, 9:30 AM – 8:30 PM IST
                  </p>
                </div>

                <div className="pt-1">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${SITE_CONFIG.fullName}, ${SITE_CONFIG.address.formatted}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#FEF2F2] border border-[#EC0B12] text-xs font-semibold text-[#EC0B12] transition-colors shadow-2xs cursor-pointer"
                  >
                    <GoogleMapsLogo className="w-4.5 h-4.5 shrink-0 object-contain" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            )}

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
                  className="btn-lit-red text-white py-3.5 px-7 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PackageCheck className="w-5 h-5 stroke-[2.2]" />
                  <span>Place Order</span>
                </button>
              </div>
            </div>
          </form>
      </div>
    </SiteLayout>
  );
}
