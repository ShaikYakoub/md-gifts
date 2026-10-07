import { Product, Banner, CategoryInfo } from "@/types/catalog";
import { ProductInput, BannerInput, CategoryInput } from "@/lib/admin/validation";

export interface ManifestData {
  products: {
    added: Product[];
    deleted: string[];
    overrides: Record<string, Partial<Product>>;
  };
  banners: {
    added: Banner[];
    deleted: string[];
    overrides: Record<string, Partial<Banner>>;
  };
  categories: {
    added: CategoryInfo[];
    deleted: string[];
    overrides: Record<string, Partial<CategoryInfo>>;
  };
  version: number;
  lastUpdated: string;
}

export const MANIFEST_STORAGE_KEY = "mdgifts_live_manifest_v1";
export const MANIFEST_EVENT_NAME = "mdgifts_manifest_updated";

export function getDefaultManifest(): ManifestData {
  return {
    products: { added: [], deleted: [], overrides: {} },
    banners: { added: [], deleted: [], overrides: {} },
    categories: { added: [], deleted: [], overrides: {} },
    version: 1,
    lastUpdated: new Date().toISOString(),
  };
}

export function loadManifest(): ManifestData {
  if (typeof window === "undefined") {
    return getDefaultManifest();
  }
  try {
    const raw = localStorage.getItem(MANIFEST_STORAGE_KEY);
    if (!raw) return getDefaultManifest();
    const parsed = JSON.parse(raw) as ManifestData;
    if (parsed && parsed.products && parsed.banners && parsed.categories) {
      return parsed;
    }
    return getDefaultManifest();
  } catch {
    return getDefaultManifest();
  }
}

export function saveManifest(manifest: ManifestData): void {
  if (typeof window === "undefined") return;
  try {
    manifest.lastUpdated = new Date().toISOString();
    localStorage.setItem(MANIFEST_STORAGE_KEY, JSON.stringify(manifest));
    window.dispatchEvent(
      new CustomEvent(MANIFEST_EVENT_NAME, { detail: manifest })
    );
  } catch (err) {
    console.error("Failed to save live manifest:", err);
  }
}

export function resetManifest(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(MANIFEST_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent(MANIFEST_EVENT_NAME, { detail: getDefaultManifest() })
    );
  } catch (err) {
    console.error("Failed to reset manifest:", err);
  }
}

/**
 * Merge Base Products with Live Manifest
 */
export function mergeProducts(
  base: Product[],
  manifestProducts: ManifestData["products"]
): Product[] {
  const deletedSet = new Set(manifestProducts.deleted || []);
  const map = new Map<string, Product>();

  // 1. Add base products
  for (const p of base) {
    if (!deletedSet.has(p.id)) {
      map.set(p.id, {
        ...p,
        ...(manifestProducts.overrides[p.id] || {}),
      });
    }
  }

  // 2. Add or override with dynamically added products
  for (const p of manifestProducts.added || []) {
    if (!deletedSet.has(p.id)) {
      map.set(p.id, {
        ...p,
        ...(manifestProducts.overrides[p.id] || {}),
      });
    }
  }

  return Array.from(map.values())
    .filter((p) => p.enabled !== false)
    .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999));
}

/**
 * Merge Base Banners with Live Manifest
 */
export function mergeBanners(
  base: Banner[],
  manifestBanners: ManifestData["banners"]
): Banner[] {
  const deletedSet = new Set(manifestBanners.deleted || []);
  const map = new Map<string, Banner>();

  for (const b of base) {
    if (!deletedSet.has(b.id)) {
      map.set(b.id, {
        ...b,
        ...(manifestBanners.overrides[b.id] || {}),
      });
    }
  }

  for (const b of manifestBanners.added || []) {
    if (!deletedSet.has(b.id)) {
      map.set(b.id, {
        ...b,
        ...(manifestBanners.overrides[b.id] || {}),
      });
    }
  }

  return Array.from(map.values())
    .filter((b) => b.enabled !== false)
    .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999));
}

/**
 * Merge Base Categories with Live Manifest
 */
export function mergeCategories(
  base: CategoryInfo[],
  manifestCategories: ManifestData["categories"]
): CategoryInfo[] {
  const deletedSet = new Set(manifestCategories.deleted || []);
  const map = new Map<string, CategoryInfo>();

  for (const c of base) {
    if (!deletedSet.has(c.slug)) {
      map.set(c.slug, {
        ...c,
        ...(manifestCategories.overrides[c.slug] || {}),
      });
    }
  }

  for (const c of manifestCategories.added || []) {
    if (!deletedSet.has(c.slug)) {
      map.set(c.slug, {
        ...c,
        ...(manifestCategories.overrides[c.slug] || {}),
      });
    }
  }

  return Array.from(map.values());
}

// Convert ProductInput into a full Product
export function inputToProduct(input: ProductInput): Product {
  const basePrice = input.price;
  const compareAtPrice =
    input.compareAtPrice ?? Math.round(basePrice * 1.25);

  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    shortDescription: input.shortDescription || "",
    description: input.description || "",
    price: basePrice,
    compareAtPrice,
    rating: input.rating ?? 4.8,
    reviewsCount: input.reviewsCount ?? 12,
    images: input.images,
    categorySlug: input.categorySlug,
    occasionSlugs: input.occasionSlugs || [],
    recipientSlugs: input.recipientSlugs || [],
    tags: input.tags || [],
    sizes: input.sizes || ['8" × 10"', '12" × 18"', '18" × 24"'],
    frameColors: input.frameColors || [],
    materials: input.materials || ["Wood", "Acrylic"],
    hasCustomizationText: input.hasCustomizationText ?? true,
    customizationPlaceholder: input.customizationPlaceholder,
    variants: input.variants || [],
    isTrending: input.isTrending ?? false,
    isFeatured: input.isFeatured ?? false,
    isPersonalizedFavourite: input.isPersonalizedFavourite ?? false,
    isUnder499: input.isUnder499 ?? (basePrice < 499),
    isNewArrival: input.isNewArrival ?? false,
    isBestSeller: input.isBestSeller ?? false,
    enabled: input.enabled ?? true,
    displayOrder: input.displayOrder ?? 999,
  };
}

// Manifest mutation helpers for instant optimistic updates
export function manifestSaveProduct(
  input: ProductInput,
  isNew: boolean
): ManifestData {
  const manifest = loadManifest();
  const product = inputToProduct(input);

  if (isNew) {
    // Add to added array
    manifest.products.added = [
      product,
      ...(manifest.products.added || []).filter((p) => p.id !== product.id),
    ];
    // Remove from deleted in case it was previously deleted
    manifest.products.deleted = (manifest.products.deleted || []).filter(
      (id) => id !== product.id
    );
  } else {
    // Check if it was newly added or part of base
    const isAlreadyAdded = manifest.products.added.some((p) => p.id === product.id);
    if (isAlreadyAdded) {
      manifest.products.added = manifest.products.added.map((p) =>
        p.id === product.id ? product : p
      );
    } else {
      manifest.products.overrides[product.id] = product;
    }
  }

  saveManifest(manifest);
  return manifest;
}

export function manifestDeleteProduct(
  id: string,
  permanent = false
): ManifestData {
  const manifest = loadManifest();

  // If newly added in manifest, completely remove from added
  manifest.products.added = (manifest.products.added || []).filter(
    (p) => p.id !== id
  );

  if (permanent) {
    if (!manifest.products.deleted.includes(id)) {
      manifest.products.deleted.push(id);
    }
    delete manifest.products.overrides[id];
  } else {
    // Soft disable
    manifest.products.overrides[id] = {
      ...(manifest.products.overrides[id] || {}),
      enabled: false,
    };
  }

  saveManifest(manifest);
  return manifest;
}

export function manifestSaveBanner(
  input: BannerInput,
  isNew: boolean
): ManifestData {
  const manifest = loadManifest();
  const banner: Banner = {
    id: input.id,
    title: input.title,
    description: input.description || "",
    image: input.image,
    link: input.link,
    enabled: input.enabled ?? true,
    displayOrder: input.displayOrder ?? 1,
  };

  if (isNew) {
    manifest.banners.added = [
      banner,
      ...(manifest.banners.added || []).filter((b) => b.id !== banner.id),
    ];
    manifest.banners.deleted = (manifest.banners.deleted || []).filter(
      (id) => id !== banner.id
    );
  } else {
    const isAlreadyAdded = manifest.banners.added.some((b) => b.id === banner.id);
    if (isAlreadyAdded) {
      manifest.banners.added = manifest.banners.added.map((b) =>
        b.id === banner.id ? banner : b
      );
    } else {
      manifest.banners.overrides[banner.id] = banner;
    }
  }

  saveManifest(manifest);
  return manifest;
}

export function manifestDeleteBanner(id: string): ManifestData {
  const manifest = loadManifest();
  manifest.banners.added = (manifest.banners.added || []).filter(
    (b) => b.id !== id
  );
  if (!manifest.banners.deleted.includes(id)) {
    manifest.banners.deleted.push(id);
  }
  delete manifest.banners.overrides[id];

  saveManifest(manifest);
  return manifest;
}

export function manifestSaveCategory(
  input: CategoryInput,
  isNew: boolean
): ManifestData {
  const manifest = loadManifest();
  const category: CategoryInfo = {
    slug: input.slug,
    name: input.name,
    title: input.title,
    description: input.description || "",
    productCount: input.productCount ?? 0,
    image: input.image,
    type: input.type || "category",
  };

  if (isNew) {
    manifest.categories.added = [
      category,
      ...(manifest.categories.added || []).filter((c) => c.slug !== category.slug),
    ];
    manifest.categories.deleted = (manifest.categories.deleted || []).filter(
      (slug) => slug !== category.slug
    );
  } else {
    const isAlreadyAdded = manifest.categories.added.some(
      (c) => c.slug === category.slug
    );
    if (isAlreadyAdded) {
      manifest.categories.added = manifest.categories.added.map((c) =>
        c.slug === category.slug ? category : c
      );
    } else {
      manifest.categories.overrides[category.slug] = category;
    }
  }

  saveManifest(manifest);
  return manifest;
}

export function manifestDeleteCategory(slug: string): ManifestData {
  const manifest = loadManifest();
  manifest.categories.added = (manifest.categories.added || []).filter(
    (c) => c.slug !== slug
  );
  if (!manifest.categories.deleted.includes(slug)) {
    manifest.categories.deleted.push(slug);
  }
  delete manifest.categories.overrides[slug];

  saveManifest(manifest);
  return manifest;
}
