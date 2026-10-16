import React from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function CategoryLoading() {
  return (
    <SiteLayout>
      <div className="pt-6 pb-28 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        {/* Main Title Skeleton */}
        <div className="pb-4 border-b border-[#EFE4DC] mb-4 sm:mb-6 space-y-2">
          <div className="h-8 w-56 rounded-xl animate-shimmer" />
          <div className="h-4 w-80 rounded-lg animate-shimmer" />
        </div>

        {/* Content Layout Skeleton */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar Skeleton */}
          <div className="w-64 shrink-0 hidden lg:block space-y-4 bg-white p-5 rounded-2xl border border-[#EDE2DA]">
            <div className="h-6 w-24 rounded-lg animate-shimmer" />
            <div className="h-20 w-full rounded-xl animate-shimmer" />
            <div className="h-24 w-full rounded-xl animate-shimmer" />
            <div className="h-24 w-full rounded-xl animate-shimmer" />
          </div>

          {/* Products Column Skeleton */}
          <div className="flex-1 min-w-0">
            {/* Controls Bar Skeleton */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0E6DE]">
              <div className="h-7 w-28 rounded-full animate-shimmer" />
              <div className="h-8 w-32 rounded-xl animate-shimmer" />
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-[#EDE2DA] p-1.5 pb-3 shadow-2xs space-y-2"
                >
                  <div className="w-full aspect-square rounded-xl sm:rounded-2xl animate-shimmer" />
                  <div className="px-1.5 space-y-1.5">
                    <div className="h-4 w-3/4 rounded-md animate-shimmer" />
                    <div className="flex items-center justify-between pt-1">
                      <div className="h-4 w-16 rounded-md animate-shimmer" />
                      <div className="w-6 h-6 rounded-full animate-shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
