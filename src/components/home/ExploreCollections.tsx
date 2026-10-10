import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function ExploreCollections() {
  const collections = [
    {
      title: "Birthday Gifts",
      subtitle: "Make their day personal & unforgettable.",
      slug: "birthdays",
      image: "/images/collections/birthdays.png",
      textColor: "text-[#2A181C]",
      subtextColor: "text-[#4D323A]",
      badgeBg: "bg-[#B84252] text-white",
    },
    {
      title: "Couple Gifts",
      subtitle: "Celebrating timeless romantic bonds.",
      slug: "couples",
      image: "/images/collections/couples.png",
      textColor: "text-[#182635]",
      subtextColor: "text-[#2F445A]",
      badgeBg: "bg-[#1E5676] text-white",
    },
    {
      title: "Festival Gifts",
      subtitle: "Illuminating celebrations & festivities.",
      slug: "festivals",
      image: "/images/collections/festivals.jpg",
      textColor: "text-[#2E2012]",
      subtextColor: "text-[#4D3924]",
      badgeBg: "bg-[#8A561D] text-white",
    },
  ];

  return (
    <section className="py-5 sm:py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
              Explore Collections
            </h2>
          </div>
          {/* View All Pill-Shaped Button (Items 17-18) */}
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[#E8DFD8] bg-white text-[#221C1D] hover:bg-[#FAF5F1] hover:border-[#C85250]/40 hover:text-[#C85250] transition-colors shadow-2xs group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#7A6D70] group-hover:text-[#C85250] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Banners Grid: Reduced height, increased heading & text prominence, readable CTA buttons (Items 9-14) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/categories/${col.slug}`}
              className="group relative h-[175px] sm:h-[205px] rounded-xl overflow-hidden border border-[#E8DFD8] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
            >
              {/* Background Image */}
              <Image
                src={col.image}
                alt={col.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Scrim Overlay for crisp text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent sm:w-[75%]" />

              {/* Content Box */}
              <div className="relative z-10 h-full p-4 sm:p-5 flex flex-col justify-between max-w-[70%] sm:max-w-[65%]">
                <div className="space-y-1">
                  {/* Banner Heading: Increased size and prominence (Item 11) */}
                  <h3 className={`font-serif text-2xl sm:text-[27px] font-extrabold ${col.textColor} tracking-tight leading-tight`}>
                    {col.title}
                  </h3>
                  {/* Banner Description: Increased readability & prominence (Item 12) */}
                  <p className={`text-xs sm:text-[13.5px] font-medium ${col.subtextColor} leading-snug line-clamp-2`}>
                    {col.subtitle}
                  </p>
                </div>

                {/* Banner CTA Button: Proportionate, clearly readable (Item 13) */}
                <div className="pt-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold px-3.5 py-1.5 rounded-lg shadow-xs ${col.badgeBg} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
