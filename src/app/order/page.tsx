"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, AlertCircle, ArrowRight, MessageCircle, MapPin, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/ui/ProductImage";

interface FormErrors {
  fullName?: string;
  address?: string;
  general?: string;
}

export default function OrderPage() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    landmark: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [placedWhatsAppUrl, setPlacedWhatsAppUrl] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name (at least 2 characters).";
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = "Please enter your complete delivery address (at least 5 characters).";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setErrors({ general: "Your cart is empty. Please add gifts before placing an order." });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setErrors({});

    // Construct formatted WhatsApp order message
    const lines: string[] = [
      "🎁 *NEW ORDER REQUEST — GIFTLY*",
      "",
      "👤 *Customer Details:*",
      `• *Name:* ${formData.fullName.trim()}`,
      `• *Delivery Address:* ${formData.address.trim()}`,
    ];

    if (formData.landmark.trim()) {
      lines.push(`• *Landmark:* ${formData.landmark.trim()}`);
    }

    lines.push("", `📦 *Order Items (${items.reduce((s, i) => s + i.quantity, 0)}):*`);

    items.forEach((item, idx) => {
      lines.push(`${idx + 1}. *${item.product.name}*`);
      lines.push(`   • Qty: ${item.quantity} × ₹${item.price.toLocaleString("en-IN")} = ₹${(item.price * item.quantity).toLocaleString("en-IN")}`);
      if (item.selectedSize) {
        lines.push(`   • Size: ${item.selectedSize}`);
      }
      if (item.selectedFrameColor) {
        lines.push(`   • Frame: ${item.selectedFrameColor}`);
      }
      if (item.selectedMaterial) {
        lines.push(`   • Material: ${item.selectedMaterial}`);
      }
      if (item.customizationText) {
        lines.push(`   • Custom Notes: "${item.customizationText}"`);
      }
    });

    lines.push(
      "",
      "💰 *Price Breakdown:*",
      `• Subtotal: ₹${subtotal.toLocaleString("en-IN")}`,
      `• Delivery: ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}`,
      `• *Total Payable:* ₹${total.toLocaleString("en-IN")}`,
      "",
      "✨ Please confirm my order and let me know where to send photos for customization!"
    );

    const fullMessage = lines.join("\n");
    const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(fullMessage)}`;

    setPlacedWhatsAppUrl(whatsappUrl);
    clearCart();

    // Trigger WhatsApp in new tab/window
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank");
    }
  };

  // If order was submitted, show friendly WhatsApp dispatch view
  if (placedWhatsAppUrl) {
    return (
      <SiteLayout>
        <div className="py-16 pb-28 sm:py-24 text-center max-w-lg mx-auto px-4">
          <div className="w-16 h-16 bg-[#E8F5E9] text-[#128C7E] rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D]">
            Order Ready on WhatsApp!
          </h1>
          <p className="text-sm text-[#5C4F51] mt-3 leading-relaxed">
            Your customized order and delivery details have been prepared. Click below to send your message to our design team and submit your photos.
          </p>

          <div className="mt-8 space-y-3">
            <a
              href={placedWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#075E54] text-white py-3.5 px-6 rounded-xl font-semibold text-base transition-colors shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Order on WhatsApp</span>
            </a>

            <Link
              href="/shop"
              className="inline-block text-sm text-[#7A6D70] hover:text-[#C85250] font-medium pt-2 transition-colors"
            >
              Continue Browsing Gifts →
            </Link>
          </div>

          <div className="mt-10 p-4 bg-[#FAF4F0] rounded-xl border border-[#EDE2D8] text-xs text-[#6C5E61] space-y-1.5 text-left">
            <p className="font-semibold text-[#221C1D] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C85250]" />
              <span>What happens next?</span>
            </p>
            <p>1. Our coordinator will acknowledge your order on WhatsApp.</p>
            <p>2. You can send your high-resolution photos directly in the chat.</p>
            <p>3. We craft and dispatch your gift with express tracking!</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="py-16 pb-28 sm:py-20 text-center max-w-md mx-auto px-4">
          <h1 className="font-serif text-2xl font-bold text-[#221C1D]">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-[#7A6D70] mt-2 mb-6">
            Please add your favorite personalized items to the cart before checking out.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#C85250] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#B14140] transition-colors"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="pt-6 pb-28 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#7A6D70] mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#C85250] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9]" />
          <Link href="/cart" className="hover:text-[#C85250] transition-colors">
            Cart
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9]" />
          <span className="text-[#221C1D] font-medium">Place Order</span>
        </nav>

        <div className="pb-4 border-b border-[#EFE4DC] mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D]">
            Delivery Details
          </h1>
          <p className="text-xs sm:text-sm text-[#6C5E61] mt-1">
            Provide your name and delivery address. Your order will be sent directly via WhatsApp to our workshop team.
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-[#FDE8E8] border border-[#F8B4B4] rounded-xl flex items-center gap-3 text-sm text-[#9B1C1C]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleWhatsAppOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Fields: Name + Address (with Landmark) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-[#EDE2DA] p-5 sm:p-6 shadow-2xs space-y-5">
              <h2 className="font-serif text-lg font-bold text-[#221C1D] pb-2 border-b border-[#F0E6DE]">
                Customer & Delivery Information
              </h2>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Your Full Name <span className="text-[#C85250]">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none focus:bg-white ${
                    errors.fullName ? "border-[#E53E3E]" : "border-[#EDE0D6] focus:border-[#C85250]"
                  }`}
                />
                {errors.fullName && <p className="text-xs text-[#E53E3E] mt-1">{errors.fullName}</p>}
              </div>

              {/* Full Address */}
              <div>
                <label htmlFor="address" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Full Delivery Address (Flat, Street, City, State & PIN) <span className="text-[#C85250]">*</span>
                </label>
                <textarea
                  id="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat 402, Sunshine Heights, 4th Main Road, Kadapa, Andhra Pradesh - 516001"
                  className={`w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none focus:bg-white ${
                    errors.address ? "border-[#E53E3E]" : "border-[#EDE0D6] focus:border-[#C85250]"
                  }`}
                />
                {errors.address && <p className="text-xs text-[#E53E3E] mt-1">{errors.address}</p>}
              </div>

              {/* Landmark moved here */}
              <div>
                <label htmlFor="landmark" className="block text-xs font-semibold text-[#3C3234] mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C85250]" />
                  <span>Landmark / Nearby Location (Optional)</span>
                </label>
                <input
                  id="landmark"
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="e.g. Opposite Post Office, Near City Hospital"
                  className="w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border border-[#EDE0D6] focus:border-[#C85250] focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Photo upload notice */}
            <div className="bg-[#FAF4F0] p-4 rounded-2xl border border-[#EDE2D8] text-xs text-[#6C5E61] space-y-1">
              <p className="font-semibold text-[#221C1D] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C85250]" />
                <span>Zero hassle WhatsApp ordering</span>
              </p>
              <p>
                No payment gateway or account signup needed. You will send this order directly to our WhatsApp where our design coordinator will connect with you to review photo uploads and share digital proofs!
              </p>
            </div>
          </div>

          {/* Review & WhatsApp Submit Sidebar */}
          <div className="lg:col-span-5 space-y-4 sticky top-28">
            <div className="bg-white rounded-2xl border border-[#EDE2DA] p-6 shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#221C1D] pb-3 border-b border-[#EFE4DC]">
                Order Summary
              </h2>

              {/* Items summary */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#FAF3EE] shrink-0 border border-[#EDE0D6]">
                      <ProductImage
                        slug={item.product.slug}
                        name={item.product.name}
                        categorySlug={item.product.categorySlug}
                        aspectRatio="square"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#221C1D] truncate">{item.product.name}</p>
                      <p className="text-[11px] text-[#7A6D70]">
                        Qty: {item.quantity} {item.selectedSize && `· ${item.selectedSize}`}
                      </p>
                      {item.customizationText && (
                        <p className="text-[10px] text-[#C85250] truncate">
                          Custom: &ldquo;{item.customizationText}&rdquo;
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-[#221C1D]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#EFE4DC] space-y-2 text-sm">
                <div className="flex items-center justify-between text-[#5C4F51]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#221C1D]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-[#5C4F51]">
                  <span>Delivery</span>
                  <span className="font-medium text-[#1E7238]">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EFE4DC] flex items-center justify-between text-base font-bold text-[#221C1D]">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#C85250]">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Submit to WhatsApp Button */}
              <button
                type="submit"
                className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Confirm & Order on WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#7A6D70] pt-1">
                <Truck className="w-3.5 h-3.5 text-[#C85250]" />
                <span>All India Fast Delivery Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </SiteLayout>
  );
}
