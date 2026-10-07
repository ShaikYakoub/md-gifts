"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { Product, Banner, CategoryInfo } from "@/types/catalog";
import { ProductInput, BannerInput, CategoryInput } from "@/lib/admin/validation";
import rawProducts from "../../content/products.json";
import rawBanners from "../../content/banners.json";
import rawCategories from "../../content/categories.json";
import {
  ManifestData,
  loadManifest,
  resetManifest,
  mergeProducts,
  mergeBanners,
  mergeCategories,
  manifestSaveProduct,
  manifestDeleteProduct,
  manifestSaveBanner,
  manifestDeleteBanner,
  manifestSaveCategory,
  manifestDeleteCategory,
  MANIFEST_EVENT_NAME,
} from "@/lib/manifest";

interface CatalogContextType {
  products: Product[];
  banners: Banner[];
  categories: CategoryInfo[];
  occasions: CategoryInfo[];
  recipients: CategoryInfo[];
  allTaxonomy: CategoryInfo[];
  manifest: ManifestData | null;
  // Query Helpers
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (categorySlug: string) => Product[];
  getProductsByOccasion: (occasionSlug: string) => Product[];
  getProductsByRecipient: (recipientSlug: string) => Product[];
  getTrendingProducts: () => Product[];
  getPersonalizedFavourites: () => Product[];
  getUnder499Products: () => Product[];
  getTaxonomyBySlug: (slug: string) => CategoryInfo | undefined;
  // Mutation Helpers (Instant UI & Storefront Reactivity)
  saveProduct: (input: ProductInput, isNew: boolean) => void;
  deleteProduct: (id: string, permanent?: boolean) => void;
  toggleProductPublished: (product: ProductInput) => void;
  saveBanner: (input: BannerInput, isNew: boolean) => void;
  deleteBanner: (id: string) => void;
  saveCategory: (input: CategoryInput, isNew: boolean) => void;
  deleteCategory: (slug: string) => void;
  resetToDefaults: () => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

const BASE_PRODUCTS = rawProducts as Product[];
const BASE_BANNERS = rawBanners as Banner[];
const BASE_CATEGORIES = rawCategories as CategoryInfo[];

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [manifest, setManifest] = useState<ManifestData | null>(null);

  // Sync state from manifest
  const syncFromManifest = useCallback(() => {
    const current = loadManifest();
    setManifest({ ...current });
  }, []);

  // Initial load and listeners for Cross-Tab & Same-Tab Instant Sync
  useEffect(() => {
    syncFromManifest();

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ManifestData>;
      if (customEvent.detail) {
        setManifest({ ...customEvent.detail });
      } else {
        syncFromManifest();
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "mdgifts_live_manifest_v1") {
        syncFromManifest();
      }
    };

    window.addEventListener(MANIFEST_EVENT_NAME, handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(MANIFEST_EVENT_NAME, handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [syncFromManifest]);

  // Merged live products
  const products = useMemo(() => {
    if (!manifest) {
      return BASE_PRODUCTS.filter((p) => p.enabled !== false).sort(
        (a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999)
      );
    }
    return mergeProducts(BASE_PRODUCTS, manifest.products);
  }, [manifest]);

  // Merged live banners
  const banners = useMemo(() => {
    if (!manifest) {
      return BASE_BANNERS.filter((b) => b.enabled !== false).sort(
        (a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999)
      );
    }
    return mergeBanners(BASE_BANNERS, manifest.banners);
  }, [manifest]);

  // Merged live taxonomy (categories, occasions, recipients)
  const allTaxonomy = useMemo(() => {
    if (!manifest) {
      return BASE_CATEGORIES;
    }
    return mergeCategories(BASE_CATEGORIES, manifest.categories);
  }, [manifest]);

  const categories = useMemo(
    () => allTaxonomy.filter((item) => (item.type || "category") === "category"),
    [allTaxonomy]
  );

  const occasions = useMemo(
    () => allTaxonomy.filter((item) => item.type === "occasion"),
    [allTaxonomy]
  );

  const recipients = useMemo(
    () => allTaxonomy.filter((item) => item.type === "recipient"),
    [allTaxonomy]
  );

  // Queries
  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const getProductsByCategory = useCallback(
    (categorySlug: string) => products.filter((p) => p.categorySlug === categorySlug),
    [products]
  );

  const getProductsByOccasion = useCallback(
    (occasionSlug: string) => {
      if (occasionSlug === "all-occasions") return products;
      return products.filter((p) => p.occasionSlugs.includes(occasionSlug));
    },
    [products]
  );

  const getProductsByRecipient = useCallback(
    (recipientSlug: string) => {
      if (recipientSlug === "for-everyone") return products;
      return products.filter((p) => p.recipientSlugs.includes(recipientSlug));
    },
    [products]
  );

  const getTrendingProducts = useCallback(
    () => products.filter((p) => p.isTrending).slice(0, 8),
    [products]
  );

  const getPersonalizedFavourites = useCallback(
    () => products.filter((p) => p.isPersonalizedFavourite).slice(0, 6),
    [products]
  );

  const getUnder499Products = useCallback(
    () => products.filter((p) => p.isUnder499).slice(0, 6),
    [products]
  );

  const getTaxonomyBySlug = useCallback(
    (slug: string) => allTaxonomy.find((item) => item.slug === slug),
    [allTaxonomy]
  );

  // Mutations
  const saveProduct = useCallback((input: ProductInput, isNew: boolean) => {
    const updated = manifestSaveProduct(input, isNew);
    setManifest({ ...updated });
  }, []);

  const deleteProduct = useCallback((id: string, permanent = false) => {
    const updated = manifestDeleteProduct(id, permanent);
    setManifest({ ...updated });
  }, []);

  const toggleProductPublished = useCallback((product: ProductInput) => {
    const updatedInput: ProductInput = {
      ...product,
      enabled: !product.enabled,
    };
    const updated = manifestSaveProduct(updatedInput, false);
    setManifest({ ...updated });
  }, []);

  const saveBanner = useCallback((input: BannerInput, isNew: boolean) => {
    const updated = manifestSaveBanner(input, isNew);
    setManifest({ ...updated });
  }, []);

  const deleteBanner = useCallback((id: string) => {
    const updated = manifestDeleteBanner(id);
    setManifest({ ...updated });
  }, []);

  const saveCategory = useCallback((input: CategoryInput, isNew: boolean) => {
    const updated = manifestSaveCategory(input, isNew);
    setManifest({ ...updated });
  }, []);

  const deleteCategory = useCallback((slug: string) => {
    const updated = manifestDeleteCategory(slug);
    setManifest({ ...updated });
  }, []);

  const resetToDefaults = useCallback(() => {
    resetManifest();
    setManifest(null);
  }, []);

  const value = useMemo(
    () => ({
      products,
      banners,
      categories,
      occasions,
      recipients,
      allTaxonomy,
      manifest,
      getProductById,
      getProductBySlug,
      getProductsByCategory,
      getProductsByOccasion,
      getProductsByRecipient,
      getTrendingProducts,
      getPersonalizedFavourites,
      getUnder499Products,
      getTaxonomyBySlug,
      saveProduct,
      deleteProduct,
      toggleProductPublished,
      saveBanner,
      deleteBanner,
      saveCategory,
      deleteCategory,
      resetToDefaults,
    }),
    [
      products,
      banners,
      categories,
      occasions,
      recipients,
      allTaxonomy,
      manifest,
      getProductById,
      getProductBySlug,
      getProductsByCategory,
      getProductsByOccasion,
      getProductsByRecipient,
      getTrendingProducts,
      getPersonalizedFavourites,
      getUnder499Products,
      getTaxonomyBySlug,
      saveProduct,
      deleteProduct,
      toggleProductPublished,
      saveBanner,
      deleteBanner,
      saveCategory,
      deleteCategory,
      resetToDefaults,
    ]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useLiveCatalog(): CatalogContextType {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useLiveCatalog must be used within a CatalogProvider");
  }
  return context;
}
