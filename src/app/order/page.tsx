"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/ui/ProductImage";

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  general?: string;
}

export default function OrderPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    customizationNotes: "",
    orderNotes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate on client before posting
  const validateForm = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name (at least 2 characters).";
    }

    const cleanPhone = formData.phoneNumber.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phoneNumber = "Please enter a valid 10-digit mobile number.";
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = "Please enter your full delivery address.";
    }

    if (!formData.city.trim()) {
      errs.city = "Please enter your city.";
    }

    if (!formData.state.trim()) {
      errs.state = "Please enter your state.";
    }

    if (!formData.pincode.trim() || !/^[1-9][0-9]{5}$/.test(formData.pincode.trim())) {
      errs.pincode = "Please enter a valid 6-digit PIN code.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setErrors({ general: "Your cart is empty. Please add items before placing an order." });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        customizationNotes: formData.customizationNotes.trim() || undefined,
        orderNotes: formData.orderNotes.trim() || undefined,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          selectedSize: i.selectedSize,
          selectedFrameColor: i.selectedFrameColor,
          selectedMaterial: i.selectedMaterial,
          customizationText: i.customizationText,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await res.json()) as {
        success: boolean;
        orderId: string;
        error?: string;
      };

      if (res.ok && result.success) {
        clearCart();
        router.push(`/order/success?id=${encodeURIComponent(result.orderId)}`);
      } else {
        setErrors({
          general: result.error || "Failed to place order. Please review your details and try again.",
        });
      }
    } catch {
      setErrors({ general: "An unexpected network error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Order Details & Delivery
          </h1>
          <p className="text-xs sm:text-sm text-[#6C5E61] mt-1">
            Provide your contact and address information. No online payment required now — our team will contact you to confirm customization.
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-[#FDE8E8] border border-[#F8B4B4] rounded-xl flex items-center gap-3 text-sm text-[#9B1C1C]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Fields Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl border border-[#EDE2DA] p-5 sm:p-6 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#221C1D] pb-2 border-b border-[#F0E6DE]">
                1. Contact Information
              </h2>

              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Full Name <span className="text-[#C85250]">*</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-xs font-semibold text-[#3C3234] mb-1">
                    Phone Number (WhatsApp) <span className="text-[#C85250]">*</span>
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className={`w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none focus:bg-white ${
                      errors.phoneNumber ? "border-[#E53E3E]" : "border-[#EDE0D6] focus:border-[#C85250]"
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-xs text-[#E53E3E] mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#3C3234] mb-1">
                    Email Address <span className="text-[#8F8385] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className={`w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none focus:bg-white ${
                      errors.email ? "border-[#E53E3E]" : "border-[#EDE0D6] focus:border-[#C85250]"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-[#E53E3E] mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-[#EDE2DA] p-5 sm:p-6 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#221C1D] pb-2 border-b border-[#F0E6DE]">
                2. Delivery Address
              </h2>

              <div>
                <label htmlFor="address" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  House / Flat / Street Address <span className="text-[#C85250]">*</span>
                </label>
                <textarea
                  id="address"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat 402, Sunshine Heights, Main Road..."
                  className={`w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none focus:bg-white ${
                    errors.address ? "border-[#E53E3E]" : "border-[#EDE0D6] focus:border-[#C85250]"
                  }`}
                />
                {errors.address && <p className="text-xs text-[#E53E3E] mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-xs font-semibold text-[#3C3234] mb-1">
                    City <span className="text-[#C85250]">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Kadapa"
                    className={`w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none focus:bg-white ${
                      errors.city ? "border-[#E53E3E]" : "border-[#EDE0D6] focus:border-[#C85250]"
                    }`}
                  />
                  {errors.city && <p className="text-xs text-[#E53E3E] mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="state" className="block text-xs font-semibold text-[#3C3234] mb-1">
                    State <span className="text-[#C85250]">*</span>
                  </label>
                  <input
                    id="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Andhra Pradesh"
                    className={`w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none focus:bg-white ${
                      errors.state ? "border-[#E53E3E]" : "border-[#EDE0D6] focus:border-[#C85250]"
                    }`}
                  />
                  {errors.state && <p className="text-xs text-[#E53E3E] mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-xs font-semibold text-[#3C3234] mb-1">
                    PIN Code <span className="text-[#C85250]">*</span>
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="516001"
                    className={`w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none focus:bg-white ${
                      errors.pincode ? "border-[#E53E3E]" : "border-[#EDE0D6] focus:border-[#C85250]"
                    }`}
                  />
                  {errors.pincode && <p className="text-xs text-[#E53E3E] mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Customization & Order Notes */}
            <div className="bg-white rounded-2xl border border-[#EDE2DA] p-5 sm:p-6 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#221C1D] pb-2 border-b border-[#F0E6DE]">
                3. Customization & Order Notes
              </h2>

              <div>
                <label htmlFor="customizationNotes" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Names, Dates, or Text to print on your gifts
                </label>
                <textarea
                  id="customizationNotes"
                  rows={2}
                  value={formData.customizationNotes}
                  onChange={(e) => setFormData({ ...formData, customizationNotes: e.target.value })}
                  placeholder="e.g. For Couple Frame: Rahul & Priya, Anniversary 14 Feb 2023..."
                  className="w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border border-[#EDE0D6] focus:border-[#C85250] focus:bg-white outline-none"
                />
                <p className="text-[11px] text-[#7A6D70] mt-1">
                  * You don&apos;t have to worry about uploading large photos now. Our design coordinator will connect with you on WhatsApp to collect high-resolution photos!
                </p>
              </div>

              <div>
                <label htmlFor="orderNotes" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Delivery instructions or Landmark (Optional)
                </label>
                <input
                  id="orderNotes"
                  type="text"
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                  placeholder="Near Hanuman Temple, Call before arriving..."
                  className="w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border border-[#EDE0D6] focus:border-[#C85250] focus:bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Review & Submit Sidebar */}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C85250] hover:bg-[#B14140] disabled:bg-[#DE9391] text-white py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="bg-[#FAF4F0] p-3 rounded-xl border border-[#EDE2D8] text-[11px] text-[#6C5E61] space-y-1">
                <p className="font-semibold text-[#221C1D] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C85250]" />
                  <span>No payment gateway required</span>
                </p>
                <p>
                  We verify your photo customizations on WhatsApp before crafting. You will receive an immediate confirmation with your Order ID.
                </p>
              </div>

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
