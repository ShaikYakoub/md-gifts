import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductDetailClient } from "@/components/catalog/ProductDetailClient";
import { PRODUCTS, getProductBySlug } from "@/data/products";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found — MD Gifts",
    };
  }

  return {
    title: `${product.name} — MD Gifts`,
    description: product.description,
    alternates: {
      canonical: `https://mdgifts.in/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | MD Gifts`,
      description: product.shortDescription,
      url: `https://mdgifts.in/product/${product.slug}`,
      siteName: "MD Gifts",
      images: [
        {
          url: product.images[0] || "/images/hero-lifestyle.jpg",
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related items in same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  // JSON-LD structured data for Google Shopping / Search
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: "MD Gifts",
    },
    offers: {
      "@type": "Offer",
      url: `https://mdgifts.in/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "MD Gifts",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </SiteLayout>
  );
}
