# Giftly — Personalized Gifts Ecommerce Website

A modern mobile-first personalized gift shop ecommerce platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Cloudflare Workers** edge compatibility.

Designed to match the provided screenshot design specifications with exact typography, color palettes, visual density, responsive drawers, bottom navigation, and quick-view customization flows.

---

## 🚀 Key Features

- **Screenshot-Fidelity Design System**: Custom terracotta (`#C85250`) and soft blush cream (`#FAF7F4`) palette, Playfair Display serif headings, Plus Jakarta Sans body typography, and curated micro-interactions.
- **Curated Catalog (105+ Products)**: Deeply categorized across Occasions (Couples, Birthdays, Anniversaries, Families, Festivals, Friends, New Baby, Housewarming, Weddings) and Recipients (For Her, For Him, For Couples, For Parents, For Friends, For Kids, For Colleagues, For Everyone).
- **Interactive Product Customization**: Quick-view modal (desktop) and bottom sheet (mobile) supporting interactive variant configurations (Size, Frame Color swatches, Materials, Custom text inputs, and Quantity controls).
- **Frictionless Direct Order Placement**: Zero payment gateway hurdles or account creation requirements. Direct order details collection with phone, address, and customization notes, protected by server-side Zod validation and pricing derivation.
- **Edge & Cloudflare Workers Ready**: Fully verified and built using `@opennextjs/cloudflare` and `wrangler.jsonc` with `nodejs_compat`.
- **Comprehensive Technical SEO & AEO**: Full metadata, OpenGraph tags, JSON-LD structured data (`Organization`, `WebSite`, `BreadcrumbList`, `ItemList`, `FAQPage`), static `sitemap.xml`, and optimized `robots.txt`.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5 (App Router)
- **Language**: Strict TypeScript 5
- **Styling**: Tailwind CSS v4 & Vanilla CSS Custom Properties
- **Deployment Platform**: Cloudflare Workers (`@opennextjs/cloudflare` 1.20)
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
│   ├── cart/page.tsx           # Shopping cart with variants & clear controls
│   ├── order/page.tsx          # Order details form (No payment gateway)
│   ├── order/success/page.tsx  # Order confirmation with generated Order ID
│   ├── about/page.tsx          # About Us & brand story
│   ├── contact/page.tsx        # Contact details & message form
│   ├── faq/page.tsx            # Categorized accordions + FAQPage Schema
│   ├── terms/page.tsx          # Terms & Conditions
│   ├── privacy/page.tsx        # Privacy & image protection policy
│   ├── refunds/page.tsx        # Cancellation & transit replacement policy
│   ├── shipping/page.tsx       # India-wide shipping timelines & rates
│   ├── sitemap.ts              # Dynamic XML Sitemap generator
│   ├── robots.ts               # Robots.txt crawling directives
│   └── api/order/route.ts      # Server-side order verification & anti-tamper pricing
├── components/
│   ├── catalog/                # ProductCard, CategoryView, FilterSidebar, QuickViewModal
│   ├── home/                   # HeroSection, ShopByOccasion, ShopByRecipient, Collections, WhyChooseUs
│   ├── layout/                 # TopStrip, Header, MobileSidebar, MobileBottomNav, Footer, SiteLayout
│   ├── informational/          # InfoPageLayout (desktop tabs + responsive layout)
│   ├── search/                 # SearchClient with live query filtering
│   ├── order/                  # OrderSuccessClient
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
- Node.js `20.x` or `24.x`
- npm `10.x` or `11.x`

### 2. Installation
```bash
git clone <repository-url>
cd md-gifts
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Running the Development Server
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

# 3. Unit test suite (Catalog integrity, Order schema, Pricing logic)
npm run test

# 4. Production Next.js build
npm run build
```

---

## ☁️ Cloudflare Workers Deployment

This repository uses `@opennextjs/cloudflare` to compile Next.js App Router for Cloudflare Workers.

### Configuration Files
- `wrangler.jsonc`: Defines worker entry point, assets directory, compatibility date, and `nodejs_compat`.
- `open-next.config.ts`: Configures OpenNext Cloudflare adapter.
- `cloudflare-env.d.ts`: Generated types for Cloudflare bindings.

### Build and Preview for Cloudflare Workers

```bash
# Generate Cloudflare environment types
npm run cf-typegen

# Build Cloudflare Workers bundle
npm run build:worker

# Preview locally with Wrangler dev server
npm run preview

# Deploy directly to Cloudflare Workers
npm run deploy
```

---

## 📋 SEO & Answer Engine Optimization (AEO)

1. **Structured Data (JSON-LD)**:
   - `Organization` & `WebSite` on Homepage
   - `BreadcrumbList` & `ItemList` on Category Pages
   - `FAQPage` schema on `/faq`
2. **Canonical URLs & Directives**:
   - Automatic canonical URLs on all public catalog pages.
   - Non-indexable utility pages (`/cart`, `/order`, `/order/*`, `/search`, `/api/*`) are excluded in `sitemap.ts` and disallowed in `robots.ts`.
3. **Core Web Vitals**:
   - Zero layout shift (CLS) with fixed aspect ratios.
   - First Load JS < 125 kB across all routes.
   - Instant visual loading with vectorized and optimized responsive assets.

---

## 📄 License & Attribution

Copyright © 2026 Giftly. All rights reserved.
Crafted with love for thoughtful gifting.
