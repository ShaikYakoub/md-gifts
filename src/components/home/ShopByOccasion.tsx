import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface OccasionVisual {
  slug: string;
  name: string;
  image: string;
}

const OCCASIONS_DATA: OccasionVisual[] = [
  {
    slug: "couples",
    name: "Couples",
    image: "/images/occasions/couples.png",
  },
  {
    slug: "birthdays",
    name: "Birthdays",
    image: "/images/occasions/birthdays.png",
  },
  {
    slug: "anniversaries",
    name: "Anniversaries",
    image: "/images/occasions/anniversaries.png",
  },
  {
    slug: "families",
    name: "Families",
    image: "/images/occasions/families.png",
  },
  {
    slug: "festivals",
    name: "Festivals",
    image: "/images/occasions/festivals.png",
  },
  {
    slug: "friends",
    name: "Friends",
    image: "/images/occasions/friends.png",
  },
  {
    slug: "new-baby",
    name: "New Baby",
    image: "/images/occasions/new-baby.png",
  },
  {
    slug: "housewarming",
    name: "Housewarming",
    image: "/images/occasions/housewarming.png",
  },
];

export function ShopByOccasion() {
  return (
    <section className="py-5 sm:py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
            Shop by Occasion
          </h2>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-medium text-[#C85250] hover:text-[#B14140] flex items-center gap-1 group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Occasion Cards - 4 columns on mobile, 8 on desktop */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 lg:gap-3.5">
          {OCCASIONS_DATA.map((occ) => (
            <Link
              key={occ.slug}
              href={`/categories/${occ.slug}`}
              className="flex flex-col items-center group w-full"
            >
              <div className="w-full aspect-square rounded-lg sm:rounded-xl bg-[#FAF0EA] border border-[#EDE0D6] group-hover:border-[#E8C2B3] overflow-hidden relative shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
                <Image
                  src={occ.image}
                  alt={occ.name}
                  fill
                  sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 12vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-[#382E30] group-hover:text-[#C85250] transition-colors text-center line-clamp-1 w-full px-0.5">
                {occ.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
