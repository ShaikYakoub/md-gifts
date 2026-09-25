"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();

  const navItems = [
    { label: "Home", href: "/", icon: Home, isActive: pathname === "/" },
    {
      label: "Categories",
      href: "/categories",
      icon: LayoutGrid,
      isActive: pathname.startsWith("/categories"),
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
      icon: ShoppingCart,
      isActive: pathname === "/cart",
      badge: totalQuantity,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EFE4DC] px-2 pt-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom, 0px))" }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors relative ${
                item.isActive ? "text-[#C85250] font-semibold" : "text-[#7A6E70] hover:text-[#221C1D]"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.isActive ? "stroke-[2.2]" : "stroke-[1.7]"}`} />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C85250] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
