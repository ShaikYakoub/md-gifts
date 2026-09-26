# Giftly — Personalized Gifts Ecommerce Website

A modern mobile-first personalized gift shop ecommerce platform built with **Next.js 15 (Static HTML Export)**, **TypeScript**, **Tailwind CSS**, and **Cloudflare Pages** deployment.

Designed to match the provided screenshot design specifications with exact typography, color palettes, visual density, responsive drawers, bottom navigation, and quick-view customization flows with seamless WhatsApp ordering.

---

## 🚀 Key Features

- **Screenshot-Fidelity Design System**: Custom terracotta (`#C85250`) and soft blush cream (`#FAF7F4`) palette, Playfair Display serif headings, Plus Jakarta Sans body typography, and curated micro-interactions.
- **Curated Catalog (105+ Products)**: Deeply categorized across Occasions (Couples, Birthdays, Anniversaries, Families, Festivals, Friends, New Baby, Housewarming, Weddings) and Recipients (For Her, For Him, For Couples, For Parents, For Friends, For Kids, For Colleagues, For Everyone).
- **Per-Product Customization Notes**: Interactive quick-view modal and product detail pages allowing customers to select sizes, frame colors, materials, and input customized text/names/dates per product.
- **Direct WhatsApp Ordering**: Zero payment gateway hurdles, third-party API dependencies, or account creation requirements. Direct order details collection (Full Name + Delivery Address + Landmark) preformatted and sent directly to WhatsApp.
- **100% Pure Static Export**: Compiles into standard static assets (`output: "export"`) deployed directly to Cloudflare Pages (`out/` directory).
- **Single Page Terms & Policies**: All terms of service, privacy guarantees, India-wide shipping guidelines, and 100% free replacement policies consolidated into a clean, unified page (`/policies`) without tab clutter.
- **Comprehensive Technical SEO & AEO**: Full metadata, OpenGraph tags, JSON-LD structured data (`Organization`, `WebSite`, `BreadcrumbList`, `ItemList`, `FAQPage`), static `sitemap.xml`, and optimized `robots.txt`.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5 (App Router, Static Export)
- **Language**: Strict TypeScript 5
- **Styling**: Tailwind CSS v4 & Vanilla CSS Custom Properties
- **Deployment Platform**: Cloudflare Pages (`pages_build_output_dir = "out"`)
- **Validation**: Zod 4
- **Icons**: Lucide React + Custom Optimized Brand Vector Art
- **Testing**: Node.js Native Test Runner with `tsx`

---

## 📁 Project Architecture & Routes

```
src/
├── app/
│   ├── layout.tsx              # Root layout with fonts, metadata, and CartProvider
│   ├── page.tsx                # Homepage matching reference design & JSON-LD
│   ├── shop/page.tsx           # All Gifts catalog with sorting & filtering
│   ├── categories/
│   │   ├── page.tsx            # Category overview grid
│   │   └── [slug]/page.tsx     # Dynamic Category/Occasion/Recipient listing
│   ├── search/page.tsx         # Fast search with keyword chips & category pills
│   ├── cart/page.tsx           # Shopping cart with variants, notes & controls
│   ├── order/page.tsx          # Delivery details form & direct WhatsApp order launch
│   ├── policies/page.tsx       # Unified Terms, Privacy, Shipping & Refunds page
│   ├── about/page.tsx          # About Us & brand story
│   ├── contact/page.tsx        # Contact details & message form
│   ├── faq/page.tsx            # Categorized accordions + FAQPage Schema
│   ├── terms/page.tsx          # Canonical re-export of Policies page
│   ├── privacy/page.tsx        # Canonical re-export of Policies page
│   ├── refunds/page.tsx        # Canonical re-export of Policies page
│   ├── shipping/page.tsx       # Canonical re-export of Policies page
│   ├── sitemap.ts              # Static XML Sitemap generator
│   └── robots.ts               # Robots.txt crawling directives
├── components/
│   ├── catalog/                # ProductCard, CategoryView, FilterSidebar, QuickViewModal
│   ├── home/                   # HeroSection, ShopByOccasion, ShopByRecipient, Collections, WhyChooseUs
│   ├── layout/                 # TopStrip, Header, MobileSidebar, MobileBottomNav, Footer, SiteLayout
│   ├── informational/          # InfoPageLayout (clean card container)
│   ├── search/                 # SearchClient with live query filtering
│   └── ui/                     # Logo, ProductImage (vector renderer)
├── context/
│   └── CartContext.tsx         # Cart persistence, delivery thresholds, and quick-view state
├── data/
│   ├── categories.ts           # Taxonomy: Categories, Occasions, Recipients
│   └── products.ts             # 105+ typed products with variants and ratings
└── types/                      # TypeScript schemas: catalog, cart, order
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js `20.x` or `22.x` / `24.x`
- npm `10.x` or `11.x`

### 2. Installation
```bash
git clone <repository-url>
cd md-gifts
npm install
```

### 3. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing, Linting & Type Checking

Run all test suites and quality gates with:

```bash
# 1. Strict TypeScript type check
npm run typecheck

# 2. ESLint code quality audit
npm run lint

# 3. Unit test suite
npm run test

# 4. Production Static Next.js build (Outputs to out/)
npm run build
```

---

## ☁️ Cloudflare Pages Deployment

This repository produces static HTML/JS/CSS assets in the `out/` folder:

### Build Configuration in Cloudflare Pages
- **Framework preset**: Next.js (Static HTML Export)
- **Build command**: `npm run build` *(or `npx next build`)*
- **Build output directory**: `out`

`wrangler.jsonc` specifies:
```jsonc
{
  "name": "md-gifts",
  "compatibility_date": "2025-02-01",
  "pages_build_output_dir": "out"
}
```

Cloudflare Pages detects `pages_build_output_dir: "out"` and automatically deploys the static files directly.

---

## 📄 License & Attribution

Copyright © 2026 Giftly. All rights reserved.
Crafted with love for thoughtful gifting.
