"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();

  // On product detail pages, the bottom area is dedicated to the Product Action Bar (Buy Now + Add To Cart)
  if (pathname.startsWith("/product/")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Compass },
    { label: "Search", href: "/search", icon: Search },
    { label: "Cart", href: "/cart", icon: ShoppingBag, badge: totalQuantity },
  ];

  // Derive active index based on pathname
  let activeIndex = 0;
  if (pathname.startsWith("/shop") || pathname.startsWith("/categories")) {
    activeIndex = 1;
  } else if (pathname === "/search") {
    activeIndex = 2;
  } else if (pathname === "/cart") {
    activeIndex = 3;
  }

  // Optimistic active index for instant gliding feedback on tap
  const [optimisticIndex, setOptimisticIndex] = useState(activeIndex);

  useEffect(() => {
    setOptimisticIndex(activeIndex);
  }, [activeIndex]);

  const containerRef = useRef<HTMLDivElement>(null);

  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
    height: number;
    top: number;
    ready: boolean;
  }>({ left: 6, width: 88, height: 36, top: 6, ready: true });

  useEffect(() => {
    const updatePosition = () => {
      if (!containerRef.current) return;
      const links = containerRef.current.querySelectorAll("a");
      const activeEl = links[optimisticIndex] as HTMLElement | undefined;
      if (activeEl && activeEl.offsetWidth > 0) {
        setIndicator({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          top: activeEl.offsetTop,
          height: activeEl.offsetHeight,
          ready: true,
        });
      }
    };

    updatePosition();
    const frameId = requestAnimationFrame(updatePosition);
    const timer1 = setTimeout(updatePosition, 30);
    const timer2 = setTimeout(updatePosition, 100);

    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", updatePosition);
    };
  }, [optimisticIndex, pathname]);

  return (
    <nav
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-auto"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      aria-label="Mobile Bottom Navigation"
    >
      <div
        ref={containerRef}
        className="relative flex items-center bg-[#18181B]/95 backdrop-blur-xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.35)] rounded-full p-1.5 transition-all"
      >
        {/* Smooth Gliding Capsule Pill Indicator */}
        <div
          className={`absolute rounded-full bg-gradient-to-r from-[#C85250] to-[#E26D68] shadow-xs pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            indicator.ready ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
            width: `${indicator.width}px`,
            height: `${indicator.height}px`,
            top: 0,
            left: 0,
          }}
        />

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = optimisticIndex === index;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOptimisticIndex(index)}
              className={`relative z-10 flex items-center rounded-full cursor-pointer transition-colors duration-250 py-2 ${
                isActive ? "text-white px-3.5 gap-1.5" : "text-white/60 hover:text-white px-2.5"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-4.5 h-4.5 transition-transform duration-250 ${
                    isActive ? "stroke-[2.4] scale-105" : "stroke-[1.8]"
                  }`}
                />
                {!isActive && Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C85250] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#18181B]">
                    {item.badge}
                  </span>
                )}
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center ${
                  isActive ? "max-w-20 opacity-100" : "max-w-0 opacity-0 pointer-events-none"
                }`}
              >
                <span className="text-xs font-semibold tracking-tight whitespace-nowrap pl-0.5">
                  {item.label}
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="ml-1 bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
