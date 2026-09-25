import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { ShopByRecipient } from "@/components/home/ShopByRecipient";
import { ExploreCollections } from "@/components/home/ExploreCollections";
import { ProductCard } from "@/components/catalog/ProductCard";
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

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Shop by Occasion */}
      <ShopByOccasion />

      {/* 3. Trending Gifts */}
      <section className="py-5 sm:py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
                Trending Gifts
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6D70] mt-0.5">
                Our most loved handcrafted personalized keepsakes
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs sm:text-sm font-medium text-[#C85250] hover:text-[#B14140] flex items-center gap-1 group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 overflow-x-auto pb-3 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {trendingProducts.map((product, idx) => (
              <div key={product.id} className="w-[68vw] xs:w-[54vw] sm:w-auto shrink-0 flex flex-col">
                <ProductCard product={product} priority={idx < 4} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Shop by Recipient */}
      <ShopByRecipient />

      {/* 5. Personalized Favourites */}
      <section className="py-5 sm:py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
                Personalized Favourites
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6D70] mt-0.5">
                Custom engraved portraits & glowing night lights
              </p>
            </div>
            <Link
              href="/categories/personalized-gifts"
              className="text-xs sm:text-sm font-medium text-[#C85250] hover:text-[#B14140] flex items-center gap-1 group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-3 gap-3.5 sm:gap-6 overflow-x-auto pb-3 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {personalizedFavourites.map((product) => (
              <div key={product.id} className="w-[68vw] xs:w-[54vw] sm:w-auto shrink-0 flex flex-col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Under ₹499 Section */}
      <section className="py-5 sm:py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
                Under ₹499
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6D70] mt-0.5">
                Thoughtful and budget-friendly custom keepsakes
              </p>
            </div>
            <Link
              href="/shop?maxPrice=499"
              className="text-xs sm:text-sm font-medium text-[#C85250] hover:text-[#B14140] flex items-center gap-1 group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-3 gap-3.5 sm:gap-6 overflow-x-auto pb-3 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {under499Products.map((product) => (
              <div key={product.id} className="w-[68vw] xs:w-[54vw] sm:w-auto shrink-0 flex flex-col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Explore Collections Banners */}
      <ExploreCollections />
    </SiteLayout>
  );
}
