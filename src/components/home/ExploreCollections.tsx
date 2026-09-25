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
      subtextColor: "text-[#5C3D45]",
      badgeBg: "bg-[#B84252] text-white",
    },
    {
      title: "Couple Gifts",
      subtitle: "Celebrating timeless romantic bonds.",
      slug: "couples",
      image: "/images/collections/couples.png",
      textColor: "text-[#182635]",
      subtextColor: "text-[#3D5268]",
      badgeBg: "bg-[#1E5676] text-white",
    },
    {
      title: "Festival Gifts",
      subtitle: "Illuminating celebrations & festivities.",
      slug: "festivals",
      image: "/images/collections/festivals.jpg",
      textColor: "text-[#2E2012]",
      subtextColor: "text-[#5C452C]",
      badgeBg: "bg-[#8A561D] text-white",
    },
  ];

  return (
    <section className="py-5 sm:py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
              Explore Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#736366] mt-0.5">
              Curated collections crafted for every magical milestone
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-medium text-[#C85250] hover:text-[#B14140] flex items-center gap-1 group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/categories/${col.slug}`}
              className="group relative h-[210px] sm:h-[240px] rounded-xl overflow-hidden border border-[#E8DFD8] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
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
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:w-[75%]" />

              {/* Content Box */}
              <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between max-w-[70%] sm:max-w-[65%]">
                <div className="space-y-1 sm:space-y-1.5">
                  <h3 className={`font-serif text-xl sm:text-2xl font-bold ${col.textColor} tracking-tight leading-tight`}>
                    {col.title}
                  </h3>
                  <p className={`text-xs sm:text-sm ${col.subtextColor} leading-snug line-clamp-2`}>
                    {col.subtitle}
                  </p>
                </div>

                <div className="pt-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs ${col.badgeBg} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
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
