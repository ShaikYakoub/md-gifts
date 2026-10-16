"use client";

import React, { useState } from "react";
import { X, SlidersHorizontal, Check } from "lucide-react";
import { FilterState } from "@/types/catalog";
import { FRAME_COLORS } from "@/data/products";

interface FilterSidebarProps {
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  productCount: number;
}

export function FilterSidebar({
  filterState,
  onFilterChange,
  isOpenMobile,
  onCloseMobile,
  productCount,
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filterState);

  // Sync when prop changes
  React.useEffect(() => {
    setLocalFilters(filterState);
  }, [filterState]);

  // Lock body scroll when mobile filter drawer is open
  React.useEffect(() => {
    if (!isOpenMobile) {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      return;
    }

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseMobile();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpenMobile, onCloseMobile]);

  const handlePriceChange = (val: number) => {
    const updated = { ...localFilters, maxPrice: val };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const toggleSize = (sizeKey: string) => {
    const exists = localFilters.sizes.includes(sizeKey);
    const updated = {
      ...localFilters,
      sizes: exists
        ? localFilters.sizes.filter((s) => s !== sizeKey)
        : [...localFilters.sizes, sizeKey],
    };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const toggleMaterial = (mat: string) => {
    const exists = localFilters.materials.includes(mat);
    const updated = {
      ...localFilters,
      materials: exists
        ? localFilters.materials.filter((m) => m !== mat)
        : [...localFilters.materials, mat],
    };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const toggleColor = (colorName: string) => {
    const exists = localFilters.colors.includes(colorName);
    const updated = {
      ...localFilters,
      colors: exists
        ? localFilters.colors.filter((c) => c !== colorName)
        : [...localFilters.colors, colorName],
    };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const resetState: FilterState = {
      minPrice: 0,
      maxPrice: 5000,
      sizes: [],
      colors: [],
      materials: [],
      frameColors: [],
      sort: localFilters.sort,
    };
    setLocalFilters(resetState);
    onFilterChange(resetState);
  };

  const filterContent = (
    <div className="space-y-6 text-sm text-[#221C1D]">
      {/* Header with Reset (Desktop only) */}
      <div className="hidden lg:flex items-center justify-between pb-3 border-b border-[#EFE4DC]">
        <div className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-[#EC0B12]" />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold text-[#EC0B12] hover:underline"
        >
          Reset
        </button>
      </div>

      {/* 1. Price Range */}
      <div>
        <div className="flex items-center justify-between font-semibold text-xs text-[#3E3335] mb-2.5">
          <span>Price Range</span>
          <span className="text-[#EC0B12]">Up to ₹{localFilters.maxPrice || 5000}</span>
        </div>
        <input
          type="range"
          min="200"
          max="5000"
          step="50"
          value={localFilters.maxPrice || 5000}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-[#EC0B12] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#8C7D80] mt-1">
          <span>₹200</span>
          <span>₹5,000+</span>
        </div>
      </div>

      {/* 2. Size */}
      <div>
        <div className="font-semibold text-xs text-[#3E3335] mb-2.5">
          Size
        </div>
        <div className="space-y-2">
          {[
            { label: 'Small (up to 8")', key: "small" },
            { label: 'Medium (9" – 12")', key: "medium" },
            { label: 'Large (above 12")', key: "large" },
          ].map((item) => {
            const isChecked = localFilters.sizes.includes(item.key);
            return (
              <label
                key={item.key}
                className="flex items-center gap-2.5 text-xs text-[#5C4F51] cursor-pointer hover:text-[#221C1D]"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSize(item.key)}
                  className="rounded border-[#D1C4BC] text-[#EC0B12] focus:ring-[#EC0B12] w-4 h-4"
                />
                <span>{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Color Swatches */}
      <div>
        <div className="font-semibold text-xs text-[#3E3335] mb-2.5">
          Color
        </div>
        <div className="flex flex-wrap gap-2">
          {FRAME_COLORS.map((c) => {
            const isSelected = localFilters.colors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => toggleColor(c.name)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isSelected ? "ring-2 ring-offset-2 ring-[#EC0B12] scale-110" : "border border-[#D1C5BD]"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Filter by ${c.name}`}
              >
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      c.hex === "#FFFFFF" || c.hex === "#FAF5F1"
                        ? "text-[#221C1D]"
                        : "text-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Material */}
      <div>
        <div className="font-semibold text-xs text-[#3E3335] mb-2.5">
          Material
        </div>
        <div className="space-y-2">
          {["Wood", "Acrylic", "Metal", "Plastic"].map((mat) => {
            const isChecked = localFilters.materials.includes(mat);
            return (
              <label
                key={mat}
                className="flex items-center gap-2.5 text-xs text-[#5C4F51] cursor-pointer hover:text-[#221C1D]"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleMaterial(mat)}
                  className="rounded border-[#D1C4BC] text-[#EC0B12] focus:ring-[#EC0B12] w-4 h-4"
                />
                <span>{mat}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-[#EDE2DA] shadow-xs self-start sticky top-28">
        {filterContent}
      </aside>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Bottom Sheet Box */}
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl flex flex-col z-10 animate-slide-up border border-[#EDE2DA]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE4DC]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#EC0B12]" />
                <h3 className="font-serif text-lg font-bold text-[#221C1D]">
                  Filters
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 text-[#5C4F51] hover:text-[#EC0B12] rounded-full transition-colors cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain py-4">
              {filterContent}
            </div>

            <div
              className="pt-3 border-t border-[#EFE4DC] flex items-center gap-2.5"
              style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))" }}
            >
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 rounded-xl border border-[#DDCFC6] hover:bg-[#FEF2F2] text-[#5C4F51] hover:text-[#EC0B12] font-semibold text-sm transition-colors cursor-pointer shrink-0"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex-1 bg-[#EC0B12] hover:bg-[#D0080E] text-white py-3 px-4 rounded-xl font-semibold text-sm transition-transform active:scale-95 shadow-sm text-center cursor-pointer truncate"
              >
                Apply Filters ({productCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
