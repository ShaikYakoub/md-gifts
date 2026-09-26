import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbLabel: string;
  navItems?: NavItem[];
  children: React.ReactNode;
}

export function InfoPageLayout({
  title,
  subtitle,
  breadcrumbLabel,
  navItems,
  children,
}: InfoPageLayoutProps) {
  const hasNav = navItems && navItems.length > 0;

  return (
    <SiteLayout>
      <div className={`pt-6 pb-28 sm:py-12 mx-auto px-4 sm:px-6 lg:px-8 ${hasNav ? "max-w-7xl" : "max-w-4xl"}`}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#7A6D70] mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#C85250] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8ACA9]" />
          <span className="text-[#221C1D] font-medium">{breadcrumbLabel}</span>
        </nav>

        {hasNav ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#EDE2DA] shadow-2xs space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    item.isActive
                      ? "bg-[#FAF0EC] text-[#C85250] font-semibold"
                      : "text-[#5C4F51] hover:bg-[#FAF4F0] hover:text-[#C85250]"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${item.isActive ? "text-[#C85250]" : "text-[#C2B5B0]"}`} />
                </Link>
              ))}
            </aside>

            <div className="lg:col-span-9 bg-white p-6 sm:p-10 rounded-2xl border border-[#EDE2DA] shadow-xs">
              <div className="pb-6 border-b border-[#EFE4DC] mb-6">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-[#7A6D70] mt-1.5 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {children}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#EDE2DA] shadow-xs">
            <div className="pb-6 border-b border-[#EFE4DC] mb-6">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-[#7A6D70] mt-1.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {children}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
