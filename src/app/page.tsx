import React from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { HomeProductGrids } from "@/components/home/HomeProductGrids";
import {
  getTrendingProducts,
  getPersonalizedFavourites,
  getUnder499Products,
} from "@/data/products";

export default function HomePage() {
  const trendingProducts = getTrendingProducts();
  const personalizedFavourites = getPersonalizedFavourites();
  const under499Products = getUnder499Products();

  // Structured Data (JSON-LD) for Organization & WebSite
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://giftly.in/#organization",
        name: "Giftly",
        url: "https://giftly.in",
        logo: "https://giftly.in/logo.png",
        description:
          "Handcrafted personalized photo frames, custom mugs, acrylic keepsakes, and curated gift boxes for all occasions across India.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kadapa",
          addressRegion: "Andhra Pradesh",
          postalCode: "516001",
          addressCountry: "IN",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-9876543210",
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi", "Telugu"],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://giftly.in/#website",
        url: "https://giftly.in",
        name: "Giftly",
        publisher: {
          "@id": "https://giftly.in/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://giftly.in/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <SiteLayout>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section (Top Scrolling Banners) */}
      <HeroSection />

      {/* 2. Shop by Occasion */}
      <ShopByOccasion />

      {/* 3-7. Reactive Product Card Grids (Trending, Favourites, Under 499, Collections) */}
      <HomeProductGrids
        initialTrending={trendingProducts}
        initialFavourites={personalizedFavourites}
        initialUnder499={under499Products}
      />
    </SiteLayout>
  );
}
