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
      subtextColor: "text-[#5A3A42]",
      buttonBg: "bg-gradient-to-r from-[#B84252] to-[#D45566] text-white shadow-[0_4px_14px_rgba(184,66,82,0.35)] hover:shadow-[0_6px_20px_rgba(184,66,82,0.45)]",
    },
    {
      title: "Couple Gifts",
      subtitle: "Celebrating timeless romantic bonds.",
      slug: "couples",
      image: "/images/collections/couples.png",
      textColor: "text-[#182635]",
      subtextColor: "text-[#344E66]",
      buttonBg: "bg-gradient-to-r from-[#1E5676] to-[#2B6F96] text-white shadow-[0_4px_14px_rgba(30,86,118,0.35)] hover:shadow-[0_6px_20px_rgba(30,86,118,0.45)]",
    },
    {
      title: "Festival Gifts",
      subtitle: "Illuminating celebrations & festivities.",
      slug: "festivals",
      image: "/images/collections/festivals.jpg",
      textColor: "text-[#2E2012]",
      subtextColor: "text-[#5A422B]",
      buttonBg: "bg-gradient-to-r from-[#8A561D] to-[#AA6E2A] text-white shadow-[0_4px_14px_rgba(138,86,29,0.35)] hover:shadow-[0_6px_20px_rgba(138,86,29,0.45)]",
    },
  ];

  return (
    <section className="py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5 sm:mb-7">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
              Explore Collections
            </h2>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-[#E8DFD8] bg-white text-[#221C1D] hover:bg-[#FAF5F1] hover:border-[#C85250]/40 hover:text-[#C85250] transition-colors shadow-2xs group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#7A6D70] group-hover:text-[#C85250] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Banners Grid: Taller, spacious, more impactful cards with bigger, premium CTA buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/categories/${col.slug}`}
              className="group relative h-[215px] sm:h-[245px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8DFD8]/90 shadow-[0_6px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.12)] hover:border-[#D0C0B4] transition-all duration-300 hover:-translate-y-1.5 block cursor-pointer"
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
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent w-[80%] sm:w-[75%]" />

              {/* Content Box */}
              <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between max-w-[72%] sm:max-w-[68%]">
                <div className="space-y-1.5">
                  {/* Banner Heading: Large, bold, elegant */}
                  <h3 className={`font-serif text-2xl sm:text-[27px] font-extrabold ${col.textColor} tracking-tight leading-tight`}>
                    {col.title}
                  </h3>
                  {/* Banner Description: Readable, proportional */}
                  <p className={`text-xs sm:text-sm font-medium ${col.subtextColor} leading-snug line-clamp-2`}>
                    {col.subtitle}
                  </p>
                </div>

                {/* Banner CTA Button: Bigger, bolder, pill-shaped with smooth micro-animation */}
                <div className="pt-2">
                  <span
                    className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-full ${col.buttonBg} transition-all duration-200 group-hover:scale-105 active:scale-95`}
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4] transition-transform duration-200 group-hover:translate-x-1" />
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
