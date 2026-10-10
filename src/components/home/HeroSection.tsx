"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLiveCatalog } from "@/context/CatalogContext";
import rawBanners from "../../../content/banners.json";
import { Banner } from "@/types/catalog";

interface BannerSlide {
  id: string;
  image: string;
  alt: string;
  link: string;
}

const BASE_BANNERS = rawBanners as Banner[];

export function HeroSection() {
  const { banners } = useLiveCatalog();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const slides: BannerSlide[] = useMemo(() => {
    const list = banners && banners.length > 0 ? banners : BASE_BANNERS;
    return list
      .filter((b) => b.enabled !== false)
      .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999))
      .map((b) => ({
        id: b.id,
        image: b.image,
        alt: `${b.title} - ${b.description}`,
        link: b.link,
      }));
  }, [banners]);

  // Ensure currentSlide is within bounds if banners change
  useEffect(() => {
    if (slides.length > 0 && currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-advance banner every 5.5 seconds unless user hovers
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, slides.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(null);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden bg-transparent py-3 sm:py-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional banner slider"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Sliding Container - 1.5x height on mobile screens */}
        <div className="relative w-full aspect-[1.9/1] sm:aspect-[3.05/1] rounded-xl overflow-hidden border border-[#EDE2DA] shadow-md bg-[#FAF4F0]">
          {/* Slides Track */}
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {slides.map((slide, idx) => (
              <Link
                key={slide.id}
                href={slide.link}
                className="relative w-full h-full shrink-0 block cursor-pointer"
                aria-label={slide.alt}
                tabIndex={currentSlide === idx ? 0 : -1}
              >
                {/* Full-bleed crisp banner graphic without any obscuring overlay */}
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 1280px"
                  className="object-cover object-center"
                />
              </Link>
            ))}
          </div>

          {/* Navigation Arrows (Desktop / Tablet) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous slide"
            className="hidden sm:flex absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-[#221C1D] hover:text-[#C85250] items-center justify-center shadow-lg backdrop-blur-xs transition-all border border-[#EDE2DA]/90 hover:scale-105 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next slide"
            className="hidden sm:flex absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-[#221C1D] hover:text-[#C85250] items-center justify-center shadow-lg backdrop-blur-xs transition-all border border-[#EDE2DA]/90 hover:scale-105 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots / Progress Pills */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToSlide(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? "w-6 sm:w-7 h-2 bg-white shadow-xs"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
