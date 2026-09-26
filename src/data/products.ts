import { Product, ColorOption } from "@/types/catalog";
import rawProducts from "../../content/products.json";

export const FRAME_COLORS: ColorOption[] = [
  { name: "Black", hex: "#1F1F1F" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Walnut Brown", hex: "#7B4B28" },
  { name: "Warm Champagne", hex: "#D9C3B0" },
  { name: "Blush Rose", hex: "#E89B99" },
  { name: "Crimson Red", hex: "#C85250" },
];

export const STANDARD_SIZES = [
  '8" × 10"',
  '12" × 18"',
  '18" × 24"',
];

export const STANDARD_MATERIALS = [
  "Wood",
  "Acrylic",
  "Metal",
  "Plastic",
];

// Helper to construct variants
export function createVariants(basePrice: number, sizes = STANDARD_SIZES) {
  const variants = [];
  for (const size of sizes) {
    const sizeMultiplier = size.includes("18") ? 1.5 : size.includes("12") ? 1.25 : 1;
    const price = Math.round(basePrice * sizeMultiplier);
    const compareAtPrice = Math.round(price * 1.25);
    variants.push({
      id: `${size.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      name: size,
      size,
      price,
      compareAtPrice,
      inStock: true,
    });
  }
  return variants;
}

// Canonical source of all products (including unpublished for admin)
export const ALL_PRODUCTS: Product[] = rawProducts as Product[];

// Public storefront products (only enabled products, sorted by displayOrder)
export const PRODUCTS: Product[] = (rawProducts as Product[])
  .filter((p) => p.enabled !== false)
  .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999));

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsByOccasion(occasionSlug: string): Product[] {
  if (occasionSlug === "all-occasions") return PRODUCTS;
  return PRODUCTS.filter((p) => p.occasionSlugs.includes(occasionSlug));
}

export function getProductsByRecipient(recipientSlug: string): Product[] {
  if (recipientSlug === "for-everyone") return PRODUCTS;
  return PRODUCTS.filter((p) => p.recipientSlugs.includes(recipientSlug));
}

export function getTrendingProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isTrending).slice(0, 8);
}

export function getPersonalizedFavourites(): Product[] {
  return PRODUCTS.filter((p) => p.isPersonalizedFavourite).slice(0, 6);
}

export function getUnder499Products(): Product[] {
  return PRODUCTS.filter((p) => p.isUnder499).slice(0, 6);
}
