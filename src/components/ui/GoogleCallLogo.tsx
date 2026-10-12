import React from "react";

interface GoogleCallLogoProps {
  className?: string;
  size?: number;
}

export function GoogleCallLogo({ className = "w-4.5 h-4.5 shrink-0", size }: GoogleCallLogoProps) {
  return (
    <svg
      viewBox="0 0 14 15"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Red Earpiece (Top left capsule) */}
      <path
        d="M2.5 0.5C3.8 0.5 4.9 1.4 5.3 2.7L5.7 4.1C6.0 5.1 5.5 6.2 4.5 6.7L3.4 7.2C2.8 7.5 2.1 7.3 1.6 6.8L0.9 5.8C0.4 4.9 0.5 3.7 1.3 2.9L2.5 0.5Z"
        fill="#EA4335"
      />

      {/* Yellow Transition Crook */}
      <path
        d="M0.9 5.8C0.6 6.4 0.7 7.1 1.2 7.7L1.9 8.4C2.5 9.0 3.3 9.1 3.9 8.7L3.4 7.2C2.8 7.5 2.1 7.3 1.6 6.8L0.9 5.8Z"
        fill="#FBBC04"
      />

      {/* Blue Curved Handle */}
      <path
        d="M1.2 7.7C0.8 8.6 1.4 9.6 2.3 10.6C3.6 12.1 5.3 13.3 7.3 13.9C8.6 14.3 9.9 14.3 10.8 13.8L9.9 12.3C9.2 12.6 8.3 12.6 7.4 12.3C5.8 11.8 4.4 10.8 3.3 9.5C2.7 8.8 2.3 8.1 2.2 7.5L1.2 7.7Z"
        fill="#4285F4"
      />

      {/* Green Mouthpiece */}
      <path
        d="M9.8 10.4C9.2 9.6 9.3 8.5 10.1 7.9L11.2 7.0C12.1 6.3 13.3 6.5 13.9 7.4L14.3 8.0C14.9 8.9 14.7 10.1 13.8 10.7L12.7 11.6C11.9 12.3 10.7 12.1 10.1 11.2L9.8 10.4Z"
        fill="#34A853"
      />
    </svg>
  );
}
