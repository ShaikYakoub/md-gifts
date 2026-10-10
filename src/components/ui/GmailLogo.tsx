import React from "react";

interface GmailLogoProps {
  className?: string;
  size?: number;
}

export function GmailLogo({ className = "w-5 h-5", size = 20 }: GmailLogoProps) {
  return (
    <svg
      viewBox="52 42 88 66"
      width={size}
      height={Math.round(size * (66 / 88))}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left Blue Pillar */}
      <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
      {/* Right Green Pillar */}
      <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
      {/* Top Right Yellow Arch */}
      <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
      {/* Center Red Fold */}
      <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92" />
      {/* Top Left Dark Red Arch & Shadow */}
      <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
    </svg>
  );
}
