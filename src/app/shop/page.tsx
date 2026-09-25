import React from "react";
import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CategoryView } from "@/components/catalog/CategoryView";
import { getAllProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "All Gifts & Keepsakes — Handcrafted with Love",
  description:
    "Explore our complete collection of personalized gifts, custom photo frames, ceramic mugs, laser-engraved keychains, and luxury hampers.",
  alternates: {
    canonical: "https://giftly.in/shop",
  },
};

export default function ShopPage() {
  const products = getAllProducts();

  return (
    <SiteLayout>
      <CategoryView
        title="All Gifts"
        description="Browse our complete selection of thoughtful, handcrafted personalized keepsakes."
        breadcrumbLabel="All Gifts"
        initialProducts={products}
      />
    </SiteLayout>
  );
}
