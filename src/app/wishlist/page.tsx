"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/ui/ProductImage";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem, openQuickView } = useCart();

  const handleAddToCart = (product: (typeof items)[0]) => {
    addItem({
      product,
      selectedSize: product.sizes[0] || '8" × 10"',
      selectedFrameColor: product.frameColors[0]?.name || "Black",
      selectedMaterial: product.materials[0] || "Wood",
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <SiteLayout>
      <div className="pt-6 pb-28 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching screenshot */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE4DC] mb-6 sm:mb-8">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D]">
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6D70] mt-1">
              {items.length} {items.length === 1 ? "saved item" : "saved items"}
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs sm:text-sm font-semibold text-[#C85250] hover:text-[#B14140] hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-16 sm:py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FAF0EC] text-[#C85250] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6D70] mt-2 mb-6 leading-relaxed">
              Explore our collection of personalized frames, custom mugs, and keepsakes, and tap the heart icon to save your favorites!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#C85250] hover:bg-[#B14140] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-transform active:scale-95 shadow-md shadow-[#C85250]/20"
            >
              <span>Explore Gifts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#EDE2DA] p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                {/* Product Thumbnail */}
                <div
                  onClick={() => openQuickView(product)}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#FAF3EE] shrink-0 border border-[#EDE0D6] cursor-pointer"
                >
                  <ProductImage
                    slug={product.slug}
                    name={product.name}
                    categorySlug={product.categorySlug}
                    aspectRatio="square"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3
                    onClick={() => openQuickView(product)}
                    className="font-medium text-base sm:text-lg text-[#221C1D] hover:text-[#C85250] transition-colors cursor-pointer truncate"
                  >
                    {product.name}
                  </h3>

                  <div className="mt-1 flex items-center justify-center sm:justify-start gap-2.5">
                    <span className="text-base sm:text-lg font-bold text-[#C85250]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-xs sm:text-sm text-[#9C8F92] line-through">
                        ₹{product.compareAtPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#7A6D70] mt-1 line-clamp-1">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#FAF0EC] hover:bg-[#C85250] text-[#C85250] hover:text-white border border-[#F2DDD5] hover:border-[#C85250] px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    className="p-2.5 text-[#8C7D80] hover:text-[#C85250] hover:bg-[#FAF2EE] rounded-xl transition-colors cursor-pointer"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
