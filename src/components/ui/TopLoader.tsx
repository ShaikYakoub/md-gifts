"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function TopLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentUrlRef = useRef<string>("");

  // Track the current URL to prevent loading on same-page clicks
  useEffect(() => {
    currentUrlRef.current = window.location.pathname + window.location.search;
  }, [pathname, searchParams]);

  // Complete the loader when navigation finishes (pathname/searchParams change)
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setIsNavigating(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(hideTimer);
    }
  }, [pathname, searchParams, isNavigating]);

  // Global click interceptor for internal links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, downloads, anchors, or new-window clicks
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        target.getAttribute("target") === "_blank" ||
        target.getAttribute("download") !== null ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }

      // Check if clicking the same page
      const targetUrl = new URL(target.href, window.location.href);
      const isSamePage =
        targetUrl.pathname === window.location.pathname &&
        targetUrl.search === window.location.search;

      if (isSamePage) {
        return;
      }

      // Start navigation loader
      if (timerRef.current) clearInterval(timerRef.current);
      setVisible(true);
      setIsNavigating(true);
      setProgress(20);

      // Smooth step increment while waiting for route payload
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 80;
          }
          if (prev < 50) return prev + 15;
          return prev + 6;
        });
      }, 150);
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[2.5px] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full relative"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #EC0B12 0%, #FF262D 50%, #FFA8A8 100%)",
          boxShadow: "0 0 10px rgba(236, 11, 18, 0.7), 0 0 4px rgba(236, 11, 18, 0.5)",
          transition:
            progress === 100
              ? "width 180ms ease-out, opacity 200ms ease-out 100ms"
              : "width 240ms cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: progress === 100 ? 0 : 1,
        }}
      >
        {/* Subtle glowing specular tip at the front edge */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-white/50 blur-[2px]" />
      </div>
    </div>
  );
}

export function TopLoader() {
  return (
    <Suspense fallback={null}>
      <TopLoaderInner />
    </Suspense>
  );
}
