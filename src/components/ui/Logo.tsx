import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-8 h-8",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 group select-none transition-transform active:scale-95 ${className}`}
      aria-label="Giftly Home"
    >
      <div className={`relative ${iconSizes[size]} text-[#C85250] flex items-center justify-center shrink-0`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-2xs">
          {/* Left Bow Loop */}
          <path
            d="M15 11C13.5 7.5 10 4 6.8 6.2C3.8 8.2 5.5 12 9.2 12.6C11.8 13 14 12.2 15 11Z"
            fill="#C85250"
          />
          <ellipse cx="9" cy="9" rx="2" ry="1.5" fill="white" opacity="0.85" transform="rotate(-15 9 9)" />

          {/* Right Bow Loop */}
          <path
            d="M17 11C18.5 7.5 22 4 25.2 6.2C28.2 8.2 26.5 12 22.8 12.6C20.2 13 18 12.2 17 11Z"
            fill="#DE6C68"
          />
          <ellipse cx="23" cy="9" rx="2" ry="1.5" fill="white" opacity="0.85" transform="rotate(15 23 9)" />

          {/* Center Knot */}
          <circle cx="16" cy="11.5" r="2.2" fill="#B33E3C" />

          {/* 4 Box Quadrants with Negative Space Cross */}
          {/* Top-Left Quadrant */}
          <rect x="4.5" y="14" width="10" height="6.5" rx="2.5" fill="#C85250" />
          {/* Top-Right Quadrant */}
          <rect x="17.5" y="14" width="10" height="6.5" rx="2.5" fill="#DE6C68" />
          {/* Bottom-Left Quadrant */}
          <rect x="4.5" y="22" width="10" height="7.5" rx="2.5" fill="#C85250" />
          {/* Bottom-Right Quadrant */}
          <rect x="17.5" y="22" width="10" height="7.5" rx="2.5" fill="#DE6C68" />
        </svg>
      </div>
      <span className={`font-serif tracking-tight font-bold text-[#221C1D] ${sizeClasses[size]}`}>
        Giftly
      </span>
    </Link>
  );
}
