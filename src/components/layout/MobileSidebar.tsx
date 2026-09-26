"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Search,
  Home,
  LayoutGrid,
  PenLine,
  Image as ImageIcon,
  Coffee,
  Key,
  Home as DecorIcon,
  Gift,
  Star,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Info,
  FileText,
  MessageCircle,
  User,
  Cake,
  Flame,
  Heart,
  Users,
  Sparkles,
  Baby,
  PartyPopper,
  CalendarDays,
  HeartHandshake,
  Smile,
  Briefcase,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { OCCASIONS, RECIPIENTS } from "@/data/categories";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icon mappings matching input_file_1.png
const OCCASION_ICONS: Record<string, React.ElementType> = {
  birthdays: Cake,
  anniversaries: Flame,
  couples: Heart,
  families: Users,
  festivals: Sparkles,
  "new-baby": Baby,
  housewarming: DecorIcon,
  weddings: PartyPopper,
  "all-occasions": CalendarDays,
};

const RECIPIENT_ICONS: Record<string, React.ElementType> = {
  "for-her": Heart,
  "for-him": User,
  "for-couples": HeartHandshake,
  "for-parents": Users,
  "for-friends": Smile,
  "for-kids": Baby,
  "for-colleagues": Briefcase,
  "for-everyone": Gift,
};

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(true);
  const [isRecipientsOpen, setIsRecipientsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        className="relative w-[85%] max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-right overflow-hidden"
      >
        {/* Drawer Header matching screenshot */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0E6DE] shrink-0">
          <Logo size="md" />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5C4F51] hover:text-[#C85250] hover:bg-[#FAF2EE] rounded-full transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Search matching screenshot */}
        <div className="p-4 border-b border-[#F4EBE5] shrink-0">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[#8C7D80] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for gifts, frames, occasions..."
              className="w-full bg-[#FAF5F1] text-sm text-[#221C1D] placeholder-[#8C7D80] pl-10 pr-3 py-2.5 rounded-lg border border-[#EDE0D6] focus:border-[#C85250] outline-none"
            />
          </form>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-sm text-[#3E3335]">
          {/* Main Links */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#FAF0EC] text-[#C85250] font-medium"
          >
            <Home className="w-4 h-4 text-[#C85250]" />
            <span>Home</span>
          </Link>

          <Link
            href="/shop"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-4 h-4 text-[#7A6E70]" />
              <span>All Gifts</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <Link
            href="/categories/personalized-gifts"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <PenLine className="w-4 h-4 text-[#7A6E70]" />
              <span>Personalized Gifts</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <Link
            href="/categories/frames"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4 text-[#7A6E70]" />
              <span>Frames</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <Link
            href="/categories/mugs"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Coffee className="w-4 h-4 text-[#7A6E70]" />
              <span>Mugs</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <Link
            href="/categories/keychains"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-[#7A6E70]" />
              <span>Keychains</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <Link
            href="/categories/home-decor"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <DecorIcon className="w-4 h-4 text-[#7A6E70]" />
              <span>Home Decor</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <Link
            href="/categories/gift-boxes"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4 text-[#7A6E70]" />
              <span>Gift Boxes</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <Link
            href="/shop?filter=new"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-[#7A6E70]" />
              <span>New Arrivals</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <Link
            href="/shop?filter=trending"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-[#7A6E70]" />
              <span>Best Sellers</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <div className="pt-2 pb-1 border-t border-[#F0E6DE] my-2" />

          {/* Shop by Occasion Accordion matching input_file_1.png */}
          <div>
            <button
              type="button"
              onClick={() => setIsOccasionsOpen(!isOccasionsOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-[#221C1D] hover:text-[#C85250] rounded-lg transition-colors cursor-pointer"
            >
              <span>Shop by Occasion</span>
              <ChevronDown
                className={`w-4 h-4 text-[#8C7D80] transition-transform ${isOccasionsOpen ? "rotate-180 text-[#C85250]" : ""}`}
              />
            </button>

            {isOccasionsOpen && (
              <div className="pl-2 pr-1 py-1 space-y-0.5">
                {OCCASIONS.map((occ) => {
                  const OccIcon = OCCASION_ICONS[occ.slug] || Sparkles;
                  return (
                    <Link
                      key={occ.slug}
                      href={`/categories/${occ.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#5C4F51] hover:text-[#C85250] hover:bg-[#FAF4F0] transition-colors"
                    >
                      <OccIcon className="w-4 h-4 text-[#C85250]/80 shrink-0" />
                      <span>{occ.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shop by Recipient Accordion matching input_file_1.png */}
          <div>
            <button
              type="button"
              onClick={() => setIsRecipientsOpen(!isRecipientsOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-[#221C1D] hover:text-[#C85250] rounded-lg transition-colors cursor-pointer"
            >
              <span>Shop by Recipient</span>
              <ChevronDown
                className={`w-4 h-4 text-[#8C7D80] transition-transform ${isRecipientsOpen ? "rotate-180 text-[#C85250]" : ""}`}
              />
            </button>

            {isRecipientsOpen && (
              <div className="pl-2 pr-1 py-1 space-y-0.5">
                {RECIPIENTS.map((rec) => {
                  const RecIcon = RECIPIENT_ICONS[rec.slug] || Gift;
                  return (
                    <Link
                      key={rec.slug}
                      href={`/categories/${rec.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#5C4F51] hover:text-[#C85250] hover:bg-[#FAF4F0] transition-colors"
                    >
                      <RecIcon className="w-4 h-4 text-[#C85250]/80 shrink-0" />
                      <span>{rec.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2 pb-1 border-t border-[#F0E6DE] my-2" />

          {/* Informational & Store Links */}
          <Link
            href="/shop"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4 text-[#7A6E70]" />
              <span>Browse All Gifts</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <Link
            href="/about"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-[#7A6E70]" />
              <span>About Us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <Link
            href="/faq"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#7A6E70]" />
              <span>Help & FAQ</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>

          <Link
            href="/policies"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAF4F0] hover:text-[#C85250] transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#7A6E70]" />
              <span>Terms & Policies</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#BDB2B4]" />
          </Link>
        </div>

        {/* Drawer Bottom Actions: WhatsApp Order & Help */}
        <div className="p-4 border-t border-[#F0E6DE] space-y-2.5 bg-white shrink-0">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#075E54] text-white py-3 px-4 rounded-xl font-medium text-sm transition-colors shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Order & Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
