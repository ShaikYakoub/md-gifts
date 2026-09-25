import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface OccasionVisual {
  slug: string;
  name: string;
  renderIcon: () => React.ReactNode;
}

const OCCASIONS_DATA: OccasionVisual[] = [
  {
    slug: "couples",
    name: "Couples",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        <path
          d="M38 32 C38 20 22 18 16 30 C10 42 22 55 38 68 C54 55 66 42 60 30 C54 18 38 20 38 32 Z"
          fill="#E57373"
        />
        <path
          d="M62 38 C62 28 50 26 45 35 C40 44 50 54 62 65 C74 54 84 44 79 35 C74 26 62 28 62 38 Z"
          fill="#EF9A9A"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    slug: "birthdays",
    name: "Birthdays",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Cake base */}
        <rect x="25" y="48" width="50" height="32" rx="4" fill="#F8BBD0" stroke="#F06292" strokeWidth="1.5" />
        <path d="M25 56 Q37 64 50 56 Q63 64 75 56 L75 48 L25 48 Z" fill="#F48FB1" />
        {/* Candles */}
        <rect x="36" y="32" width="4" height="16" rx="1" fill="#FFF" />
        <rect x="48" y="28" width="4" height="20" rx="1" fill="#FFF" />
        <rect x="60" y="32" width="4" height="16" rx="1" fill="#FFF" />
        {/* Flames */}
        <circle cx="38" cy="28" r="3" fill="#FFB74D" />
        <circle cx="50" cy="24" r="3.5" fill="#FFB74D" />
        <circle cx="62" cy="28" r="3" fill="#FFB74D" />
      </svg>
    ),
  },
  {
    slug: "anniversaries",
    name: "Anniversaries",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Interlocking Golden Wedding Rings */}
        <circle cx="42" cy="50" r="22" stroke="#F59E0B" strokeWidth="6" fill="none" />
        <circle cx="58" cy="50" r="22" stroke="#FBBF24" strokeWidth="6" fill="none" />
        <circle cx="42" cy="50" r="21" stroke="#FDE68A" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    slug: "families",
    name: "Families",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Family silhouettes */}
        <circle cx="38" cy="35" r="9" fill="#78909C" />
        <circle cx="62" cy="38" r="8" fill="#90A4AE" />
        <circle cx="50" cy="52" r="7" fill="#B0BEC5" />
        <path d="M24 68 C24 54 36 50 44 54 C46 54 48 55 50 56 Z" fill="#78909C" />
        <path d="M54 68 C54 56 64 52 74 56 C76 58 76 68 76 68 Z" fill="#90A4AE" />
        <path d="M40 75 C40 65 48 64 50 64 C52 64 60 65 60 75 Z" fill="#B0BEC5" />
      </svg>
    ),
  },
  {
    slug: "festivals",
    name: "Festivals",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Traditional Diya Lamp */}
        <ellipse cx="50" cy="65" rx="30" ry="12" fill="#D97706" />
        <path d="M22 65 Q50 82 78 65 Q50 68 22 65 Z" fill="#B45309" />
        {/* Flame */}
        <circle cx="50" cy="46" r="14" fill="#FEF3C7" opacity="0.6" />
        <path d="M50 32 C56 42 56 52 50 52 C44 52 44 42 50 32 Z" fill="#F59E0B" />
        <path d="M50 38 C53 43 53 49 50 49 C47 49 47 43 50 38 Z" fill="#FEF08A" />
      </svg>
    ),
  },
  {
    slug: "friends",
    name: "Friends",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Cheers Twin Mugs */}
        <rect x="22" y="38" width="22" height="30" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
        <path d="M22 44 C14 44 14 56 22 56" stroke="#94A3B8" strokeWidth="3" fill="none" />
        <rect x="56" y="38" width="22" height="30" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
        <path d="M78 44 C86 44 86 56 78 56" stroke="#94A3B8" strokeWidth="3" fill="none" />
        {/* Clink Spark */}
        <path d="M50 30 L50 42 M44 36 L56 36" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    slug: "new-baby",
    name: "New Baby",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Cute Teddy Bear */}
        <circle cx="35" cy="34" r="8" fill="#D7CCC8" />
        <circle cx="65" cy="34" r="8" fill="#D7CCC8" />
        <circle cx="50" cy="46" r="18" fill="#BCAAA4" />
        <circle cx="44" cy="44" r="2.5" fill="#3E2723" />
        <circle cx="56" cy="44" r="2.5" fill="#3E2723" />
        <ellipse cx="50" cy="52" rx="7" ry="5" fill="#D7CCC8" />
        <circle cx="50" cy="50" r="2" fill="#3E2723" />
        <ellipse cx="50" cy="68" rx="14" ry="12" fill="#BCAAA4" />
      </svg>
    ),
  },
  {
    slug: "housewarming",
    name: "Housewarming",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* House and Little Potted Plant */}
        <path d="M42 36 L24 50 L28 50 L28 72 L56 72 L56 50 L60 50 Z" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
        <rect x="36" y="54" width="12" height="18" fill="#8D6E63" />
        {/* Potted Plant */}
        <path d="M64 58 L76 58 L73 72 L67 72 Z" fill="#A1887F" />
        <circle cx="70" cy="52" r="7" fill="#66BB6A" />
      </svg>
    ),
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
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4">
          {OCCASIONS_DATA.map((occ) => (
            <Link
              key={occ.slug}
              href={`/categories/${occ.slug}`}
              className="flex flex-col items-center group"
            >
              <div className="w-full aspect-square max-w-[72px] sm:max-w-[96px] rounded-2xl bg-[#FAF0EA] group-hover:bg-[#FCE8DF] border border-[#EDE0D6] group-hover:border-[#E8C2B3] flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5 p-2 sm:p-2.5">
                {occ.renderIcon()}
              </div>
              <span className="mt-1.5 text-[11px] sm:text-xs md:text-sm font-medium text-[#382E30] group-hover:text-[#C85250] transition-colors text-center line-clamp-1">
                {occ.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
