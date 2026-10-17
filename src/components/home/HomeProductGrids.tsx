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
  initialBestSellers?: Product[];
  initialUnder499?: Product[];
}

export function HomeProductGrids({
  initialTrending,
  initialBestSellers = [],
  initialUnder499 = [],
}: HomeProductGridsProps) {
  const {
    getTrendingProducts,
    getBestSellerProducts,
    getUnder499Products,
    products,
  } = useLiveCatalog();

  const trendingProducts = useMemo(() => {
    if (!products || products.length === 0) return initialTrending;
    const live = getTrendingProducts();
    return live.length > 0 ? live : initialTrending;
  }, [products, getTrendingProducts, initialTrending]);

  const bestSellerProducts = useMemo(() => {
    if (!products || products.length === 0) return initialBestSellers;
    const live = getBestSellerProducts();
    return live.length > 0 ? live : initialBestSellers;
  }, [products, getBestSellerProducts, initialBestSellers]);

  const under499Products = useMemo(() => {
    if (!products || products.length === 0) return initialUnder499;
    const live = getUnder499Products();
    return live.length > 0 ? live : initialUnder499;
  }, [products, getUnder499Products, initialUnder499]);

  return (
    <>
      {/* 3. Trending Gifts */}
      <section className="py-5 sm:py-8 lg:py-10 bg-transparent">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-7">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-[#221C1D] tracking-tight">
                Trending Gifts
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold border border-[#E8DFD8] bg-white text-[#221C1D] hover:bg-[#FAF5F1] hover:border-[#EC0B12]/40 hover:text-[#EC0B12] transition-colors shadow-2xs group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#7A6D70] group-hover:text-[#EC0B12] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 overflow-x-auto pb-3 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {trendingProducts.map((product, idx) => (
              <div key={product.id} className="w-[calc(50vw-20px)] sm:w-auto shrink-0 flex flex-col">
                <ProductCard product={product} priority={idx < 4} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Shop by Recipient */}
      <ShopByRecipient />

      {/* 5. Best Sellers */}
      <section className="py-5 sm:py-8 lg:py-10 bg-transparent">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-7">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-[#221C1D] tracking-tight">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold border border-[#E8DFD8] bg-white text-[#221C1D] hover:bg-[#FAF5F1] hover:border-[#EC0B12]/40 hover:text-[#EC0B12] transition-colors shadow-2xs group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#7A6D70] group-hover:text-[#EC0B12] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 overflow-x-auto pb-3 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {bestSellerProducts.map((product) => (
              <div key={product.id} className="w-[calc(50vw-20px)] sm:w-auto shrink-0 flex flex-col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Under ₹499 */}
      <section className="py-5 sm:py-8 lg:py-10 bg-transparent">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-7">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-[#221C1D] tracking-tight">
                Under ₹499
              </h2>
            </div>
            <Link
              href="/shop?maxPrice=499"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold border border-[#E8DFD8] bg-white text-[#221C1D] hover:bg-[#FAF5F1] hover:border-[#EC0B12]/40 hover:text-[#EC0B12] transition-colors shadow-2xs group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#7A6D70] group-hover:text-[#EC0B12] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 overflow-x-auto pb-3 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {under499Products.map((product) => (
              <div key={product.id} className="w-[calc(50vw-20px)] sm:w-auto shrink-0 flex flex-col">
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
