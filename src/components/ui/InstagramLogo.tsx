import React from "react";

interface InstagramLogoProps {
  className?: string;
  size?: number;
}

export function InstagramLogo({ className = "w-5 h-5", size = 20 }: InstagramLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="ig-radial-gradient-footer"
          cx="20%"
          cy="110%"
          r="135%"
          fx="20%"
          fy="110%"
        >
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="15%" stopColor="#FFDD55" />
          <stop offset="50%" stopColor="#FF543E" />
          <stop offset="65%" stopColor="#C837AB" />
          <stop offset="100%" stopColor="#5851DB" />
        </radialGradient>
      </defs>
      {/* Squircle Background */}
      <rect width="24" height="24" rx="6" fill="url(#ig-radial-gradient-footer)" />
      {/* Camera Outer Rounded Rect */}
      <rect
        x="4.75"
        y="4.75"
        width="14.5"
        height="14.5"
        rx="4.25"
        stroke="#FFFFFF"
        strokeWidth="1.6"
      />
      {/* Lens Circle */}
      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke="#FFFFFF"
        strokeWidth="1.6"
      />
      {/* Flash Dot */}
      <circle cx="15.8" cy="8.2" r="1" fill="#FFFFFF" />
    </svg>
  );
}
