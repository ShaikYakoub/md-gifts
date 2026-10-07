import React, { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  slug?: string;
  name?: string;
  categorySlug?: string;
  image?: string;
  className?: string;
  aspectRatio?: "square" | "portrait" | "wide";
  priority?: boolean;
}

export function ProductImage({
  slug = "",
  name = "",
  categorySlug = "frames",
  image = "",
  className = "",
  aspectRatio = "portrait",
  priority = false,
}: ProductImageProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const ratioClasses =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "wide"
      ? "aspect-[4/3]"
      : "aspect-[4/5]";

  // If real image URL is provided, display high-fidelity Next.js Image
  if (image && !hasImageError) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-[#FAF5F0] flex items-center justify-center select-none ${ratioClasses} ${className}`}
      >
        <Image
          src={image}
          alt={name || slug || "Product visual"}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-300"
          onError={() => setHasImageError(true)}
        />
      </div>
    );
  }

  // Match visual styles based on slug or name
  const isLed = slug.includes("led") || name.toLowerCase().includes("led");
  const isMug = categorySlug === "mugs" || slug.includes("mug");
  const isKeychain = categorySlug === "keychains" || slug.includes("keychain");
  const isBox = categorySlug === "gift-boxes" || slug.includes("box") || slug.includes("hamper");
  const isMusicBox = slug.includes("music-box");
  const isNightLamp = slug.includes("night-lamp") || slug.includes("lamp");
  const isCollage = slug.includes("collage") || name.toLowerCase().includes("collage");
  const isHeart = slug.includes("heart");
  const isAcrylic = slug.includes("acrylic") || name.toLowerCase().includes("acrylic");
  const isWooden = slug.includes("wooden") || slug.includes("wood") || categorySlug === "home-decor";

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-b from-[#FBF4EE] to-[#F5E8E0] flex items-center justify-center select-none ${ratioClasses} ${className}`}
    >
      {/* Background warm ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.8)_0%,rgba(247,235,225,0.4)_70%,rgba(238,220,208,0.7)_100%)] pointer-events-none" />

      {/* Product-specific realistic SVG illustration */}
      {isLed ? (
        // Glowing LED Frame with Heart
        <svg
          viewBox="0 0 300 360"
          className="w-[85%] h-[85%] object-contain drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base */}
          <rect x="70" y="305" width="160" height="24" rx="6" fill="#8B5A2B" stroke="#6D431D" strokeWidth="2" />
          <rect x="75" y="308" width="150" height="6" rx="3" fill="#A86F38" opacity="0.6" />
          {/* Acrylic outer */}
          <rect x="50" y="35" width="200" height="270" rx="16" fill="#1C1819" stroke="#E5C79E" strokeWidth="3" />
          {/* Warm LED Heart Outline */}
          <path
            d="M150 100 C150 80 120 65 100 85 C80 105 85 135 150 195 C215 135 220 105 200 85 C180 65 150 80 150 100 Z"
            fill="none"
            stroke="#FFA834"
            strokeWidth="5"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_12px_#FFA834]"
          />
          {/* Couple silhouette inside warm light */}
          <circle cx="138" cy="125" r="14" fill="#FFE2C0" />
          <circle cx="162" cy="127" r="13" fill="#FFE2C0" />
          <path d="M122 165 C122 142 140 142 145 155 C150 142 168 142 178 165 Z" fill="#FFE2C0" opacity="0.9" />
          {/* Romantic subtle caption */}
          <text x="150" y="240" fill="#FFA834" fontSize="11" fontFamily="sans-serif" textAnchor="middle" letterSpacing="2">
            YOU & ME ALWAYS
          </text>
          <text x="150" y="260" fill="#E5C79E" fontSize="9" fontFamily="sans-serif" textAnchor="middle">
            ✦ FOREVER TOGETHER ✦
          </text>
        </svg>
      ) : isNightLamp ? (
        // 3D Silhouette Night Lamp
        <svg
          viewBox="0 0 300 360"
          className="w-[85%] h-[85%] object-contain drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Solid Wooden Base with Engraving */}
          <rect x="60" y="300" width="180" height="30" rx="8" fill="#9C6644" stroke="#7F5539" strokeWidth="2" />
          <text x="150" y="320" fill="#EDE0D4" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
            ALWAYS TOGETHER
          </text>
          {/* Acrylic Lamp Shape */}
          <path
            d="M80 80 C80 40 220 40 220 80 L210 295 L90 295 Z"
            fill="url(#acrylicGlow)"
            stroke="#DDB892"
            strokeWidth="2"
          />
          {/* Line art couple sketch */}
          <path
            d="M135 120 C135 100 150 100 150 120 C150 135 135 150 130 170 M165 125 C165 105 180 105 180 125 C180 145 160 170 150 190"
            stroke="#FFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="acrylicGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF9F0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFE8D6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      ) : isMusicBox ? (
        // Vintage Carved Wooden Music Box
        <svg
          viewBox="0 0 300 360"
          className="w-[85%] h-[85%] object-contain drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Isometric Wood Box Body */}
          <path d="M50 190 L150 130 L250 190 L150 250 Z" fill="#B08968" stroke="#7F5539" strokeWidth="3" />
          <path d="M50 190 L150 250 L150 310 L50 250 Z" fill="#7F5539" stroke="#5C3D2E" strokeWidth="2" />
          <path d="M250 190 L150 250 L150 310 L250 250 Z" fill="#9C6644" stroke="#5C3D2E" strokeWidth="2" />
          {/* Box Open Lid */}
          <path d="M50 190 L150 130 L150 70 L50 130 Z" fill="#DDB892" stroke="#7F5539" strokeWidth="2" />
          <path d="M150 130 L250 190 L250 130 L150 70 Z" fill="#E6CCB2" stroke="#7F5539" strokeWidth="2" />
          {/* Engraved Typography on Lid */}
          <text x="150" y="115" fill="#5C3D2E" fontSize="13" fontFamily="serif" textAnchor="middle" fontStyle="italic" fontWeight="bold">
            Our Love Story
          </text>
          {/* Crank Handle */}
          <circle cx="265" cy="220" r="8" fill="#F59E0B" />
          <line x1="250" y1="220" x2="265" y2="220" stroke="#B45309" strokeWidth="4" />
        </svg>
      ) : isCollage ? (
        // 9-Grid Photo Collage Frame
        <svg
          viewBox="0 0 300 360"
          className="w-[85%] h-[85%] object-contain drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Frame border */}
          <rect x="35" y="45" width="230" height="270" rx="8" fill="#292524" stroke="#1C1917" strokeWidth="8" />
          {/* White Mount Mat */}
          <rect x="45" y="55" width="210" height="250" rx="4" fill="#FBF9F7" />
          {/* 9 Collage Slots */}
          {[
            { x: 55, y: 65, color: "#E0C8B5" },
            { x: 125, y: 65, color: "#D1B6A1" },
            { x: 195, y: 65, color: "#E8D5C4" },
            { x: 55, y: 145, color: "#D7BCA8" },
            { x: 125, y: 145, color: "#C8A690" },
            { x: 195, y: 145, color: "#DFCEBF" },
            { x: 55, y: 225, color: "#E5D2C2" },
            { x: 125, y: 225, color: "#D4BBA6" },
            { x: 195, y: 225, color: "#CBAE98" },
          ].map((item, idx) => (
            <g key={idx}>
              <rect x={item.x} y={item.y} width="50" height="65" rx="3" fill={item.color} />
              <circle cx={item.x + 25} cy={item.y + 24} r="10" fill="#FFFFFF" opacity="0.6" />
              <path
                d={`M${item.x + 12} ${item.y + 55} C${item.x + 12} ${item.y + 40} ${item.x + 38} ${item.y + 40} ${item.x + 38} ${item.y + 55} Z`}
                fill="#FFFFFF"
                opacity="0.6"
              />
            </g>
          ))}
        </svg>
      ) : isMug ? (
        // Personalized Ceramic Mug
        <svg
          viewBox="0 0 300 360"
          className="w-[85%] h-[85%] object-contain drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Handle */}
          <path
            d="M210 120 C265 120 265 220 210 220"
            stroke="#EFEBE7"
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M210 120 C265 120 265 220 210 220"
            stroke="#D6CECA"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Mug Body */}
          <rect x="65" y="80" width="150" height="180" rx="16" fill="#FFFFFF" stroke="#E5DDD8" strokeWidth="4" />
          <ellipse cx="140" cy="80" rx="75" ry="12" fill="#EAE3DE" stroke="#D1C7C1" strokeWidth="2" />
          {/* Coffee inside */}
          <ellipse cx="140" cy="80" rx="66" ry="9" fill="#5C3826" />
          {/* Print on Mug */}
          <rect x="90" y="115" width="100" height="110" rx="8" fill="#FDF7F5" stroke="#F1D6CE" strokeWidth="1" />
          <circle cx="140" cy="148" r="16" fill="#C85250" />
          <path
            d="M140 142 C140 138 132 135 128 140 C124 145 128 152 140 160 C152 152 156 145 152 140 C148 135 140 138 140 142 Z"
            fill="#FFFFFF"
          />
          <text x="140" y="180" fill="#2B2122" fontSize="11" fontFamily="serif" textAnchor="middle" fontWeight="bold">
            Best Friends
          </text>
          <text x="140" y="196" fill="#C85250" fontSize="9" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">
            FOREVER & EVER
          </text>
        </svg>
      ) : isKeychain ? (
        // Laser Engraved Keychain
        <svg
          viewBox="0 0 300 360"
          className="w-[85%] h-[85%] object-contain drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Key Ring */}
          <circle cx="150" cy="70" r="32" stroke="#9CA3AF" strokeWidth="7" fill="none" />
          <circle cx="150" cy="70" r="30" stroke="#E5E7EB" strokeWidth="2" fill="none" />
          {/* Chain Links */}
          <rect x="146" y="105" width="8" height="18" rx="4" fill="#9CA3AF" />
          <rect x="146" y="125" width="8" height="18" rx="4" fill="#D1D5DB" />
          {/* Circular Metallic Tag */}
          <circle cx="150" cy="220" r="75" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="6" />
          <circle cx="150" cy="220" r="68" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2" />
          {/* Couple Photo in Tag */}
          <circle cx="150" cy="210" r="48" fill="#E4C5AF" />
          <circle cx="140" cy="200" r="14" fill="#FFE2C0" />
          <circle cx="160" cy="202" r="13" fill="#FFE2C0" />
          <path d="M125 240 C125 220 140 220 150 230 C160 220 175 220 175 240 Z" fill="#5A3A29" />
          <text x="150" y="275" fill="#4B5563" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
            14 · 02 · 2024
          </text>
        </svg>
      ) : isBox ? (
        // Luxury Gift Box with Ribbon
        <svg
          viewBox="0 0 300 360"
          className="w-[85%] h-[85%] object-contain drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow */}
          <ellipse cx="150" cy="315" rx="100" ry="16" fill="#D6C6BD" opacity="0.6" />
          {/* Main Box Body */}
          <rect x="55" y="150" width="190" height="145" rx="8" fill="#FAD2E1" stroke="#F4ACB7" strokeWidth="3" />
          {/* Box Lid */}
          <rect x="45" y="120" width="210" height="40" rx="8" fill="#F7CAD0" stroke="#F4ACB7" strokeWidth="3" />
          {/* Vertical Satin Ribbon */}
          <rect x="135" y="120" width="30" height="175" fill="#C85250" />
          {/* Horizontal Satin Ribbon */}
          <rect x="55" y="185" width="190" height="24" fill="#C85250" />
          {/* Large Ribbon Bow on Top */}
          <path d="M150 120 C120 70 80 85 130 115 Z" fill="#BA403E" stroke="#9A2E2C" strokeWidth="2" />
          <path d="M150 120 C180 70 220 85 170 115 Z" fill="#BA403E" stroke="#9A2E2C" strokeWidth="2" />
          <circle cx="150" cy="118" r="12" fill="#E26A68" stroke="#9A2E2C" strokeWidth="2" />
          {/* Hanging Ribbon Tails */}
          <path d="M142 125 C130 160 110 180 95 190" stroke="#C85250" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M158 125 C170 160 190 180 205 190" stroke="#C85250" strokeWidth="8" strokeLinecap="round" fill="none" />
        </svg>
      ) : isHeart ? (
        // Heart Shaped Photo Frame
        <svg
          viewBox="0 0 300 360"
          className="w-[85%] h-[85%] object-contain drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer sculpted heart */}
          <path
            d="M150 85 C150 45 90 25 50 65 C10 105 20 170 150 290 C280 170 290 105 250 65 C210 25 150 45 150 85 Z"
            fill="#FFFFFF"
            stroke="#C85250"
            strokeWidth="10"
          />
          {/* Inner Photo inside heart */}
          <path
            d="M150 95 C150 60 100 45 65 80 C30 115 40 165 150 270 C260 165 270 115 235 80 C200 45 150 60 150 95 Z"
            fill="#EAD5C5"
          />
          {/* Couple portrait */}
          <circle cx="132" cy="140" r="22" fill="#FFE2C0" />
          <circle cx="168" cy="145" r="20" fill="#FFE2C0" />
          <path d="M105 210 C105 175 130 175 145 190 C160 175 185 175 195 210 Z" fill="#6B4226" />
        </svg>
      ) : isAcrylic ? (
        // Floating Clear Acrylic Block
        <svg
          viewBox="0 0 300 360"
          className="w-[85%] h-[85%] object-contain drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Thick 3D Acrylic edge */}
          <rect x="45" y="45" width="210" height="270" rx="12" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="4" />
          <rect x="50" y="50" width="200" height="260" rx="8" fill="#F9FAFB" stroke="#FFFFFF" strokeWidth="3" />
          {/* Floating Image inside with margins */}
          <rect x="65" y="65" width="170" height="210" rx="4" fill="#E5D3C5" />
          <circle cx="135" cy="130" r="22" fill="#FFE2C0" />
          <circle cx="168" cy="135" r="20" fill="#FFE2C0" />
          <path d="M108 205 C108 170 135 170 150 185 C165 170 192 170 192 205 Z" fill="#4B382A" />
          {/* Modern Typography caption */}
          <text x="150" y="250" fill="#2B2122" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
            TOGETHER SINCE 2021
          </text>
        </svg>
      ) : isWooden ? (
        // Solid Teak / Pine Wooden Frame
        <svg
          viewBox="0 0 300 360"
          className="w-[85%] h-[85%] object-contain drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Beveled Wooden Frame */}
          <rect x="35" y="40" width="230" height="280" rx="6" fill="#8B5A2B" stroke="#6F441E" strokeWidth="10" />
          <rect x="50" y="55" width="200" height="250" rx="2" fill="#FDFBF9" stroke="#E2D4C9" strokeWidth="2" />
          {/* Inside Photo */}
          <rect x="70" y="75" width="160" height="210" rx="2" fill="#E4C8B5" />
          {/* Couple portrait */}
          <circle cx="135" cy="140" r="24" fill="#FFE2C0" />
          <circle cx="168" cy="145" r="22" fill="#FFE2C0" />
          <path d="M105 220 C105 180 135 180 150 195 C165 180 195 180 195 220 Z" fill="#4A3B32" />
          {/* Natural grain lines */}
          <line x1="40" y1="90" x2="40" y2="240" stroke="#7A4B22" strokeWidth="2" opacity="0.4" />
          <line x1="260" y1="80" x2="260" y2="260" stroke="#7A4B22" strokeWidth="2" opacity="0.4" />
        </svg>
      ) : (
        // Standard Signature Couple Photo Frame (matching screenshot)
        <svg
          viewBox="0 0 300 360"
          className="w-[85%] h-[85%] object-contain drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Frame Moulding */}
          <rect x="40" y="45" width="220" height="270" rx="6" fill="#402D24" stroke="#2B1E18" strokeWidth="8" />
          {/* Mount Board Matting */}
          <rect x="52" y="57" width="196" height="246" rx="2" fill="#FBF9F7" stroke="#EAE2DA" strokeWidth="2" />
          {/* Photo Opening */}
          <rect x="70" y="75" width="160" height="210" rx="2" fill="#E6CEBD" />
          {/* Couple Portrait in warm lighting */}
          <circle cx="135" cy="140" r="24" fill="#FFE2C0" />
          <circle cx="168" cy="145" r="22" fill="#FFE2C0" />
          <path d="M105 225 C105 180 135 180 150 195 C165 180 195 180 195 225 Z" fill="#3D2E28" />
          {/* Subtle warm glow highlights */}
          <ellipse cx="150" cy="160" rx="55" ry="40" fill="#FFA834" opacity="0.15" />
          <text x="150" y="265" fill="#402D24" fontSize="10" fontFamily="serif" textAnchor="middle" fontStyle="italic">
            Forever & Always
          </text>
        </svg>
      )}
    </div>
  );
}
