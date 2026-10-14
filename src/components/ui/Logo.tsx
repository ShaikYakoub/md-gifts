import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 sm:h-10",
    md: "h-12 sm:h-14",
    lg: "h-16 sm:h-18",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center group select-none transition-transform active:scale-95 ${className}`}
      aria-label="MD Gifts Home"
    >
      <img
        src="/images/mdgifts-logo.svg"
        alt="MD Gifts — Customized Gift Centre"
        className={`${sizeClasses[size]} w-auto object-contain select-none`}
      />
    </Link>
  );
}

