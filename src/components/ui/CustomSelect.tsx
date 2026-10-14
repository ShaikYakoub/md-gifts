"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  ariaLabel?: string;
  className?: string;
  align?: "left" | "right";
  buttonClassName?: string;
}

export function CustomSelect<T extends string = string>({
  value,
  onChange,
  options,
  ariaLabel = "Select option",
  className = "",
  align = "right",
  buttonClassName = "",
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
          const currentIdx = options.findIndex((opt) => opt.value === value);
          setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < options.length) {
            onChange(options[focusedIndex].value);
            setIsOpen(false);
            buttonRef.current?.focus();
          }
          break;
        case "Tab":
          setIsOpen(false);
          break;
      }
    },
    [isOpen, options, value, focusedIndex, onChange]
  );

  const handleSelect = (val: T) => {
    onChange(val);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            const currentIdx = options.findIndex((opt) => opt.value === value);
            setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`inline-flex items-center justify-between gap-2 bg-white border border-[#DDCFC6] hover:border-[#BDB0A8] focus:border-[#EC0B12] focus:ring-2 focus:ring-[#EC0B12]/15 text-[#221C1D] rounded-full pl-3.5 pr-2.5 py-1.5 sm:py-2 text-xs font-medium cursor-pointer shadow-2xs transition-all select-none outline-none ${
          isOpen ? "border-[#EC0B12] ring-2 ring-[#EC0B12]/15" : ""
        } ${buttonClassName}`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#7A6D70] transition-transform duration-200 ease-out shrink-0 ${
            isOpen ? "rotate-180 text-[#EC0B12]" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          role="listbox"
          aria-label={ariaLabel}
          tabIndex={-1}
          className={`absolute top-full mt-1.5 z-50 min-w-[180px] w-max bg-white/98 backdrop-blur-md rounded-2xl shadow-[0_12px_32px_rgba(34,28,29,0.12)] border border-[#EDE2DA] p-1.5 flex flex-col gap-0.5 outline-none transition-all duration-150 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option, idx) => {
            const isSelected = option.value === value;
            const isFocused = idx === focusedIndex;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(idx)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-xs rounded-xl cursor-pointer select-none transition-colors text-left ${
                  isSelected
                    ? "bg-[#FEF2F2] text-[#EC0B12] font-semibold"
                    : isFocused
                    ? "bg-[#FAF5F2] text-[#221C1D] font-medium"
                    : "text-[#4A3E40] hover:bg-[#FAF5F2] hover:text-[#221C1D] font-medium"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#EC0B12] shrink-0 stroke-[2.5]" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
