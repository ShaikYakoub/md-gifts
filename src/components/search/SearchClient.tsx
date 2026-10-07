"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon, X, ChevronRight, ChevronDown } from "lucide-react";
import { Product } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductImage } from "@/components/ui/ProductImage";
import { CATEGORIES } from "@/data/categories";
import { useLiveCatalog } from "@/context/CatalogContext";

const POPULAR_SEARCHES = [
  "couple frame",
  "anniversary",
  "custom mug",
  "birthday gifts",
  "keychains",
  "home decor",
  "led frame",
  "gift box",
];

export function SearchClient({ allProducts }: { allProducts: Product[] }) {
  const { products: liveProducts, categories: liveCategories } = useLiveCatalog();
  const productList = liveProducts && liveProducts.length > 0 ? liveProducts : allProducts;
  const categoriesList = liveCategories && liveCategories.length > 0 ? liveCategories : CATEGORIES;

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  // Keep state in sync with URL
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  // Matched categories
  const matchedCategories = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return categoriesList.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.includes(q)
    );
  }, [categoriesList, query]);

  // Filtered and sorted products
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    return productList
      .filter((p) => {
        const text = `${p.name} ${p.shortDescription} ${p.categorySlug} ${(p.tags || []).join(" ")} ${(p.occasionSlugs || []).join(" ")} ${(p.recipientSlugs || []).join(" ")}`.toLowerCase();
        return terms.every((term) => text.includes(term));
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [productList, query, sortBy]);

  return (
    <div className="pt-6 pb-28 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#7A6D70] mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#C85250] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9]" />
        <span className="text-[#221C1D] font-medium">Search</span>
      </nav>

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearchSubmit} className="relative">
          <SearchIcon className="w-5 h-5 text-[#8C7D80] absolute left-4 top-3.5 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for gifts, frames, occasions, recipients..."
            className="w-full bg-white text-sm sm:text-base text-[#221C1D] placeholder-[#9E9093] pl-12 pr-12 py-3.5 rounded-2xl border border-[#EDE0D6] focus:border-[#C85250] focus:ring-1 focus:ring-[#C85250] shadow-sm outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                router.push("/search");
              }}
              className="absolute right-4 top-3.5 text-[#8C7D80] hover:text-[#221C1D] cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* Popular Searches Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#5C4F51] mr-1">
            Popular Searches:
          </span>
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleChipClick(term)}
              className="px-3 py-1 bg-white hover:bg-[#FAF2EE] text-xs text-[#4A3E40] hover:text-[#C85250] rounded-full border border-[#E5D7CE] transition-colors cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {query.trim() ? (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE4DC] mb-6">
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
                Search Results for &ldquo;{query}&rdquo;
              </h1>
              <p className="text-xs sm:text-sm text-[#7A6D70] mt-0.5">
                Found {searchResults.length} matching {searchResults.length === 1 ? "product" : "products"} and {matchedCategories.length} {matchedCategories.length === 1 ? "category" : "categories"}
              </p>
            </div>

            {/* Sort Dropdown for Products */}
            {activeTab === "products" && searchResults.length > 0 && (
              <div className="flex items-center gap-2 text-xs self-end sm:self-auto">
                <span className="text-[#7A6D70] font-normal">Sort by:</span>
                <div className="relative inline-flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    aria-label="Sort search results by"
                    className="appearance-none bg-white border border-[#DDCFC6] hover:border-[#BDB0A8] focus:border-[#BDB0A8] focus:ring-1 focus:ring-[#BDB0A8]/20 text-[#221C1D] rounded-full pl-3.5 pr-8 py-1.5 outline-none font-medium text-xs cursor-pointer shadow-2xs transition-colors"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7A6D70] absolute right-2.5 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Toggle Tabs: Products (N) vs Categories (N) */}
          <div className="flex items-center gap-2.5 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-[#C85250] text-white shadow-xs"
                  : "bg-white text-[#5C4F51] border border-[#DDCFC6] hover:bg-[#FAF2EE]"
              }`}
            >
              Products ({searchResults.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "categories"
                  ? "bg-[#C85250] text-white shadow-xs"
                  : "bg-white text-[#5C4F51] border border-[#DDCFC6] hover:bg-[#FAF2EE]"
              }`}
            >
              Categories ({matchedCategories.length})
            </button>
          </div>

          {/* Tab 1: Products */}
          {activeTab === "products" && (
            searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-[#EDE2DA] p-8 max-w-md mx-auto">
                <h3 className="font-serif text-lg font-bold text-[#221C1D]">
                  No matching gifts found
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6E70] mt-1 mb-4">
                  We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Check spelling or try a broader search like &ldquo;frame&rdquo; or &ldquo;birthday&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="px-4 py-2 bg-[#C85250] text-white text-xs font-semibold rounded-xl hover:bg-[#B14140] transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            )
          )}

          {/* Tab 2: Categories */}
          {activeTab === "categories" && (
            matchedCategories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-6">
                {matchedCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    className="group bg-white rounded-2xl border border-[#EDE2DA] overflow-hidden hover:border-[#C85250] transition-all hover:shadow-md flex flex-col text-center p-3 sm:p-4"
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FAF3EE] mb-3">
                      <ProductImage
                        slug={c.slug}
                        categorySlug={c.slug}
                        aspectRatio="square"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-[#221C1D] group-hover:text-[#C85250] transition-colors">
                      {c.name}
                    </h3>
                    <span className="text-xs text-[#8C7D80] mt-0.5">
                      ({c.productCount} products)
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-[#EDE2DA] p-8 max-w-md mx-auto">
                <h3 className="font-serif text-lg font-bold text-[#221C1D]">
                  No matching categories found
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6E70] mt-1 mb-4">
                  No categories matched &ldquo;{query}&rdquo;. Check the Products tab or explore our full category list.
                </p>
                <Link
                  href="/categories"
                  className="inline-block px-4 py-2 bg-[#C85250] text-white text-xs font-semibold rounded-xl hover:bg-[#B14140] transition-colors"
                >
                  View All Categories
                </Link>
              </div>
            )
          )}
        </div>
      ) : (
        /* Empty Query State: Suggested Discoveries */
        <div className="py-8">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#221C1D] mb-4">
            Trending Searches You Might Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-6">
            {allProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
