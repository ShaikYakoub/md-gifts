import React from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function ProductLoading() {
  return (
    <SiteLayout>
      <div className="relative pt-0 sm:pt-4 pb-32 sm:py-10 max-w-7xl mx-auto animate-pulse">
        {/* Mobile floating back button placeholder */}
        <div className="fixed top-3.5 left-3.5 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E0D3CC] md:hidden shadow-md" />

        {/* Desktop title placeholder */}
        <div className="hidden sm:block px-6 lg:px-8 mb-6 space-y-2">
          <div className="h-8 w-64 rounded-xl animate-shimmer" />
          <div className="h-4 w-96 rounded-lg animate-shimmer" />
        </div>

        {/* Main Product Showcase Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-6 lg:gap-12 items-start sm:px-6 lg:px-8">
          {/* Left Column: Image Skeleton */}
          <div className="lg:col-span-7 px-4 pt-4 sm:px-0 sm:pt-0">
            <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EDE2DA] animate-shimmer shadow-xs" />
          </div>

          {/* Right Column: Options & Selectors Skeleton */}
          <div className="lg:col-span-5 px-4 sm:px-0 space-y-3.5 pt-0">
            {/* Mobile Title Placeholder */}
            <div className="sm:hidden space-y-2">
              <div className="h-7 w-4/5 rounded-xl animate-shimmer" />
            </div>

            {/* Price Header Skeleton */}
            <div className="pb-3 border-b border-[#EFE4DC] space-y-2">
              <div className="h-7 w-28 rounded-lg animate-shimmer" />
              <div className="h-4 w-36 rounded-md animate-shimmer" />
            </div>

            {/* Sizes Row Skeleton */}
            <div className="space-y-2">
              <div className="h-3.5 w-12 rounded-md animate-shimmer" />
              <div className="flex gap-2">
                <div className="h-7 w-20 rounded-lg animate-shimmer" />
                <div className="h-7 w-20 rounded-lg animate-shimmer" />
                <div className="h-7 w-20 rounded-lg animate-shimmer" />
              </div>
            </div>

            {/* Color Swatches Skeleton */}
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-20 rounded-md animate-shimmer" />
              <div className="flex gap-3 pb-3">
                <div className="w-8 h-8 rounded-lg animate-shimmer" />
                <div className="w-8 h-8 rounded-lg animate-shimmer" />
                <div className="w-8 h-8 rounded-lg animate-shimmer" />
                <div className="w-8 h-8 rounded-lg animate-shimmer" />
                <div className="w-8 h-8 rounded-lg animate-shimmer" />
              </div>
            </div>

            {/* Material Skeleton */}
            <div className="space-y-2">
              <div className="h-3.5 w-16 rounded-md animate-shimmer" />
              <div className="flex gap-2">
                <div className="h-7 w-16 rounded-lg animate-shimmer" />
                <div className="h-7 w-16 rounded-lg animate-shimmer" />
              </div>
            </div>

            {/* Customization Button Skeleton */}
            <div className="pt-1">
              <div className="h-8 w-36 rounded-lg animate-shimmer" />
            </div>

            {/* Description Dropdown Skeleton */}
            <div className="pt-3 border-t border-[#EFE4DC]">
              <div className="h-5 w-28 rounded-md animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Bar Skeleton */}
        <div
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#EFE4DC] py-2.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="w-11 h-11 rounded-full animate-shimmer" />
            <div className="flex-1 max-w-md h-11 rounded-full animate-shimmer" />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
