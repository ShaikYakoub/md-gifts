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

  const scriptSizeClasses = {
    sm: "h-7 sm:h-8",
    md: "h-8 sm:h-10",
    lg: "h-11 sm:h-13",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 sm:gap-3.5 group select-none transition-transform active:scale-95 ${className}`}
      aria-label="MD Gifts Home"
    >
      {/* Main Logo (Gift Box Emblem) */}
      <img
        src="/images/mdgifts-logo.svg"
        alt="MD Gifts Emblem"
        className={`${mainSizeClasses[size]} w-auto object-contain select-none`}
      />

      {/* Script Typographic Logo Beside Main Logo */}
      <img
        src="/images/mdgift-script-logo.svg"
        alt="MDGift.com — Customized Gift Centre"
        className={`${scriptSizeClasses[size]} w-auto object-contain select-none`}
      />
    </Link>
  );
}

