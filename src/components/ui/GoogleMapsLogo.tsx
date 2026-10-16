import React from "react";
import Image from "next/image";

interface GoogleMapsLogoProps {
  className?: string;
  size?: number;
}

export function GoogleMapsLogo({
  className = "w-4.5 h-4.5 shrink-0 object-contain",
  size = 18,
}: GoogleMapsLogoProps) {
  return (
    <Image
      src="/icons/google-maps.png"
      alt="Google Maps"
      width={size}
      height={size}
      className={className}
    />
  );
}
