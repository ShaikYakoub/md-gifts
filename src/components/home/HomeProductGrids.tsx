"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useLiveCatalog } from "@/context/CatalogContext";
import { ShopByRecipient } from "@/components/home/ShopByRecipient";
import { ExploreCollections } from "@/components/home/ExploreCollections";

interface HomeProductGridsProps {
  initialTrending: Product[];
  initialFavourites: Product[];
  initialUnder499: Product[];
}

export function HomeProductGrids({
  initialTrending,
  initialFavourites,
  initialUnder499,
}: HomeProductGridsProps) {
  const {
    getTrendingProducts,
    getPersonalizedFavourites,
    getUnder499Products,
    products,
  } = useLiveCatalog();

  const trendingProducts = useMemo(() => {
    if (!products || products.length === 0) return initialTrending;
    const live = getTrendingProducts();
    return live.length > 0 ? live : initialTrending;
  }, [products, getTrendingProducts, initialTrending]);

  const personalizedFavourites = useMemo(() => {
    if (!products || products.length === 0) return initialFavourites;
    const live = getPersonalizedFavourites();
    return live.length > 0 ? live : initialFavourites;
  }, [products, getPersonalizedFavourites, initialFavourites]);

  const under499Products = useMemo(() => {
    if (!products || products.length === 0) return initialUnder499;
    const live = getUnder499Products();
    return live.length > 0 ? live : initialUnder499;
  }, [products, getUnder499Products, initialUnder499]);

  return (
    <>
      {/* 3. Trending Gifts */}
      <section className="py-5 sm:py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
                Trending Gifts
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[#E8DFD8] bg-white text-[#221C1D] hover:bg-[#FAF5F1] hover:border-[#C85250]/40 hover:text-[#C85250] transition-colors shadow-2xs group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7A6D70] group-hover:text-[#C85250] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 overflow-x-auto pb-3 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {trendingProducts.map((product, idx) => (
              <div key={product.id} className="w-[68vw] xs:w-[54vw] sm:w-auto shrink-0 flex flex-col">
                <ProductCard product={product} priority={idx < 4} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Shop by Recipient */}
      <ShopByRecipient />

      {/* 5. Personalized Favourites */}
      <section className="py-5 sm:py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
                Personalized Favourites
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6D70] mt-0.5">
                Custom engraved portraits & glowing night lights
              </p>
            </div>
            <Link
              href="/categories/personalized-gifts"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[#E8DFD8] bg-white text-[#221C1D] hover:bg-[#FAF5F1] hover:border-[#C85250]/40 hover:text-[#C85250] transition-colors shadow-2xs group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7A6D70] group-hover:text-[#C85250] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-3 gap-3.5 sm:gap-6 overflow-x-auto pb-3 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {personalizedFavourites.map((product) => (
              <div key={product.id} className="w-[68vw] xs:w-[54vw] sm:w-auto shrink-0 flex flex-col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Under ₹499 Section */}
      <section className="py-5 sm:py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
                Under ₹499
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6D70] mt-0.5">
                Thoughtful and budget-friendly custom keepsakes
              </p>
            </div>
            <Link
              href="/shop?maxPrice=499"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[#E8DFD8] bg-white text-[#221C1D] hover:bg-[#FAF5F1] hover:border-[#C85250]/40 hover:text-[#C85250] transition-colors shadow-2xs group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7A6D70] group-hover:text-[#C85250] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-3 gap-3.5 sm:gap-6 overflow-x-auto pb-3 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {under499Products.map((product) => (
              <div key={product.id} className="w-[68vw] xs:w-[54vw] sm:w-auto shrink-0 flex flex-col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Explore Collections Banners */}
      <ExploreCollections />
    </>
  );
}
