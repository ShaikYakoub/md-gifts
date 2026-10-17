import React from "react";
import Link from "next/link";
import Image from "next/image";

export function ExploreCollections() {
  const collections = [
    {
      title: "Birthday Gifts",
      slug: "birthdays",
      href: "/categories/birthdays",
      image: "/images/collections/collection-birthday.jpg",
    },
    {
      title: "Printed Mugs",
      slug: "mugs",
      href: "/categories/mugs",
      image: "/images/collections/collection-mugs.jpg",
    },
    {
      title: "Personalized",
      slug: "personalized-gifts",
      href: "/categories/personalized-gifts",
      image: "/images/collections/collection-personalized.jpg",
    },
    {
      title: "Keychains",
      slug: "keychains",
      href: "/categories/keychains",
      image: "/images/collections/collection-keychains.jpg",
    },
  ];

  return (
    <section className="py-5 sm:py-8 lg:py-10 bg-transparent">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Section Header */}
        <div className="mb-4 sm:mb-6 md:mb-7">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-[#221C1D] tracking-tight">
            Explore Collections
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#7A6D70] mt-1">
            Curated gifts and handcrafted keepsakes for your dearest moments
          </p>
        </div>

        {/* 2x2 Grid with Full Card Background Images & Bottom-Left Titles */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={col.href}
              className="group relative h-[125px] sm:h-[180px] md:h-[220px] lg:h-[260px] xl:h-[280px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EDE4DD] shadow-2xs block bg-[#FDFBF9] [isolation:isolate]"
            >
              {/* Whole Card Background Image */}
              <Image
                src={col.image}
                alt={col.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center transform-gpu will-change-transform [backface-visibility:hidden] transition-transform duration-200 ease-out group-hover:scale-[1.04]"
              />

              {/* Bottom-Left Content: Thinner and slightly bigger title */}
              <div className="relative z-10 h-full p-3 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-end items-start pointer-events-none">
                <h3 className="font-medium text-base sm:text-2xl md:text-3xl lg:text-[34px] xl:text-[38px] text-[#221C1D] leading-tight tracking-tight">
                  {col.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
