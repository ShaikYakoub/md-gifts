"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Product, FilterState } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { useLiveCatalog } from "@/context/CatalogContext";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";
import { filterProductsFuzzy } from "@/lib/search/fuzzySearch";

const SORT_OPTIONS: SelectOption<FilterState["sort"]>[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating: High to Low" },
];

interface CategoryViewProps {
  title: string;
  description?: string;
  breadcrumbLabel?: string;
  initialProducts: Product[];
  categorySlug?: string;
  taxonomyType?: "category" | "occasion" | "recipient";
}

function CategoryViewInner({
  title,
  description,
  breadcrumbLabel = title,
  initialProducts,
  categorySlug,
  taxonomyType = "category",
}: CategoryViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = (searchParams.get("q") || "").trim();

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

  // Fuzzy & Typo-Tolerant Search Result
  const { matchedProducts, correctedQuery } = useMemo(() => {
    return filterProductsFuzzy(baseProductList, searchQuery);
  }, [baseProductList, searchQuery]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return matchedProducts
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
  }, [matchedProducts, filterState]);

  const handleClearSearch = () => {
    router.push(categorySlug ? `/categories/${categorySlug}` : "/shop");
  };

  const activeSearchTerm = correctedQuery || searchQuery;
  const isTypoCorrected = Boolean(correctedQuery && correctedQuery.toLowerCase() !== searchQuery.toLowerCase());

  const displayTitle = useMemo(() => {
    if (activeSearchTerm) {
      return `Search: “${activeSearchTerm}”`;
    }
    return title;
  }, [activeSearchTerm, title]);

  return (
    <div className="pt-6 pb-28 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Main Title & Info Header with bottom divider line */}
      <div className="pb-4 border-b border-[#EFE4DC] mb-4 sm:mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
          {displayTitle}
        </h1>

        {description && (
          <p className="mt-1 text-xs sm:text-sm text-[#7A6D70] max-w-2xl leading-relaxed">
            {description}
          </p>
        )}

        {searchQuery && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#7A6D70]">
              {isTypoCorrected ? (
                <>
                  Showing results for <span className="font-semibold text-[#221C1D]">“{correctedQuery}”</span>
                  <span className="ml-1 text-[#8C7D80]">(searched for <span className="line-through">{searchQuery}</span>)</span>
                </>
              ) : (
                <>Filtering by: <span className="font-semibold text-[#221C1D]">“{searchQuery}”</span></>
              )}
            </span>
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex items-center gap-1 text-xs text-[#EC0B12] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-2.5 py-0.5 rounded-full font-semibold transition-colors cursor-pointer"
              title="Clear search"
            >
              <span>Clear</span>
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Main Content Layout: Sidebar + Grid */}
      <div className="flex gap-8 items-start">
        {/* Filter Sidebar */}
        <FilterSidebar
          filterState={filterState}
          onFilterChange={(newFilters) => setFilterState(newFilters)}
          isOpenMobile={isFilterOpenMobile}
          onCloseMobile={() => setIsFilterOpenMobile(false)}
          productCount={filteredProducts.length}
        />

        {/* Products Column */}
        <div className="flex-1 min-w-0">
          {/* Controls Bar: Below the main title line, directly above the cards */}
          <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-[#F0E6DE]">
            {/* Left: Mobile Filter button & Product count */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsFilterOpenMobile(true)}
                className="lg:hidden flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-[#DDCFC6] hover:border-[#EC0B12] rounded-full text-[#3E3234] shadow-2xs active:scale-95 transition-all cursor-pointer"
                aria-label="Open filter sidebar"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#EC0B12]" />
                <span>Filter</span>
              </button>
              <span className="text-xs text-[#7A6D70] font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? "gift" : "gifts"}
              </span>
            </div>

            {/* Right: Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#7A6D70] hidden sm:inline font-normal">Sort:</span>
              <CustomSelect<FilterState["sort"]>
                value={filterState.sort}
                onChange={(newSort) =>
                  setFilterState((prev) => ({
                    ...prev,
                    sort: newSort,
                  }))
                }
                options={SORT_OPTIONS}
                ariaLabel="Sort products by"
              />
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#EDE2DA] p-8">
              <h3 className="font-serif text-lg font-bold text-[#221C1D]">
                {activeSearchTerm ? `No gifts found for “${activeSearchTerm}”` : "No matching gifts found"}
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6E70] mt-1 mb-4">
                {activeSearchTerm
                  ? "Try searching for simpler words like “frame”, “mug”, or “keychain”."
                  : "Try widening your price range or clearing some filters."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="px-4 py-2 bg-[#EC0B12] text-white text-xs font-semibold rounded-xl hover:bg-[#D0080E] transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
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
                  className="px-4 py-2 bg-white text-[#221C1D] border border-[#DDCFC6] text-xs font-semibold rounded-xl hover:bg-[#FAF4F0] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CategoryView(props: CategoryViewProps) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[#7A6E70]">Loading gifts...</div>}>
      <CategoryViewInner {...props} />
    </Suspense>
  );
}
