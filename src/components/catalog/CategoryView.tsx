"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Product, FilterState } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { useLiveCatalog } from "@/context/CatalogContext";

interface CategoryViewProps {
  title: string;
  description: string;
  breadcrumbLabel: string;
  initialProducts: Product[];
  categorySlug?: string;
  taxonomyType?: "category" | "occasion" | "recipient";
}

export function CategoryView({
  title,
  description,
  breadcrumbLabel,
  initialProducts,
  categorySlug,
  taxonomyType = "category",
}: CategoryViewProps) {
  const {
    products: liveProducts,
    getProductsByCategory,
    getProductsByOccasion,
    getProductsByRecipient,
  } = useLiveCatalog();

  const [isFilterOpenMobile, setIsFilterOpenMobile] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 5000,
    sizes: [],
    colors: [],
    materials: [],
    frameColors: [],
    sort: "featured",
  });

  const baseProductList = useMemo(() => {
    if (!liveProducts || liveProducts.length === 0) return initialProducts;
    if (categorySlug) {
      if (taxonomyType === "occasion") return getProductsByOccasion(categorySlug);
      if (taxonomyType === "recipient") return getProductsByRecipient(categorySlug);
      return getProductsByCategory(categorySlug);
    }
    if (breadcrumbLabel === "All Gifts") {
      return liveProducts;
    }
    return initialProducts;
  }, [
    liveProducts,
    categorySlug,
    taxonomyType,
    breadcrumbLabel,
    initialProducts,
    getProductsByCategory,
    getProductsByOccasion,
    getProductsByRecipient,
  ]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return baseProductList
      .filter((p) => {
        // Price filter
        if (filterState.maxPrice && p.price > filterState.maxPrice) {
          return false;
        }
        // Size filter
        if (filterState.sizes.length > 0) {
          const matchesSize = filterState.sizes.some((sizeFilter) => {
            if (sizeFilter === "small") {
              return p.sizes?.some((s) => s.includes("8") || s.includes("6") || s.includes("4"));
            }
            if (sizeFilter === "medium") {
              return p.sizes?.some((s) => s.includes("10") || s.includes("12"));
            }
            if (sizeFilter === "large") {
              return p.sizes?.some((s) => s.includes("18") || s.includes("24"));
            }
            return false;
          });
          if (!matchesSize) return false;
        }
        // Color filter
        if (filterState.colors.length > 0) {
          const hasColor = p.frameColors?.some((fc) =>
            filterState.colors.includes(fc.name)
          );
          if (!hasColor) return false;
        }
        // Material filter
        if (filterState.materials.length > 0) {
          const hasMat = p.materials?.some((m) =>
            filterState.materials.includes(m)
          );
          if (!hasMat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filterState.sort === "price-asc") return a.price - b.price;
        if (filterState.sort === "price-desc") return b.price - a.price;
        if (filterState.sort === "rating") return b.rating - a.rating;
        return 0; // featured/default
      });
  }, [initialProducts, filterState]);

  return (
    <div className="pt-6 pb-28 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#7A6D70] mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#C85250] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9]" />
        <Link href="/categories" className="hover:text-[#C85250] transition-colors">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9]" />
        <span className="text-[#221C1D] font-medium">{breadcrumbLabel}</span>
      </nav>

      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EFE4DC] mb-8">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#221C1D] tracking-tight">
              {title}
            </h1>
            <span className="text-xs sm:text-sm font-medium text-[#7A6D70]">
              ({filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"})
            </span>
          </div>
          <p className="mt-1 text-xs text-[#7A6D70] max-w-xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterOpenMobile(true)}
            className="lg:hidden flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 sm:py-2 bg-white border border-[#DDCFC6] hover:border-[#BDB0A8] rounded-full text-[#3E3234] shadow-2xs cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C85250]" />
            <span>Filter</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#7A6D70] hidden sm:inline font-normal">Sort by:</span>
            <div className="relative inline-flex items-center">
              <select
                value={filterState.sort}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    sort: e.target.value as FilterState["sort"],
                  }))
                }
                aria-label="Sort products by"
                className="appearance-none bg-white border border-[#DDCFC6] hover:border-[#BDB0A8] focus:border-[#BDB0A8] focus:ring-1 focus:ring-[#BDB0A8]/20 text-[#221C1D] rounded-full pl-3.5 pr-8 py-1.5 sm:py-2 outline-none font-medium text-xs cursor-pointer shadow-2xs transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#7A6D70] absolute right-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="flex gap-8 items-start">
        {/* Filter Sidebar */}
        <FilterSidebar
          filterState={filterState}
          onFilterChange={(newFilters) => setFilterState(newFilters)}
          isOpenMobile={isFilterOpenMobile}
          onCloseMobile={() => setIsFilterOpenMobile(false)}
          productCount={filteredProducts.length}
        />

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#EDE2DA] p-8">
              <h3 className="font-serif text-lg font-bold text-[#221C1D]">
                No matching gifts found
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6E70] mt-1 mb-4">
                Try widening your price range or clearing some filters.
              </p>
              <button
                type="button"
                onClick={() =>
                  setFilterState({
                    minPrice: 0,
                    maxPrice: 5000,
                    sizes: [],
                    colors: [],
                    materials: [],
                    frameColors: [],
                    sort: "featured",
                  })
                }
                className="px-4 py-2 bg-[#C85250] text-white text-xs font-semibold rounded-xl hover:bg-[#B14140] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
