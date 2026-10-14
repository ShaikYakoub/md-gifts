import React from "react";

interface GoogleCallLogoProps {
  className?: string;
  size?: number;
}

export function GoogleCallLogo({ className = "w-4.5 h-4.5 shrink-0", size }: GoogleCallLogoProps) {
  return (
    <svg
      viewBox="0 5 242 245"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Red Earpiece (Top left capsule) */}
      <path
        d="M85.7 88.4l5.5-5.3c6.5-6.5 6.5-17.2 0-23.7L45.9 14.1c-6.5-6.5-17.2-6.5-23.7 0l-1.6 1.1C10.1 25.7 3.8 39.3 1.2 54.6L60 113.3L85.7 88.4z"
        fill="#EA4335"
      />

      {/* Yellow Transition Crook */}
      <path
        d="M1.2 54.6c-4.6 28 3.6 61.9 23.1 94.4l25-11.7L60 113.3L39 79L1.2 54.6z"
        fill="#FBBC04"
      />

      {/* Blue Curved Handle & Lower Neck */}
      <path
        d="M24.4 149c8.8 14.6 20.5 29.3 33.8 42.6c13.3 13.3 28.3 25.2 42.9 34l35.7-35.6L60 113.3"
        fill="#4285F4"
      />
      <path
        d="M195.4 248.8c-28 4.6-61.9-3.7-94.4-23.1l10.9-24.3l24.7-11.4l38.7 22.1L195.4 248.8z"
        fill="#4285F4"
      />

      {/* Green Mouthpiece (Bottom right capsule) */}
      <path
        d="M237.2 225.8c5.3-5.1 5.5-13.4 0.5-18.7l-48.2-51.4c-5.3-5-13.5-4.9-18.6 0.2L136.7 190l58.7 58.7c15.9-2.3 27.8-9.1 38.6-19.9L237.2 225.8z"
        fill="#34A853"
      />
    </svg>
  );
}

export const ContactLogo = GoogleCallLogo;
