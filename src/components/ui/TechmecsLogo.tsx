"use client";

import React from "react";
import Image from "next/image";

interface TechmecsCreditProps {
  className?: string;
}

export function TechmecsCredit({ className = "" }: TechmecsCreditProps) {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center gap-1 text-xs sm:text-sm text-[#7A6D70] font-sans ${className}`}
    >
      <span className="font-normal text-[#6C5E61]">Website by</span>
      <a
        href="https://techmecs.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="techmecs — opens techmecs.com in a new tab"
        className="inline-flex items-center hover:opacity-80 transition-opacity cursor-pointer group"
      >
        <Image
          src="/images/techmecs-logo-dark.webp"
          alt="techmecs"
          width={640}
          height={113}
          className="h-5 sm:h-5.5 w-auto object-contain"
          priority
        />
      </a>
    </div>
  );
}

export function TechmecsLogo({ className = "h-7 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <a
      href="https://techmecs.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="techmecs website"
      className={`inline-flex items-center hover:opacity-85 transition-opacity ${className}`}
    >
      <Image
        src="/images/techmecs-logo-dark.webp"
        alt="techmecs"
        width={640}
        height={113}
        className="h-full w-auto object-contain"
      />
    </a>
  );
}
