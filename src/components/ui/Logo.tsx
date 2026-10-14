import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const mainSizeClasses = {
    sm: "h-7 sm:h-8",
    md: "h-9 sm:h-11",
    lg: "h-12 sm:h-14",
  };

  const mdMonogramSizeClasses = {
    sm: "h-7 sm:h-8",
    md: "h-9 sm:h-11",
    lg: "h-12 sm:h-14",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 sm:gap-3 group select-none transition-transform active:scale-95 ${className}`}
      aria-label="MD Gifts Home"
    >
      {/* Capital MD on the left side of logo */}
      <img
        src="/images/md-monogram.svg"
        alt="MD"
        className={`${mdMonogramSizeClasses[size]} w-auto object-contain select-none`}
      />

      {/* Main Logo (Gift Box Emblem) */}
      <img
        src="/images/mdgifts-logo.svg"
        alt="MD Gifts"
        className={`${mainSizeClasses[size]} w-auto object-contain select-none`}
      />
    </Link>
  );
}

