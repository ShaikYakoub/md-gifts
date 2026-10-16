"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Compass },
    { label: "Cart", href: "/cart", icon: ShoppingBag, badge: totalQuantity },
  ];

  // Derive active index based on pathname
  let activeIndex = 0;
  if (pathname.startsWith("/shop") || pathname.startsWith("/categories")) {
    activeIndex = 1;
  } else if (pathname === "/cart") {
    activeIndex = 2;
  }

  // Optimistic active index for instant visual response on tap
  const [optimisticIndex, setOptimisticIndex] = useState(activeIndex);

  useEffect(() => {
    setOptimisticIndex(activeIndex);
  }, [activeIndex]);

  // On product detail pages (dedicated action bar) or admin console, hide mobile bottom nav
  if (pathname.startsWith("/product/") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-[#EDE4DC] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none pointer-events-auto"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = optimisticIndex === index;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOptimisticIndex(index)}
              className={`flex-1 flex flex-col items-center justify-center h-full py-1 cursor-pointer ${
                isActive ? "text-[#EC0B12]" : "text-[#736866]"
              }`}
            >
              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "stroke-[2.4]" : "stroke-[1.85]"
                  }`}
                />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-[#EC0B12] text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center ring-2 ring-white leading-none">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Text Label */}
              <span
                className={`text-[10px] sm:text-[11px] tracking-tight mt-1 ${
                  isActive ? "font-bold" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
