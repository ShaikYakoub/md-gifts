import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { TopLoader } from "@/components/ui/TopLoader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#EC0B12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mdgifts.in"),
  title: {
    default: "MD Gifts — Thoughtful Personalized Gifts & Customized Gift Centre",
    template: "%s | MD Gifts",
  },
  description:
    "Discover handcrafted personalized photo frames, custom mugs, acrylic keepsakes, and curated gift boxes for birthdays, anniversaries, couples, and every special moment from MD Gifts Kadapa.",
  keywords: [
    "personalized gifts",
    "photo frames",
    "couple gifts",
    "birthday gifts",
    "anniversary gifts",
    "customized mugs",
    "acrylic frames",
    "gift boxes",
    "MD Gifts",
    "MD Gifts Kadapa",
    "Customized Gift Centre Kadapa",
  ],
  authors: [{ name: "MD Gifts" }],
  creator: "MD Gifts",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mdgifts.in",
    siteName: "MD Gifts",
    title: "MD Gifts — Gifts made for the people who matter",
    description:
      "Personalized frames, gifts & keepsakes for every occasion. Handcrafted with love at MD Gifts, Kadapa and delivered across India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MD Gifts — Thoughtful Personalized Gifts",
    description:
      "Handcrafted personalized photo frames, custom mugs, acrylic keepsakes, and curated gift boxes from MD Gifts.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${outfit.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#FAF7F4] text-[#221C1D] min-h-screen flex flex-col selection:bg-[#FEECEE] selection:text-[#EC0B12]">
        <TopLoader />
        <CatalogProvider>
          <CartProvider>
            {children}
            <MobileBottomNav />
          </CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
