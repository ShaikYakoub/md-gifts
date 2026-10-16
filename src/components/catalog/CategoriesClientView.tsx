"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLiveCatalog } from "@/context/CatalogContext";
import { ProductImage } from "@/components/ui/ProductImage";

export function CategoriesClientView() {
  const { categories, occasions, recipients } = useLiveCatalog();

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Shop by Category Section */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-2 border-b border-[#EFE4DC]">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 lg:gap-3.5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center group w-full"
            >
              <div className="w-full aspect-square rounded-lg sm:rounded-xl bg-[#FEF2F2] border border-[#EDE0D6] overflow-hidden relative shadow-sm [isolation:isolate]">
                <div className="w-full h-full transform-gpu will-change-transform [backface-visibility:hidden] transition-transform duration-200 ease-out group-hover:scale-[1.04]">
                  <ProductImage
                    slug={cat.slug}
                    name={cat.name}
                    categorySlug={cat.slug}
                    image={cat.image}
                    aspectRatio="square"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <span
                className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-[#382E30] text-center truncate w-full px-0.5"
                title={cat.name}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop by Occasion Section */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-2 border-b border-[#EFE4DC]">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
            Shop by Occasion
          </h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 lg:gap-3.5">
          {occasions.map((occ) => (
            <Link
              key={occ.slug}
              href={`/categories/${occ.slug}`}
              className="flex flex-col items-center group w-full"
            >
              <div className="w-full aspect-square rounded-lg sm:rounded-xl bg-[#FEF2F2] border border-[#EDE0D6] overflow-hidden relative shadow-sm [isolation:isolate]">
                <div className="w-full h-full relative transform-gpu will-change-transform [backface-visibility:hidden] transition-transform duration-200 ease-out group-hover:scale-[1.04]">
                  {occ.image ? (
                    <Image
                      src={occ.image}
                      alt={occ.name}
                      fill
                      sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 12vw"
                      className="object-cover [backface-visibility:hidden]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#FEF2F2] text-xs font-semibold text-[#8C7D80]">
                      {occ.name}
                    </div>
                  )}
                </div>
              </div>
              <span
                className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-[#382E30] text-center truncate w-full px-0.5"
                title={occ.name}
              >
                {occ.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop by Recipient Section */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-2 border-b border-[#EFE4DC]">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
            Shop by Recipient
          </h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 lg:gap-3.5">
          {recipients.map((rec) => (
            <Link
              key={rec.slug}
              href={`/categories/${rec.slug}`}
              className="flex flex-col items-center group w-full"
            >
              <div className="w-full aspect-square rounded-lg sm:rounded-xl bg-[#FEF2F2] border border-[#EDE0D6] overflow-hidden relative shadow-sm [isolation:isolate]">
                <div className="w-full h-full relative transform-gpu will-change-transform [backface-visibility:hidden] transition-transform duration-200 ease-out group-hover:scale-[1.04]">
                  {rec.image ? (
                    <Image
                      src={rec.image}
                      alt={rec.name}
                      fill
                      sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 12vw"
                      className="object-cover [backface-visibility:hidden]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#FEF2F2] text-xs font-semibold text-[#8C7D80]">
                      {rec.name}
                    </div>
                  )}
                </div>
              </div>
              <span
                className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-[#382E30] text-center truncate w-full px-0.5"
                title={rec.name}
              >
                {rec.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
