"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLiveCatalog } from "@/context/CatalogContext";

export function ShopByOccasion() {
  const { occasions } = useLiveCatalog();
  const displayOccasions = occasions.slice(0, 8);

  return (
    <section className="py-4 sm:py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
            Shop by Occasion
          </h2>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[#E8DFD8] bg-white text-[#221C1D] hover:bg-[#FAF5F1] hover:border-[#C85250]/40 hover:text-[#C85250] transition-colors shadow-2xs group"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#7A6D70] group-hover:text-[#C85250] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile App Style: Horizontal Scrollable Category Bubbles (Image 2 Mockup Style) */}
        <div className="flex sm:hidden overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory touch-pan-x">
          {displayOccasions.map((occ) => (
            <Link
              key={occ.slug}
              href={`/categories/${occ.slug}`}
              className="flex flex-col items-center group shrink-0 w-18 snap-start"
            >
              <div className="w-16 h-16 rounded-full bg-[#FAF0EA] border-2 border-[#EDE0D6] group-hover:border-[#C85250] overflow-hidden relative shadow-2xs transition-all duration-300 group-hover:scale-105 p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image
                    src={occ.image}
                    alt={occ.name}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <span className="mt-1.5 text-[11px] font-medium text-[#382E30] group-hover:text-[#C85250] transition-colors text-center line-clamp-1 w-full">
                {occ.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop Occasion Grid: 8 columns */}
        <div className="hidden sm:grid sm:grid-cols-8 gap-3 lg:gap-3.5">
          {displayOccasions.map((occ) => (
            <Link
              key={occ.slug}
              href={`/categories/${occ.slug}`}
              className="flex flex-col items-center group w-full"
            >
              <div className="w-full aspect-square rounded-xl bg-[#FAF0EA] border border-[#EDE0D6] group-hover:border-[#E8C2B3] overflow-hidden relative shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
                <Image
                  src={occ.image}
                  alt={occ.name}
                  fill
                  sizes="(max-width: 1024px) 20vw, 12vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="mt-2 text-xs sm:text-sm font-medium text-[#382E30] group-hover:text-[#C85250] transition-colors text-center line-clamp-1 w-full px-0.5">
                {occ.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
