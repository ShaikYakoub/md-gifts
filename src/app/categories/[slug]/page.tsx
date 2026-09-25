import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CategoryView } from "@/components/catalog/CategoryView";
import { ALL_TAXONOMY, getTaxonomyBySlug } from "@/data/categories";
import {
  getAllProducts,
  getProductsByCategory,
  getProductsByOccasion,
  getProductsByRecipient,
} from "@/data/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_TAXONOMY.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const taxonomy = getTaxonomyBySlug(slug);

  if (!taxonomy) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${taxonomy.title} — Buy Personalized ${taxonomy.name} Online`,
    description: taxonomy.description,
    alternates: {
      canonical: `https://giftly.in/categories/${taxonomy.slug}`,
    },
    openGraph: {
      title: `${taxonomy.title} | Giftly`,
      description: taxonomy.description,
      url: `https://giftly.in/categories/${taxonomy.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const taxonomy = getTaxonomyBySlug(slug);

  if (!taxonomy) {
    notFound();
  }

  // Retrieve products based on taxonomy type
  let products = [];
  if (taxonomy.type === "category") {
    products = getProductsByCategory(taxonomy.slug);
  } else if (taxonomy.type === "occasion") {
    products = getProductsByOccasion(taxonomy.slug);
  } else {
    products = getProductsByRecipient(taxonomy.slug);
  }

  // Fallback to all products if specific query yields few items
  if (products.length === 0) {
    products = getAllProducts();
  }

  // Structured Data: BreadcrumbList + ItemList
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://giftly.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Categories",
            item: "https://giftly.in/categories",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: taxonomy.name,
            item: `https://giftly.in/categories/${taxonomy.slug}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: taxonomy.title,
        description: taxonomy.description,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 12).map((prod, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: prod.name,
          url: `https://giftly.in/categories/${taxonomy.slug}`,
        })),
      },
    ],
  };

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryView
        title={taxonomy.title}
        description={taxonomy.description}
        breadcrumbLabel={taxonomy.name}
        initialProducts={products}
      />
    </SiteLayout>
  );
}
