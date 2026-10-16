import React from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { HomeProductGrids } from "@/components/home/HomeProductGrids";
import { getTrendingProducts, getBestSellerProducts, getUnder499Products } from "@/data/products";

import { SITE_CONFIG } from "@/lib/siteConfig";

export default function HomePage() {
  const trendingProducts = getTrendingProducts();
  const bestSellerProducts = getBestSellerProducts();
  const under499Products = getUnder499Products();

  // Structured Data (JSON-LD) for Organization & WebSite
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.name,
        legalName: SITE_CONFIG.fullName,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/images/mdgifts-logo.svg`,
        email: SITE_CONFIG.email,
        description: SITE_CONFIG.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${SITE_CONFIG.address.building}, ${SITE_CONFIG.address.street}`,
          addressLocality: SITE_CONFIG.address.city,
          addressRegion: SITE_CONFIG.address.state,
          postalCode: SITE_CONFIG.address.pincode,
          addressCountry: "IN",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: `+91-${SITE_CONFIG.phone}`,
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Telugu", "Hindi"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: SITE_CONFIG.name,
        publisher: {
          "@id": `${SITE_CONFIG.url}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_CONFIG.url}/shop?q={search_term_string}`,
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

      {/* 3-7. Reactive Product Card Grids (Trending, Best Sellers, Under 499, Collections) */}
      <HomeProductGrids
        initialTrending={trendingProducts}
        initialBestSellers={bestSellerProducts}
        initialUnder499={under499Products}
      />
    </SiteLayout>
  );
}
