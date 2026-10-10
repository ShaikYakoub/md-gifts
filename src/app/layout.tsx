import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CatalogProvider } from "@/context/CatalogContext";

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
  themeColor: "#C85250",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://giftly.in"),
  title: {
    default: "Giftly — Thoughtful Personalized Gifts & Photo Frames",
    template: "%s | Giftly",
  },
  description:
    "Discover handcrafted personalized photo frames, custom mugs, acrylic keepsakes, and curated gift boxes for birthdays, anniversaries, couples, and every special moment.",
  keywords: [
    "personalized gifts",
    "photo frames",
    "couple gifts",
    "birthday gifts",
    "anniversary gifts",
    "customized mugs",
    "acrylic frames",
    "gift boxes",
    "Giftly India",
  ],
  authors: [{ name: "Giftly" }],
  creator: "Giftly",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://giftly.in",
    siteName: "Giftly",
    title: "Giftly — Gifts made for the people who matter",
    description:
      "Personalized frames, gifts & keepsakes for every occasion. Handcrafted with love and delivered across India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giftly — Thoughtful Personalized Gifts",
    description:
      "Handcrafted personalized photo frames, custom mugs, acrylic keepsakes, and curated gift boxes.",
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
      <body className="font-sans antialiased bg-[#FAF7F4] text-[#221C1D] min-h-screen flex flex-col selection:bg-[#FBE8E7] selection:text-[#C85250]">
        <CatalogProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
