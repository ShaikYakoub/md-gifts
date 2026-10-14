"use client";

import React from "react";

interface TechmecsCreditProps {
  className?: string;
}

export function TechmecsCredit({ className = "" }: TechmecsCreditProps) {
  return (
    <div
      className={`inline-flex items-center justify-center gap-1.5 text-xs text-[#7A6D70] font-sans ${className}`}
    >
      <span className="font-normal text-[#6C5E61]">Website by</span>
      <a
        href="https://techmecs.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="techmecs — opens techmecs.com in a new tab"
        className="inline-flex items-baseline font-bold text-sm tracking-tight hover:opacity-85 transition-opacity cursor-pointer group"
      >
        <span className="text-[#221C1D] group-hover:text-black transition-colors">tech</span>
        <span className="text-[#EA4335]">m</span>
        <span className="text-[#4285F4]">e</span>
        <span className="text-[#FBBC05]">c</span>
        <span className="text-[#34A853]">s</span>
        <span className="text-[9px] text-[#7A6D70] group-hover:text-[#221C1D] transition-colors font-semibold ml-0.5 align-super select-none">
          ®
        </span>
      </a>
    </div>
  );
}

export function TechmecsLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <a
      href="https://techmecs.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="techmecs website"
      className={`inline-flex items-center hover:opacity-85 transition-opacity ${className}`}
    >
      <img
        src="/images/techmecs-logo.svg"
        alt="techmecs"
        className="h-full w-auto object-contain"
      />
    </a>
  );
}
