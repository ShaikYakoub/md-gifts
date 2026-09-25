import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF4F0] via-[#FDF8F5] to-[#FAF7F4] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#221C1D] leading-[1.15]">
              Gifts made for the people who matter.
            </h1>

            <p className="text-base sm:text-lg text-[#6C5E61] max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Personalized frames, gifts & keepsakes for every occasion. Handcrafted with love and delivered across India.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C85250] hover:bg-[#B14140] text-white px-7 py-3.5 rounded-xl font-medium text-base transition-all duration-200 active:scale-95 shadow-md shadow-[#C85250]/20"
              >
                <span>Explore Gifts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual Image Column */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Decorative warm aura glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#F8D7C9]/40 to-[#FBE8DF]/60 rounded-3xl blur-2xl pointer-events-none" />

              {/* Masterpiece Hero Art */}
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#FAF1EB] border border-[#EFE0D5] shadow-xl">
                <Image
                  src="/images/hero-lifestyle.jpg"
                  alt="Personalized couple wooden photo frame with gift box and candle"
                  fill
                  priority
                  className="object-cover object-center transform transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
