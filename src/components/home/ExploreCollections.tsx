import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ExploreCollections() {
  const collections = [
    {
      title: "Birthday Gifts",
      subtitle: "Make their day personal.",
      slug: "birthdays",
      bgClass: "from-[#FCEEEA] to-[#FBE7E1]",
      borderClass: "border-[#F4D3C7]",
      accentText: "text-[#B94442]",
      renderArtwork: () => (
        <svg viewBox="0 0 160 120" className="w-28 sm:w-36 h-auto" fill="none">
          {/* Cake */}
          <rect x="30" y="55" width="80" height="45" rx="6" fill="#F8BBD0" stroke="#F06292" strokeWidth="2" />
          <path d="M30 65 Q50 75 70 65 Q90 75 110 65 L110 55 L30 55 Z" fill="#F48FB1" />
          {/* Candles */}
          <rect x="46" y="32" width="5" height="24" rx="2" fill="#FFF" />
          <circle cx="48.5" cy="27" r="4" fill="#FFB74D" />
          <rect x="68" y="26" width="5" height="30" rx="2" fill="#FFF" />
          <circle cx="70.5" cy="21" r="4.5" fill="#FFB74D" />
          <rect x="90" y="32" width="5" height="24" rx="2" fill="#FFF" />
          <circle cx="92.5" cy="27" r="4" fill="#FFB74D" />
          {/* Little gift box */}
          <rect x="105" y="68" width="40" height="35" rx="4" fill="#FCD5CE" stroke="#F8B4A6" strokeWidth="2" />
          <rect x="122" y="68" width="6" height="35" fill="#C85250" />
        </svg>
      ),
    },
    {
      title: "Couple Gifts",
      subtitle: "Celebrating special bonds.",
      slug: "couples",
      bgClass: "from-[#EBF3F5] to-[#E2ECF0]",
      borderClass: "border-[#C9DDE3]",
      accentText: "text-[#2B6170]",
      renderArtwork: () => (
        <svg viewBox="0 0 160 120" className="w-28 sm:w-36 h-auto" fill="none">
          {/* Couple Frame */}
          <rect x="35" y="20" width="75" height="90" rx="4" fill="#4A3427" stroke="#332218" strokeWidth="4" />
          <rect x="42" y="27" width="61" height="76" rx="2" fill="#FDFBF9" />
          <rect x="48" y="33" width="49" height="64" rx="2" fill="#E6CEBD" />
          <circle cx="68" cy="56" r="10" fill="#FFE2C0" />
          <circle cx="80" cy="58" r="9" fill="#FFE2C0" />
          <path d="M58 84 C58 70 70 70 75 76 C80 70 92 70 92 84 Z" fill="#3D2E28" />
          {/* Floating red heart */}
          <path
            d="M125 40 C125 30 110 28 105 37 C100 46 110 55 125 67 C140 55 150 46 145 37 C140 28 125 30 125 40 Z"
            fill="#E57373"
          />
        </svg>
      ),
    },
    {
      title: "Festival Gifts",
      subtitle: "For brighter moments.",
      slug: "festivals",
      bgClass: "from-[#FCF5E8] to-[#F7ECD4]",
      borderClass: "border-[#EAD5A9]",
      accentText: "text-[#8C5D1E]",
      renderArtwork: () => (
        <svg viewBox="0 0 160 120" className="w-28 sm:w-36 h-auto" fill="none">
          {/* Brass Diya Lamp */}
          <ellipse cx="65" cy="80" rx="35" ry="15" fill="#D97706" />
          <path d="M32 80 Q65 100 98 80 Q65 84 32 80 Z" fill="#B45309" />
          {/* Flame */}
          <circle cx="65" cy="58" r="18" fill="#FEF3C7" opacity="0.6" />
          <path d="M65 40 C73 53 73 66 65 66 C57 66 57 53 65 40 Z" fill="#F59E0B" />
          <path d="M65 48 C69 55 69 62 65 62 C61 62 61 55 65 48 Z" fill="#FEF08A" />
          {/* Gift sweets box */}
          <rect x="105" y="60" width="45" height="38" rx="4" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
          <rect x="124" y="60" width="7" height="38" fill="#D97706" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-5 sm:py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D] mb-4 sm:mb-6">
          Explore Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/categories/${col.slug}`}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${col.bgClass} border ${col.borderClass} p-6 sm:p-7 flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              <div className="space-y-1.5 z-10 max-w-[60%]">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
                  {col.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C4F51]">{col.subtitle}</p>
                <div
                  className={`pt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${col.accentText} group-hover:underline`}
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="shrink-0 transition-transform duration-300 group-hover:scale-105">
                {col.renderArtwork()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
