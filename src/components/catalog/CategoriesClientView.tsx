"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useLiveCatalog } from "@/context/CatalogContext";
import { ProductImage } from "@/components/ui/ProductImage";

export function CategoriesClientView() {
  const { categories, occasions, recipients } = useLiveCatalog();

  return (
    <div>
      {/* Primary Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-16">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group bg-white rounded-xl border border-[#EDE2DA] overflow-hidden hover:border-[#C85250] transition-all hover:shadow-md flex flex-col text-center p-3 sm:p-4"
          >
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#FAF3EE] mb-3">
              <ProductImage
                slug={cat.slug}
                name={cat.name}
                categorySlug={cat.slug}
                image={cat.image}
                aspectRatio="square"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h2 className="font-semibold text-sm sm:text-base text-[#221C1D] group-hover:text-[#C85250] transition-colors line-clamp-1">
              {cat.name}
            </h2>
            <span className="text-xs text-[#8C7D80] mt-0.5">
              ({cat.productCount ?? 0} products)
            </span>
          </Link>
        ))}
      </div>

      {/* Shop by Occasion Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#EFE4DC]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
            Shop by Occasion
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {occasions.map((occ) => (
            <Link
              key={occ.slug}
              href={`/categories/${occ.slug}`}
              className="group p-3.5 bg-white rounded-xl border border-[#EDE2DA] hover:border-[#C85250] hover:bg-[#FAF4F0] transition-all flex flex-col justify-between"
            >
              <div>
                {occ.image && (
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-[#FAF0EA] mb-3 relative">
                    <Image
                      src={occ.image}
                      alt={occ.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-sm text-[#221C1D] group-hover:text-[#C85250] transition-colors">
                  {occ.name}
                </h3>
                <p className="text-[11px] text-[#7A6D70] mt-1 line-clamp-2">
                  {occ.description}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#C85250] font-medium">
                <span>Browse gifts</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Shop by Recipient Section */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#EFE4DC]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
            Shop by Recipient
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
          {recipients.map((rec) => (
            <Link
              key={rec.slug}
              href={`/categories/${rec.slug}`}
              className="group p-3.5 bg-white rounded-xl border border-[#EDE2DA] hover:border-[#C85250] hover:bg-[#FAF4F0] transition-all flex flex-col justify-between"
            >
              <div>
                {rec.image && (
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-[#FAF0EA] mb-3 relative">
                    <Image
                      src={rec.image}
                      alt={rec.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-sm text-[#221C1D] group-hover:text-[#C85250] transition-colors">
                  {rec.name}
                </h3>
                <p className="text-[11px] text-[#7A6D70] mt-1 line-clamp-2">
                  {rec.description}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#C85250] font-medium">
                <span>Browse gifts</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
