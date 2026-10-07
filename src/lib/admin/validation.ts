import { z } from "zod";

// Color Option Schema
export const colorOptionSchema = z.object({
  name: z.string().min(1, "Color name is required").max(50),
  hex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color code"),
});

// Product Variant Schema
export const productVariantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  size: z.string().optional(),
  frameColor: z.string().optional(),
  material: z.string().optional(),
  price: z.number().nonnegative("Price must be a non-negative number"),
  compareAtPrice: z.number().nonnegative().optional(),
  inStock: z.boolean().default(true),
});

// Allowed Categories based on existing taxonomy
export const ALLOWED_CATEGORY_SLUGS = [
  "frames",
  "personalized-gifts",
  "mugs",
  "keychains",
  "gift-boxes",
  "home-decor",
] as const;

// Product Schema for validation
export const productInputSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  name: z.string().min(1, "Product name is required").max(200),
  shortDescription: z.string().max(500).default(""),
  description: z.string().max(3000).default(""),
  price: z.number().nonnegative("Price must be >= 0"),
  compareAtPrice: z.number().nonnegative().optional().nullable(),
  offerTag: z.string().max(50).optional(),
  rating: z.number().min(0).max(5).default(4.8),
  reviewsCount: z.number().int().nonnegative().default(10),
  images: z.array(z.string().min(1)).min(1, "At least one product image is required"),
  categorySlug: z.string().min(1, "Category is required"),
  occasionSlugs: z.array(z.string()).default([]),
  recipientSlugs: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  frameColors: z.array(colorOptionSchema).default([]),
  materials: z.array(z.string()).default([]),
  hasCustomizationText: z.boolean().default(true),
  customizationPlaceholder: z.string().max(200).optional(),
  variants: z.array(productVariantSchema).default([]),
  isTrending: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isPersonalizedFavourite: z.boolean().optional(),
  isUnder499: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  enabled: z.boolean().default(true),
  displayOrder: z.number().int().nonnegative().default(999),
});

export type ProductInput = z.infer<typeof productInputSchema>;

// Banner Schema for validation
export const bannerInputSchema = z.object({
  id: z.string().min(1, "Banner ID is required").regex(/^[a-z0-9-]+$/, "Banner ID must only contain lowercase letters, numbers, and hyphens"),
  image: z.string().min(1, "Banner image is required"),
  title: z.string().min(1, "Banner title is required").max(100),
  description: z.string().max(300).default(""),
  link: z.string().min(1, "Destination link is required"),
  enabled: z.boolean().default(true),
  displayOrder: z.number().int().nonnegative().default(1),
});

export type BannerInput = z.infer<typeof bannerInputSchema>;

// Category Schema for validation
export const categoryInputSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  name: z.string().min(1, "Category name is required").max(100),
  title: z.string().min(1, "Category title is required").max(200),
  description: z.string().max(1000).default(""),
  productCount: z.number().int().nonnegative().default(0),
  image: z.string().min(1, "Category image is required"),
  type: z.enum(["category", "occasion", "recipient"]).default("category"),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;

// Strict File Path Validator for Security
export function validateUploadPath(targetPath: string): { isValid: boolean; error?: string } {
  // Disallow null bytes, directory traversal
  if (targetPath.includes("\0") || targetPath.includes("..")) {
    return { isValid: false, error: "Path traversal or invalid characters detected" };
  }

  // Enforce allowed upload directories
  const allowedPrefixes = [
    "public/uploads/products/",
    "public/uploads/banners/",
    "public/uploads/categories/",
  ];
  const matchesPrefix = allowedPrefixes.some((prefix) => targetPath.startsWith(prefix));

  if (!matchesPrefix) {
    return { isValid: false, error: `Uploads only allowed in: ${allowedPrefixes.join(", ")}` };
  }

  // Enforce allowed file extensions
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg"];
  const hasValidExt = allowedExtensions.some((ext) => targetPath.toLowerCase().endsWith(ext));

  if (!hasValidExt) {
    return { isValid: false, error: `Allowed extensions: ${allowedExtensions.join(", ")}` };
  }

  return { isValid: true };
}

// Sanitize filename helper
export function sanitizeFileName(originalName: string): string {
  const parts = originalName.split(".");
  const ext = parts.length > 1 ? `.${parts.pop()!.toLowerCase()}` : ".png";
  const name = parts.join(".").toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-").slice(0, 50);
  const timestamp = Date.now().toString(36);
  return `${name || "image"}-${timestamp}${ext}`;
}
