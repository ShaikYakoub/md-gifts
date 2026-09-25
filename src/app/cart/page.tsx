"use client";

import React from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/ui/ProductImage";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, total, totalQuantity } =
    useCart();

  return (
    <SiteLayout>
      <div className="pt-6 pb-28 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cart Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE4DC] mb-6">
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D]">
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
              className="text-xs font-semibold text-[#C85250] hover:underline"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List (Left/Main Column) */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#EDE2DA] p-4 flex gap-4 items-center shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FAF3EE] shrink-0 border border-[#F0E4DC]">
                    <ProductImage
                      slug={item.product.slug}
                      name={item.product.name}
                      categorySlug={item.product.categorySlug}
                      aspectRatio="square"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-[#221C1D] truncate">
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

                    {/* Price and Quantity */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold text-sm sm:text-base text-[#221C1D]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#E0D5CC] rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 text-[#5C4F51] hover:bg-[#FAF4F0] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#221C1D]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 text-[#5C4F51] hover:bg-[#FAF4F0] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove item button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-[#9C8F92] hover:text-[#C85250] hover:bg-[#FAF2EE] rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Box (Right Column) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EDE2DA] p-6 shadow-sm sticky top-28">
              <h2 className="font-serif text-lg font-bold text-[#221C1D] pb-3 border-b border-[#EFE4DC]">
                Order Summary
              </h2>

              <div className="py-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between text-[#5C4F51]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#221C1D]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#5C4F51]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#C85250]" />
                    <span>Delivery</span>
                  </span>
                  <span className="font-medium text-[#1E7238]">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                {deliveryFee > 0 && (
                  <p className="text-[11px] text-[#C85250]">
                    Add ₹{(999 - subtotal).toLocaleString("en-IN")} more to qualify for Free Delivery!
                  </p>
                )}

                <div className="pt-3 border-t border-[#EFE4DC] flex items-center justify-between text-base font-bold text-[#221C1D]">
                  <span>Total</span>
                  <span className="text-xl text-[#C85250]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <Link
                href="/order"
                className="w-full bg-[#C85250] hover:bg-[#B14140] text-white py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
              >
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Business Note */}
              <p className="mt-4 text-center text-xs text-[#7A6D70] leading-relaxed">
                You will be contacted by our team via WhatsApp/Call to confirm your order details and photos.
              </p>

              {/* Trust assurances */}
              <div className="mt-6 pt-4 border-t border-[#F0E6DE] flex items-center justify-center gap-4 text-[11px] text-[#7A6D70]">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C85250]" />
                  <span>100% Quality Checked</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#C85250]" />
                  <span>Safe All-India Shipping</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="py-16 pb-28 sm:py-20 text-center bg-white rounded-3xl border border-[#EDE2DA] p-8 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FAF0EC] text-[#C85250] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
              Your Cart is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6D70] mt-1.5 mb-6 max-w-xs mx-auto">
              Looks like you haven&apos;t added any personalized keepsakes to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#C85250] hover:bg-[#B14140] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-transform active:scale-95 shadow-sm"
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
