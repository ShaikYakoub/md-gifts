import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RecipientVisual {
  slug: string;
  name: string;
  renderIcon: () => React.ReactNode;
}

const RECIPIENTS_DATA: RecipientVisual[] = [
  {
    slug: "for-her",
    name: "For Her",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        <rect x="25" y="42" width="50" height="38" rx="5" fill="#FCE4EC" stroke="#F48FB1" strokeWidth="2" />
        <rect x="22" y="34" width="56" height="12" rx="3" fill="#F8BBD0" stroke="#F48FB1" strokeWidth="2" />
        <rect x="46" y="34" width="8" height="46" fill="#EC407A" />
        <circle cx="50" cy="32" r="5" fill="#D81B60" />
      </svg>
    ),
  },
  {
    slug: "for-him",
    name: "For Him",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Sleek Minimalist Watch */}
        <circle cx="50" cy="50" r="22" fill="#263238" stroke="#37474F" strokeWidth="3" />
        <circle cx="50" cy="50" r="18" fill="#1E272C" />
        <line x1="50" y1="50" x2="50" y2="38" stroke="#ECEFF1" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="50" x2="58" y2="50" stroke="#ECEFF1" strokeWidth="2" strokeLinecap="round" />
        <rect x="44" y="16" width="12" height="14" rx="2" fill="#78350F" />
        <rect x="44" y="70" width="12" height="14" rx="2" fill="#78350F" />
      </svg>
    ),
  },
  {
    slug: "for-couples",
    name: "For Couples",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Sculpted Heart Ribbon */}
        <path
          d="M50 32 C50 18 30 18 24 30 C18 42 32 55 50 68 C68 55 82 42 76 30 C70 18 50 18 50 32 Z"
          fill="#D7CCC8"
          stroke="#8D6E63"
          strokeWidth="3"
        />
        <circle cx="50" cy="46" r="6" fill="#8D6E63" />
      </svg>
    ),
  },
  {
    slug: "for-parents",
    name: "For Parents",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Two loving portraits */}
        <rect x="25" y="30" width="22" height="30" rx="3" fill="#FFE0B2" stroke="#FB8C00" strokeWidth="2" />
        <rect x="53" y="30" width="22" height="30" rx="3" fill="#FFE0B2" stroke="#FB8C00" strokeWidth="2" />
        <path d="M42 66 Q50 60 58 66" stroke="#FB8C00" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="36" cy="42" r="5" fill="#FB8C00" />
        <circle cx="64" cy="42" r="5" fill="#FB8C00" />
      </svg>
    ),
  },
  {
    slug: "for-friends",
    name: "For Friends",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Fun Quirky Twin Mugs */}
        <rect x="22" y="38" width="22" height="30" rx="4" fill="#BBDEFB" stroke="#64B5F6" strokeWidth="2" />
        <rect x="56" y="38" width="22" height="30" rx="4" fill="#FFE082" stroke="#FFD54F" strokeWidth="2" />
        <circle cx="33" cy="52" r="3" fill="#1976D2" />
        <circle cx="67" cy="52" r="3" fill="#F57C00" />
      </svg>
    ),
  },
  {
    slug: "for-kids",
    name: "For Kids",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Cute Baby Plush Bear */}
        <circle cx="32" cy="35" r="9" fill="#D7CCC8" />
        <circle cx="68" cy="35" r="9" fill="#D7CCC8" />
        <circle cx="50" cy="50" r="22" fill="#BCAAA4" />
        <circle cx="42" cy="48" r="3" fill="#3E2723" />
        <circle cx="58" cy="48" r="3" fill="#3E2723" />
        <circle cx="50" cy="56" r="3" fill="#D81B60" />
      </svg>
    ),
  },
  {
    slug: "for-colleagues",
    name: "For Colleagues",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Professional Desk Pen & Organizer */}
        <rect x="30" y="45" width="40" height="35" rx="4" fill="#37474F" stroke="#263238" strokeWidth="2" />
        <line x1="42" y1="25" x2="42" y2="45" stroke="#90A4AE" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="20" x2="50" y2="45" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <line x1="58" y1="27" x2="58" y2="45" stroke="#78909C" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    slug: "for-everyone",
    name: "For Everyone",
    renderIcon: () => (
      <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
        {/* Universal Hamper Gift Box */}
        <rect x="25" y="42" width="50" height="38" rx="5" fill="#FFE0B2" stroke="#FFB74D" strokeWidth="2" />
        <rect x="22" y="34" width="56" height="12" rx="3" fill="#FFCC80" stroke="#FFB74D" strokeWidth="2" />
        <rect x="46" y="34" width="8" height="46" fill="#F57C00" />
        <circle cx="50" cy="32" r="5" fill="#E65100" />
      </svg>
    ),
  },
];

export function ShopByRecipient() {
  return (
    <section className="py-5 sm:py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
            Shop by Recipient
          </h2>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-medium text-[#C85250] hover:text-[#B14140] flex items-center gap-1 group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4">
          {RECIPIENTS_DATA.map((rec) => (
            <Link
              key={rec.slug}
              href={`/categories/${rec.slug}`}
              className="flex flex-col items-center group"
            >
              <div className="w-full aspect-square max-w-[72px] sm:max-w-[96px] rounded-2xl bg-[#FAF0EA] group-hover:bg-[#FCE8DF] border border-[#EDE0D6] group-hover:border-[#E8C2B3] flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5 p-2 sm:p-2.5">
                {rec.renderIcon()}
              </div>
              <span className="mt-1.5 text-[11px] sm:text-xs md:text-sm font-medium text-[#382E30] group-hover:text-[#C85250] transition-colors text-center line-clamp-1">
                {rec.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
