import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface RecipientVisual {
  slug: string;
  name: string;
  image: string;
}

const RECIPIENTS_DATA: RecipientVisual[] = [
  {
    slug: "for-her",
    name: "For Her",
    image: "/images/recipients/for-her.png",
  },
  {
    slug: "for-him",
    name: "For Him",
    image: "/images/recipients/for-him.png",
  },
  {
    slug: "for-couples",
    name: "For Couples",
    image: "/images/recipients/for-couples.png",
  },
  {
    slug: "for-parents",
    name: "For Parents",
    image: "/images/recipients/for-parents.png",
  },
  {
    slug: "for-friends",
    name: "For Friends",
    image: "/images/recipients/for-friends.png",
  },
  {
    slug: "for-kids",
    name: "For Kids",
    image: "/images/recipients/for-kids.png",
  },
  {
    slug: "for-colleagues",
    name: "For Colleagues",
    image: "/images/recipients/for-colleagues.png",
  },
  {
    slug: "for-everyone",
    name: "For Everyone",
    image: "/images/recipients/for-everyone.png",
  },
];

export function ShopByRecipient() {
  const displayRecipients = RECIPIENTS_DATA.slice(0, 8);
  const firstThree = displayRecipients.slice(0, 3);
  const remainingRecipients = displayRecipients.slice(3, 8);

  return (
    <section className="py-5 sm:py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D] tracking-tight">
            Shop by Recipient
          </h2>
          <Link
            href="/categories"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[#E8DFD8] bg-white text-[#221C1D] hover:bg-[#FAF5F1] hover:border-[#C85250]/40 hover:text-[#C85250] transition-colors shadow-2xs group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#7A6D70] group-hover:text-[#C85250] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Recipient Cards - 4 columns on mobile (3 normal + 1 View All), 8 on desktop */}
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-8 gap-2 sm:gap-3 lg:gap-3.5">
          {/* First 3 Recipients (Visible on all screens) */}
          {firstThree.map((rec) => (
            <Link
              key={rec.slug}
              href={`/categories/${rec.slug}`}
              className="flex flex-col items-center group w-full"
            >
              <div className="w-full aspect-square rounded-lg sm:rounded-xl bg-[#FAF0EA] border border-[#EDE0D6] group-hover:border-[#E8C2B3] overflow-hidden relative shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
                <Image
                  src={rec.image}
                  alt={rec.name}
                  fill
                  sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 12vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-[#382E30] group-hover:text-[#C85250] transition-colors text-center truncate w-full px-0.5" title={rec.name}>
                {rec.name}
              </span>
            </Link>
          ))}

          {/* 4th Card on Mobile: View All square button */}
          <Link
            href="/categories"
            className="flex flex-col items-center group w-full sm:hidden"
            aria-label="View all recipients"
          >
            <div className="w-full aspect-square rounded-lg sm:rounded-xl bg-gradient-to-br from-[#FAF0EA] to-[#F5E6DC] border border-[#EDE0D6] group-hover:border-[#C85250] overflow-hidden relative shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-[#EDE0D6] flex items-center justify-center text-[#C85250] group-hover:bg-[#C85250] group-hover:text-white group-hover:border-[#C85250] transition-all duration-300 group-hover:scale-105">
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
            <span className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-[#C85250] group-hover:text-[#A83836] transition-colors text-center line-clamp-1 w-full px-0.5">
              View all
            </span>
          </Link>

          {/* Remaining Recipients (Desktop / Tablet only) */}
          {remainingRecipients.map((rec) => (
            <Link
              key={rec.slug}
              href={`/categories/${rec.slug}`}
              className="hidden sm:flex flex-col items-center group w-full"
            >
              <div className="w-full aspect-square rounded-lg sm:rounded-xl bg-[#FAF0EA] border border-[#EDE0D6] group-hover:border-[#E8C2B3] overflow-hidden relative shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
                <Image
                  src={rec.image}
                  alt={rec.name}
                  fill
                  sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 12vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-[#382E30] group-hover:text-[#C85250] transition-colors text-center truncate w-full px-0.5" title={rec.name}>
                {rec.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
