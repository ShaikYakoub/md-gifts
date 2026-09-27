"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface AutoExpandingTextareaProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function AutoExpandingTextarea({
  id,
  name,
  value,
  onChange,
  placeholder,
  minHeight = 60,
  maxHeight = 220,
  required = false,
  className = "",
  "aria-label": ariaLabel,
}: AutoExpandingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    // Reset height to compute actual scrollHeight accurately
    el.style.height = "auto";
    const nextHeight = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [minHeight, maxHeight]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return (
    <textarea
      ref={textareaRef}
      id={id}
      name={name}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      placeholder={placeholder}
      required={required}
      aria-label={ariaLabel}
      rows={1}
      style={{
        minHeight: `${minHeight}px`,
        maxHeight: `${maxHeight}px`,
        resize: "none",
      }}
      className={`w-full resize-none transition-[height] duration-100 ease-out outline-none ${className}`}
    />
  );
}
