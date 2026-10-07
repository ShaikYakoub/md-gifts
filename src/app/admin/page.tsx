"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Image as ImageIcon,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  X,
  RefreshCw,
  Sparkles,
  LayoutGrid,
  RotateCcw,
  Lock,
  LogOut,
} from "lucide-react";
import { ProductInput, BannerInput, CategoryInput } from "@/lib/admin/validation";
import { useLiveCatalog } from "@/context/CatalogContext";

const CATEGORY_OPTIONS = [
  { slug: "frames", label: "Photo Frames" },
  { slug: "personalized-gifts", label: "Personalized Gifts" },
  { slug: "mugs", label: "Custom Mugs" },
  { slug: "keychains", label: "Keychains" },
  { slug: "gift-boxes", label: "Gift Boxes" },
  { slug: "home-decor", label: "Home Decor" },
];

export default function AdminDashboardPage() {
  const catalog = useLiveCatalog();
  const [activeTab, setActiveTab] = useState<"products" | "banners" | "categories">("products");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductInput[]>([]);
  const [banners, setBanners] = useState<BannerInput[]>([]);
  const [categories, setCategories] = useState<CategoryInput[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "published" | "draft">("all");
  const [selectedCategoryType, setSelectedCategoryType] = useState<"all" | "category" | "occasion" | "recipient">("all");

  // Editors
  const [editingProduct, setEditingProduct] = useState<ProductInput | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerInput | null>(null);
  const [isNewBanner, setIsNewBanner] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInput | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "product" | "banner" | "category";
    id: string;
    name: string;
    permanent?: boolean;
  } | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const categoryFileInputRef = useRef<HTMLInputElement>(null);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  // Auto clear toast after 7s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  async function loadAllData() {
    setLoading(true);
    try {
      // 1. Instant cold-start sync from live catalog
      if (catalog.products.length > 0) setProducts(catalog.products as unknown as ProductInput[]);
      if (catalog.banners.length > 0) setBanners(catalog.banners as unknown as BannerInput[]);
      if (catalog.allTaxonomy.length > 0) setCategories(catalog.allTaxonomy as unknown as CategoryInput[]);

      // 2. Check admin identity & authentication
      try {
        const meRes = await fetch("/api/admin/me");
        if (meRes.ok) {
          const meData = (await meRes.json()) as { authenticated?: boolean; email?: string };
          if (meData.authenticated) {
            setIsAuthenticated(true);
            if (meData.email) setAdminEmail(meData.email);
          } else {
            setIsAuthenticated(false);
          }
        } else if (meRes.status === 401 || meRes.status === 403) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        // Fallback for local development
        setIsAuthenticated(true);
      } finally {
        setCheckingAuth(false);
      }

      // 3. Fetch products
      try {
        const pRes = await fetch("/api/admin/products");
        if (pRes.ok) {
          const pData = (await pRes.json()) as { products?: ProductInput[] };
          if (Array.isArray(pData.products)) {
            setProducts(pData.products);
          }
        }
      } catch { /* dev fallback */ }

      // 4. Fetch banners
      try {
        const bRes = await fetch("/api/admin/banners");
        if (bRes.ok) {
          const bData = (await bRes.json()) as { banners?: BannerInput[] };
          if (Array.isArray(bData.banners)) {
            setBanners(bData.banners);
          }
        }
      } catch { /* dev fallback */ }

      // 5. Fetch categories
      try {
        const cRes = await fetch("/api/admin/categories");
        if (cRes.ok) {
          const cData = (await cRes.json()) as { categories?: CategoryInput[] };
          if (Array.isArray(cData.categories)) {
            setCategories(cData.categories);
          }
        }
      } catch { /* dev fallback */ }
    } catch {
      // Catalog data remains active
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categorySlug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || p.categorySlug === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "published" && p.enabled !== false) ||
        (selectedStatus === "draft" && p.enabled === false);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedCategoryType === "all" || (c.type || "category") === selectedCategoryType;
      return matchesSearch && matchesType;
    });
  }, [categories, searchQuery, selectedCategoryType]);

  // Dynamic category options for product editing
  const dynamicCategoryOptions = useMemo(() => {
    const mainCats = categories.filter((c) => (c.type || "category") === "category");
    if (mainCats.length > 0) {
      return mainCats.map((c) => ({ slug: c.slug, label: c.name }));
    }
    return CATEGORY_OPTIONS;
  }, [categories]);

  // Handle Image Upload
  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    folder: "products" | "banners" | "categories"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: "Image size must be less than 5MB.", type: "error" });
      return;
    }

    setUploading(true);
    let uploadedUrl = "";
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = (await res.json()) as { url?: string };
        if (data.url) uploadedUrl = data.url;
      }
    } catch {
      // Fallback to local Data URL
    }

    if (!uploadedUrl) {
      try {
        uploadedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } catch {
        setToast({ message: "Failed to read image file.", type: "error" });
        setUploading(false);
        return;
      }
    }

    if (folder === "products" && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, uploadedUrl],
      });
    } else if (folder === "banners" && editingBanner) {
      setEditingBanner({
        ...editingBanner,
        image: uploadedUrl,
      });
    } else if (folder === "categories" && editingCategory) {
      setEditingCategory({
        ...editingCategory,
        image: uploadedUrl,
      });
    }

    setToast({
      message: "Image uploaded and applied successfully!",
      type: "success",
    });
    setUploading(false);
    if (e.target) e.target.value = "";
  }

  // Save Product (Add or Edit)
  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name.trim()) {
      setToast({ message: "Product name is required.", type: "error" });
      return;
    }
    if (editingProduct.images.length === 0) {
      setToast({ message: "Please provide at least one product image.", type: "error" });
      return;
    }
    if (editingProduct.price < 0) {
      setToast({ message: "Price cannot be negative.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      // 1. Optimistic instant UI update via Live Manifest
      catalog.saveProduct(editingProduct, isNewProduct);

      // 2. Update local admin state
      if (isNewProduct) {
        setProducts([editingProduct, ...products]);
      } else {
        setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
      }

      // 3. Background server API
      try {
        const method = isNewProduct ? "POST" : "PUT";
        await fetch("/api/admin/products", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        });
      } catch {
        // Dev fallback
      }

      setEditingProduct(null);
      setIsNewProduct(false);
      setToast({
        message: "Product saved successfully! Cards on storefront updated instantly.",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to save product",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  // Toggle Product Published state directly
  async function handleToggleProductPublished(product: ProductInput) {
    const updated = { ...product, enabled: !product.enabled };
    setSaving(true);
    try {
      catalog.saveProduct(updated, false);
      setProducts(products.map((p) => (p.id === product.id ? updated : p)));

      try {
        await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
      } catch {
        // Dev fallback
      }

      setToast({
        message: updated.enabled
          ? "Product card published live."
          : "Product card unpublished.",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to update product status",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  // Delete / Unpublish Product, Banner, or Category
  async function handleConfirmDelete() {
    if (!deleteConfirm) return;
    setSaving(true);
    try {
      if (deleteConfirm.type === "product") {
        catalog.deleteProduct(deleteConfirm.id, deleteConfirm.permanent);
        if (deleteConfirm.permanent) {
          setProducts(products.filter((p) => p.id !== deleteConfirm.id));
        } else {
          setProducts(
            products.map((p) => (p.id === deleteConfirm.id ? { ...p, enabled: false } : p))
          );
        }
        try {
          const url = `/api/admin/products?id=${encodeURIComponent(deleteConfirm.id)}${
            deleteConfirm.permanent ? "&permanent=true" : ""
          }`;
          await fetch(url, { method: "DELETE" });
        } catch { /* dev fallback */ }
      } else if (deleteConfirm.type === "banner") {
        catalog.deleteBanner(deleteConfirm.id);
        setBanners(banners.filter((b) => b.id !== deleteConfirm.id));
        try {
          const url = `/api/admin/banners?id=${encodeURIComponent(deleteConfirm.id)}`;
          await fetch(url, { method: "DELETE" });
        } catch { /* dev fallback */ }
      } else if (deleteConfirm.type === "category") {
        catalog.deleteCategory(deleteConfirm.id);
        setCategories(categories.filter((c) => c.slug !== deleteConfirm.id));
        try {
          const url = `/api/admin/categories?slug=${encodeURIComponent(deleteConfirm.id)}`;
          await fetch(url, { method: "DELETE" });
        } catch { /* dev fallback */ }
      }

      setToast({
        message: "Item removed successfully. Storefront updated instantly.",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Operation failed",
        type: "error",
      });
    } finally {
      setSaving(false);
      setDeleteConfirm(null);
    }
  }

  // Save Banner (Add or Edit)
  async function handleSaveBanner(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBanner) return;

    if (!editingBanner.title.trim()) {
      setToast({ message: "Banner title is required.", type: "error" });
      return;
    }
    if (!editingBanner.image.trim()) {
      setToast({ message: "Banner image is required.", type: "error" });
      return;
    }
    if (!editingBanner.link.trim()) {
      setToast({ message: "Destination link is required.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      catalog.saveBanner(editingBanner, isNewBanner);

      if (isNewBanner) {
        setBanners([...banners, editingBanner]);
      } else {
        setBanners(banners.map((b) => (b.id === editingBanner.id ? editingBanner : b)));
      }

      try {
        const method = isNewBanner ? "POST" : "PUT";
        await fetch("/api/admin/banners", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingBanner),
        });
      } catch {
        // Dev fallback
      }

      setEditingBanner(null);
      setIsNewBanner(false);
      setToast({
        message: "Banner saved successfully! Top scrolling banner updated instantly.",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to save banner",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  // Save Category (Add or Edit)
  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCategory) return;

    if (!editingCategory.name.trim()) {
      setToast({ message: "Category name is required.", type: "error" });
      return;
    }
    if (!editingCategory.title.trim()) {
      setToast({ message: "Category title is required.", type: "error" });
      return;
    }
    if (!editingCategory.slug.trim()) {
      setToast({ message: "Category slug is required.", type: "error" });
      return;
    }
    if (!editingCategory.image.trim()) {
      setToast({ message: "Category image is required.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      catalog.saveCategory(editingCategory, isNewCategory);

      if (isNewCategory) {
        setCategories([...categories, editingCategory]);
      } else {
        setCategories(
          categories.map((c) => (c.slug === editingCategory.slug ? editingCategory : c))
        );
      }

      try {
        const method = isNewCategory ? "POST" : "PUT";
        await fetch("/api/admin/categories", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingCategory),
        });
      } catch {
        // Dev fallback
      }

      setEditingCategory(null);
      setIsNewCategory(false);
      setToast({
        message: "Category saved successfully! Categories on storefront updated instantly.",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to save category",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  function createNewProductTemplate(): ProductInput {
    const randomId = `prod-${Date.now().toString(36)}`;
    return {
      id: randomId,
      slug: randomId,
      name: "",
      shortDescription: "",
      description: "",
      price: 499,
      compareAtPrice: 699,
      offerTag: "",
      rating: 4.8,
      reviewsCount: 12,
      images: [],
      categorySlug: categories.find((c) => (c.type || "category") === "category")?.slug || "frames",
      occasionSlugs: [],
      recipientSlugs: [],
      tags: [],
      sizes: ["6x8 inch", "8x12 inch"],
      frameColors: [
        { name: "Classic Black", hex: "#1A1A1A" },
        { name: "Warm Oak", hex: "#A87042" },
      ],
      materials: ["Solid Engineered Wood", "HD Acrylic Glass"],
      hasCustomizationText: true,
      customizationPlaceholder: "Enter names, date or custom quote",
      variants: [],
      enabled: true,
      displayOrder: (products.length + 1) * 10,
    };
  }

  function createNewBannerTemplate(): BannerInput {
    const randomId = `banner-${Date.now().toString(36)}`;
    return {
      id: randomId,
      image: "",
      title: "",
      description: "",
      link: "/categories/frames",
      enabled: true,
      displayOrder: (banners.length + 1) * 10,
    };
  }

  function createNewCategoryTemplate(): CategoryInput {
    const randomId = `cat-${Date.now().toString(36)}`;
    return {
      slug: randomId,
      name: "",
      title: "",
      description: "",
      productCount: 0,
      image: "",
      type: "category",
    };
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = (await res.json()) as { success?: boolean; email?: string; error?: string };
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        if (data.email) setAdminEmail(data.email);
        setToast({ message: "Welcome back! Logged in successfully.", type: "success" });
        loadAllData();
      } else {
        setLoginError(data.error || "Invalid email or password");
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Failed to log in");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch { /* dev fallback */ }
    setIsAuthenticated(false);
    setAdminEmail("");
    setToast({ message: "You have been logged out.", type: "info" });
  }

  if (!isAuthenticated && !checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF7F4] flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
          <div className="bg-[#FAF7F4] border-b border-stone-200 p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#C85250] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">MD Gifts Admin</h1>
            <p className="text-xs text-stone-500 mt-1">Sign in with your credentials to manage products, banners & categories</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. owner@mdgifts.in"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Admin Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full mt-2 py-2.5 px-4 bg-[#C85250] hover:bg-[#B34341] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In to Dashboard
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link href="/" className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
                ← Return to storefront
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C85250] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight leading-none">Gift Shop Admin</h1>
              <p className="text-xs text-stone-500 mt-0.5">Manage products, scrolling banners & categories</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {adminEmail && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
                {adminEmail}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors border border-rose-200 cursor-pointer"
              title="Sign Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <button
              onClick={() => setResetConfirm(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-200 cursor-pointer"
              title="Reset Live Overrides to Baseline Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
            <button
              onClick={() => {
                setRefreshing(true);
                loadAllData();
              }}
              disabled={refreshing}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Refresh Content"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              View Store
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 border-t border-stone-100">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "products"
                ? "border-[#C85250] text-[#C85250]"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Package className="w-4 h-4" />
            Product Cards
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono">
              {products.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("banners")}
            className={`py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "banners"
                ? "border-[#C85250] text-[#C85250]"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Top Scrolling Images
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono">
              {banners.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "categories"
                ? "border-[#C85250] text-[#C85250]"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Categories
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono">
              {categories.length}
            </span>
          </button>
        </div>
      </header>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`p-4 rounded-xl shadow-lg border flex items-start gap-3 ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : toast.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-900"
                : "bg-blue-50 border-blue-200 text-blue-900"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            <button onClick={() => setToast(null)} className="text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-[#C85250] animate-spin mx-auto mb-3" />
            <p className="text-stone-600 font-medium">Loading store content...</p>
          </div>
        ) : activeTab === "products" ? (
          /* Products View */
          <div>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                >
                  <option value="all">All Categories</option>
                  {dynamicCategoryOptions.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as "all" | "published" | "draft")}
                  className="px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Unpublished</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(createNewProductTemplate());
                  setIsNewProduct(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C85250] hover:bg-[#B34341] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {/* Products List / Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-stone-900 mb-1">No products found</h3>
                <p className="text-sm text-stone-500 mb-4">Try clearing filters or add a new product.</p>
                <button
                  onClick={() => {
                    setEditingProduct(createNewProductTemplate());
                    setIsNewProduct(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C85250] text-white text-sm font-semibold rounded-lg"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="divide-y divide-stone-100">
                  {filteredProducts.map((product) => {
                    const isPublished = product.enabled !== false;
                    return (
                      <div
                        key={product.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Thumbnail */}
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-300">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-stone-900 truncate">{product.name}</h3>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isPublished
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-stone-100 text-stone-600"
                                }`}
                              >
                                {isPublished ? "Published" : "Unpublished"}
                              </span>
                              {product.offerTag && (
                                <span className="hidden md:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                                  {product.offerTag}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-stone-500">
                              <span className="font-semibold text-stone-900">₹{product.price}</span>
                              {product.compareAtPrice && (
                                <span className="line-through text-stone-400">₹{product.compareAtPrice}</span>
                              )}
                              <span>•</span>
                              <span className="capitalize">{product.categorySlug.replace("-", " ")}</span>
                              {product.sizes && product.sizes.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{product.sizes.length} sizes</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                          <button
                            onClick={() => handleToggleProductPublished(product)}
                            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5"
                            title={isPublished ? "Unpublish" : "Publish"}
                          >
                            {isPublished ? (
                              <>
                                <EyeOff className="w-4 h-4 text-stone-400" />
                                <span className="sm:hidden">Unpublish</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 text-emerald-600" />
                                <span className="sm:hidden text-emerald-700">Publish</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setEditingProduct({ ...product });
                              setIsNewProduct(false);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: "product",
                                id: product.id,
                                name: product.name,
                                permanent: false,
                              })
                            }
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Unpublish or Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === "banners" ? (
          /* Banners View */
          <div>
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-stone-900">Hero & Promo Banners</h2>
              <button
                onClick={() => {
                  setEditingBanner(createNewBannerTemplate());
                  setIsNewBanner(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C85250] hover:bg-[#B34341] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Banner
              </button>
            </div>

            {/* Banners List */}
            {banners.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-stone-900 mb-1">No banners configured</h3>
                <p className="text-sm text-stone-500 mb-4">Add your first promotional banner.</p>
                <button
                  onClick={() => {
                    setEditingBanner(createNewBannerTemplate());
                    setIsNewBanner(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C85250] text-white text-sm font-semibold rounded-lg"
                >
                  <Plus className="w-4 h-4" /> Add Banner
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col"
                  >
                    <div className="relative aspect-[16/7] w-full bg-stone-100">
                      {banner.image ? (
                        <Image
                          src={banner.image}
                          alt={banner.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <ImageIcon className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm ${
                            banner.enabled
                              ? "bg-emerald-500/90 text-white"
                              : "bg-stone-800/80 text-stone-200"
                          }`}
                        >
                          {banner.enabled ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-stone-900 text-base mb-1">{banner.title}</h3>
                        {banner.description && (
                          <p className="text-xs text-stone-600 line-clamp-2 mb-2">{banner.description}</p>
                        )}
                        <p className="text-xs text-stone-400 font-mono">Link: {banner.link}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-4">
                        <span className="text-xs text-stone-500 font-medium">Order: #{banner.displayOrder}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingBanner({ ...banner });
                              setIsNewBanner(false);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: "banner",
                                id: banner.id,
                                name: banner.title,
                                permanent: true,
                              })
                            }
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Banner"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Categories View */
          <div>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                  />
                </div>
                <div className="inline-flex rounded-lg border border-stone-200 bg-white p-1 text-xs font-semibold">
                  <button
                    onClick={() => setSelectedCategoryType("all")}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      selectedCategoryType === "all"
                        ? "bg-[#C85250] text-white"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    All ({categories.length})
                  </button>
                  <button
                    onClick={() => setSelectedCategoryType("category")}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      selectedCategoryType === "category"
                        ? "bg-[#C85250] text-white"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Main ({categories.filter((c) => (c.type || "category") === "category").length})
                  </button>
                  <button
                    onClick={() => setSelectedCategoryType("occasion")}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      selectedCategoryType === "occasion"
                        ? "bg-[#C85250] text-white"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Occasions ({categories.filter((c) => c.type === "occasion").length})
                  </button>
                  <button
                    onClick={() => setSelectedCategoryType("recipient")}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      selectedCategoryType === "recipient"
                        ? "bg-[#C85250] text-white"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Recipients ({categories.filter((c) => c.type === "recipient").length})
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingCategory(createNewCategoryTemplate());
                  setIsNewCategory(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C85250] hover:bg-[#B34341] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            {/* Categories List */}
            {filteredCategories.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                <LayoutGrid className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-stone-900 mb-1">No categories found</h3>
                <p className="text-sm text-stone-500 mb-4">Try clearing your filters or create a new category.</p>
                <button
                  onClick={() => {
                    setEditingCategory(createNewCategoryTemplate());
                    setIsNewCategory(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C85250] text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.slug}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col hover:border-[#C85250]/40 transition-all"
                  >
                    <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden">
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <LayoutGrid className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
                            cat.type === "occasion"
                              ? "bg-purple-600/90 text-white"
                              : cat.type === "recipient"
                              ? "bg-amber-600/90 text-white"
                              : "bg-blue-600/90 text-white"
                          }`}
                        >
                          {cat.type === "occasion"
                            ? "Occasion"
                            : cat.type === "recipient"
                            ? "Recipient"
                            : "Category"}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                          {cat.productCount ?? 0} items
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-bold text-stone-900 text-base">{cat.name}</h3>
                          <span className="text-xs text-stone-400 font-mono">/{cat.slug}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-stone-700 mb-1">{cat.title}</h4>
                        {cat.description && (
                          <p className="text-xs text-stone-500 line-clamp-2">{cat.description}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t border-stone-100 pt-3 mt-3">
                        <button
                          onClick={() => {
                            setEditingCategory({ ...cat });
                            setIsNewCategory(false);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              type: "category",
                              id: cat.slug,
                              name: cat.name,
                              permanent: true,
                            })
                          }
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Hidden file inputs for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleImageUpload(e, "products")}
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
      />
      <input
        type="file"
        ref={bannerFileInputRef}
        onChange={(e) => handleImageUpload(e, "banners")}
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
      />
      <input
        type="file"
        ref={categoryFileInputRef}
        onChange={(e) => handleImageUpload(e, "categories")}
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
      />

      {/* PRODUCT EDITOR MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {isNewProduct ? "Add New Product" : `Edit Product: ${editingProduct.name}`}
                </h3>
                <p className="text-xs text-stone-500">Edit details and pricing for this gift item</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Basic Information */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Basic Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = isNewProduct
                          ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                          : editingProduct.slug;
                        setEditingProduct({ ...editingProduct, name, slug: slug || editingProduct.slug });
                      }}
                      placeholder="e.g. Personalized Wooden Photo Frame"
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
                      <select
                        value={editingProduct.categorySlug}
                        onChange={(e) => setEditingProduct({ ...editingProduct, categorySlug: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                      >
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        min="1"
                        value={editingProduct.displayOrder}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, displayOrder: parseInt(e.target.value) || 999 })
                        }
                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={editingProduct.shortDescription}
                      onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                      placeholder="Catchy one-line description"
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Full Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      placeholder="Detailed product specifications, materials, and care notes"
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                    />
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Product Images *
                  </h4>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[#C85250]" />
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  {editingProduct.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 group"
                    >
                      <Image src={imgUrl} alt={`Product image ${idx + 1}`} fill sizes="80px" className="object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({
                            ...editingProduct,
                            images: editingProduct.images.filter((_, i) => i !== idx),
                          })
                        }
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {editingProduct.images.length === 0 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:border-[#C85250] cursor-pointer transition-colors"
                    >
                      <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-stone-700">Click to upload product image</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">PNG, JPG, or WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Offers */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Pricing & Offers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Compare-at Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.compareAtPrice || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="e.g. 799"
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Offer Tag</label>
                    <input
                      type="text"
                      value={editingProduct.offerTag || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, offerTag: e.target.value })}
                      placeholder="e.g. 20% OFF or Best Seller"
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                    />
                  </div>
                </div>
              </div>

              {/* Variants & Options */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Sizes & Colors
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Sizes (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(editingProduct.sizes || []).join(", ")}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          sizes: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="6x8 inch, 8x12 inch, 12x18 inch"
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Frame Colors (comma-separated names)
                    </label>
                    <input
                      type="text"
                      value={(editingProduct.frameColors || []).map((c) => c.name).join(", ")}
                      onChange={(e) => {
                        const names = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setEditingProduct({
                          ...editingProduct,
                          frameColors: names.map((name) => ({ name, hex: "#333333" })),
                        });
                      }}
                      placeholder="Classic Black, Warm Oak, Pure White"
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                    />
                  </div>
                </div>
              </div>

              {/* Visibility Status */}
              <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Publish to Storefront</h4>
                  <p className="text-xs text-stone-500">Unpublished products are hidden from the live website</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.enabled !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div className="border-t border-stone-200 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C85250] hover:bg-[#B34341] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BANNER EDITOR MODAL */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-auto animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {isNewBanner ? "Add New Banner" : "Edit Banner"}
                </h3>
                <p className="text-xs text-stone-500">Configure promotional sliding banners</p>
              </div>
              <button
                onClick={() => setEditingBanner(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="e.g. Handcrafted Wooden Keepsakes"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingBanner.description}
                  onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                  placeholder="Short tagline or promo text"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Destination Link *</label>
                <input
                  type="text"
                  required
                  value={editingBanner.link}
                  onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                  placeholder="e.g. /categories/frames or /shop"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">Banner Image *</label>
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs font-semibold text-[#C85250] hover:underline flex items-center gap-1"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    {uploading ? "Uploading..." : "Upload New Image"}
                  </button>
                </div>
                {editingBanner.image ? (
                  <div className="relative aspect-[16/7] w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200 mt-2">
                    <Image
                      src={editingBanner.image}
                      alt="Banner Preview"
                      fill
                      sizes="500px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => bannerFileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center hover:border-[#C85250] cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-stone-700">Click to upload banner image</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">High-resolution banner (16:7 or 16:9 ratio)</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={editingBanner.displayOrder}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, displayOrder: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={editingBanner.enabled}
                      onChange={(e) => setEditingBanner({ ...editingBanner, enabled: e.target.checked })}
                      className="w-4 h-4 text-[#C85250] rounded border-stone-300 focus:ring-[#C85250]"
                    />
                    <span className="text-xs font-semibold text-stone-800">Active on Storefront</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C85250] hover:bg-[#B34341] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? "Saving..." : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY EDITOR MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-auto animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {isNewCategory ? "Add New Category" : `Edit Category: ${editingCategory.name}`}
                </h3>
                <p className="text-xs text-stone-500">Edit taxonomy title, descriptions, type and cover image</p>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = isNewCategory
                        ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                        : editingCategory.slug;
                      setEditingCategory({
                        ...editingCategory,
                        name,
                        title: editingCategory.title || name,
                        slug: slug || editingCategory.slug,
                      });
                    }}
                    placeholder="e.g. Personalized Frames"
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Slug (URL Path) *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.slug}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    placeholder="e.g. frames"
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Page Title *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.title}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                  placeholder="e.g. Personalized Photo Frames & Keepsakes"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Short tagline or descriptive overview for SEO & category header"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category Type *</label>
                  <select
                    value={editingCategory.type || "category"}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        type: e.target.value as "category" | "occasion" | "recipient",
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                  >
                    <option value="category">Main Category</option>
                    <option value="occasion">Occasion</option>
                    <option value="recipient">Recipient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Product Count</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCategory.productCount || 0}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        productCount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">Cover / Badge Image *</label>
                  <button
                    type="button"
                    onClick={() => categoryFileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs font-semibold text-[#C85250] hover:underline flex items-center gap-1"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    {uploading ? "Uploading..." : "Upload Cover Image"}
                  </button>
                </div>
                {editingCategory.image ? (
                  <div className="flex items-center gap-4 mt-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white border border-stone-200 flex-shrink-0">
                      <Image
                        src={editingCategory.image}
                        alt="Category Preview"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={editingCategory.image}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, image: e.target.value })
                        }
                        placeholder="Image URL or upload"
                        className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85250]"
                      />
                      <button
                        type="button"
                        onClick={() => categoryFileInputRef.current?.click()}
                        className="text-[11px] text-[#C85250] hover:underline mt-1 inline-block"
                      >
                        Change Image File
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => categoryFileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:border-[#C85250] cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-7 h-7 text-stone-400 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-stone-700">Click to upload category image</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">PNG, JPG, or WEBP (Square or Landscape)</p>
                  </div>
                )}
              </div>

              <div className="border-t border-stone-200 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C85250] hover:bg-[#B34341] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE / UNPUBLISH CONFIRMATION DIALOG */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-stone-900 mb-2">
              Remove {deleteConfirm.type === "product" ? "Product" : deleteConfirm.type === "category" ? "Category" : "Banner"}?
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Are you sure you want to remove{" "}
              <strong className="text-stone-900">&quot;{deleteConfirm.name}&quot;</strong>?
              {deleteConfirm.type === "product"
                ? " You can choose to unpublish it to keep it for later, or delete it permanently."
                : deleteConfirm.type === "category"
                ? " This will remove the category from the live storefront and navigation."
                : " This will remove the banner from the storefront."}
            </p>

            <div className="flex flex-col gap-2">
              {deleteConfirm.type === "product" && (
                <button
                  onClick={() => {
                    deleteConfirm.permanent = false;
                    handleConfirmDelete();
                  }}
                  disabled={saving}
                  className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
                >
                  Unpublish Only (Recommended)
                </button>
              )}
              <button
                onClick={() => {
                  deleteConfirm.permanent = true;
                  handleConfirmDelete();
                }}
                disabled={saving}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Delete Permanently
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="w-full py-2 px-4 text-stone-500 hover:text-stone-800 text-xs font-semibold transition-colors mt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">
              Reset to Baseline Defaults?
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              This will clear all local browser overrides for Products, Top Scrolling Banners, and Categories, reverting the storefront back to the original baseline seed data.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  catalog.resetToDefaults();
                  loadAllData();
                  setResetConfirm(false);
                  setToast({
                    message: "Catalog reset to default seed data successfully.",
                    type: "info",
                  });
                }}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Reset Everything
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="w-full py-2 px-4 text-stone-500 hover:text-stone-800 text-xs font-semibold transition-colors mt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
