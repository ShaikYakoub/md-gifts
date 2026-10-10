"use client";

import React from "react";
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
    { label: "Home", href: "/", icon: Home, isActive: pathname === "/" },
    {
      label: "Shop",
      href: "/shop",
      icon: Compass,
      isActive: pathname.startsWith("/shop") || pathname.startsWith("/categories"),
    },
    {
      label: "Search",
      href: "/search",
      icon: Search,
      isActive: pathname === "/search",
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingBag,
      isActive: pathname === "/cart",
      badge: totalQuantity,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-auto"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center gap-1 bg-[#18181B]/95 backdrop-blur-xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.35)] rounded-full p-1.5 transition-all">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex items-center transition-all duration-300 rounded-full cursor-pointer ${
                item.isActive
                  ? "bg-gradient-to-r from-[#C85250] to-[#E26D68] text-white px-3.5 py-2 shadow-xs gap-1.5"
                  : "text-white/60 hover:text-white p-2.5 hover:bg-white/5"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-4.5 h-4.5 ${
                    item.isActive ? "stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />
                {!item.isActive && Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C85250] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#18181B]">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.isActive ? (
                <span className="text-xs font-semibold tracking-tight whitespace-nowrap">
                  {item.label}
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="ml-1.5 bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
