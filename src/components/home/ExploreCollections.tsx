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
    <section className="py-5 sm:py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-3.5 sm:mb-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
            Explore Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6D70] mt-0.5">
            Curated gifts and handcrafted keepsakes for your dearest moments
          </p>
        </div>

        {/* 2x2 Grid with Full Card Background Images & Bottom-Left Titles */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-5">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={col.href}
              className="group relative h-[125px] sm:h-[160px] md:h-[200px] lg:h-[220px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EDE4DD] shadow-2xs hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 transition-all duration-200 ease-out block bg-[#FDFBF9]"
            >
              {/* Whole Card Background Image */}
              <Image
                src={col.image}
                alt={col.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Bottom-Left Content: Thinner and slightly bigger title */}
              <div className="relative z-10 h-full p-3 sm:p-5 md:p-6 flex flex-col justify-end items-start pointer-events-none">
                <h3 className="font-medium text-base sm:text-2xl md:text-3xl lg:text-[32px] text-[#221C1D] group-hover:text-[#EC0B12] transition-colors leading-tight tracking-tight">
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
