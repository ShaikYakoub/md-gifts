import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SearchClient } from "@/components/search/SearchClient";
import { getAllProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Search Gifts & Keepsakes",
  description: "Search across our handcrafted personalized photo frames, mugs, keychains, and gift boxes.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  const allProducts = getAllProducts();

  return (
    <SiteLayout>
      <Suspense fallback={<div className="py-20 text-center text-[#7A6E70]">Loading search...</div>}>
        <SearchClient allProducts={allProducts} />
      </Suspense>
    </SiteLayout>
  );
}
