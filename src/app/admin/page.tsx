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
  Search,
  X,
  RefreshCw,
  LayoutGrid,
  Lock,
  LogOut,
  ChevronDown,
  Check,
} from "lucide-react";
import { ProductInput, BannerInput, CategoryInput } from "@/lib/admin/validation";
import { useLiveCatalog } from "@/context/CatalogContext";
import { Logo } from "@/components/ui/Logo";
import { ProductImage } from "@/components/ui/ProductImage";

interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-700 flex items-center justify-between gap-2 hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#EC0B12]/20 focus:border-[#EC0B12] transition-colors cursor-pointer shadow-2xs select-none"
      >
        <span className="truncate font-medium">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-stone-600" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full min-w-[170px] max-w-[calc(100vw-32px)] bg-white border border-stone-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95 max-h-60 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-[calc(100%-8px)] mx-1 px-3 py-2 text-xs sm:text-sm rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#FEF2F2] text-[#EC0B12] font-semibold"
                    : "text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-medium"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#EC0B12] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const categoryFileInputRef = useRef<HTMLInputElement>(null);

  // Tab navigation refs for scrolling active tab into the middle
  const tabProductsRef = useRef<HTMLButtonElement>(null);
  const tabBannersRef = useRef<HTMLButtonElement>(null);
  const tabCategoriesRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll selected tab to middle
  useEffect(() => {
    const el =
      activeTab === "products"
        ? tabProductsRef.current
        : activeTab === "banners"
        ? tabBannersRef.current
        : tabCategoriesRef.current;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeTab]);

  // Load initial data
  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }
  }

  // Filtered Products (latest ones on top)
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
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

    const getScore = (p: ProductInput, idx: number) => {
      if (p.id.startsWith("prod-")) {
        const raw = p.id.replace("prod-", "");
        const ts = parseInt(raw, 36);
        if (!isNaN(ts)) return 10000000000000 + ts;
        return 9000000000000;
      }
      const m = p.id.match(/^p(\d+)$/);
      if (m) {
        return parseInt(m[1], 10);
      }
      return idx;
    };

    return list.slice().sort((a, b) => getScore(b, 0) - getScore(a, 0));
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

  // Dynamic category options for product editing & filtering (all categories shown)
  const dynamicCategoryOptions = useMemo(() => {
    const list: { slug: string; label: string }[] = [];
    const seen = new Set<string>();

    for (const c of categories) {
      if (c.slug && !seen.has(c.slug)) {
        seen.add(c.slug);
        list.push({ slug: c.slug, label: c.name || c.title || c.slug });
      }
    }

    for (const p of products) {
      if (p.categorySlug && !seen.has(p.categorySlug)) {
        seen.add(p.categorySlug);
        list.push({
          slug: p.categorySlug,
          label: p.categorySlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        });
      }
    }

    if (list.length === 0) {
      return CATEGORY_OPTIONS;
    }
    return list;
  }, [categories, products]);

  // Handle Image Upload (supports multiple images at once)
  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    folder: "products" | "banners" | "categories"
  ) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    setUploading(true);
    const newUploadedUrls: string[] = [];

    for (const file of files) {
      // Validate size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setToast({ message: `Image ${file.name} must be less than 5MB.`, type: "error" });
        continue;
      }

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
          // Skip on read error
        }
      }

      if (uploadedUrl) {
        newUploadedUrls.push(uploadedUrl);
      }
    }

    if (newUploadedUrls.length > 0) {
      if (folder === "products" && editingProduct) {
        setEditingProduct((prev) =>
          prev ? { ...prev, images: [...prev.images, ...newUploadedUrls] } : null
        );
      } else if (folder === "banners" && editingBanner) {
        setEditingBanner((prev) =>
          prev ? { ...prev, image: newUploadedUrls[0] } : null
        );
      } else if (folder === "categories" && editingCategory) {
        setEditingCategory((prev) =>
          prev ? { ...prev, image: newUploadedUrls[0] } : null
        );
      }

      setToast({
        message: `${newUploadedUrls.length} image${newUploadedUrls.length > 1 ? "s" : ""} uploaded successfully!`,
        type: "success",
      });
    }

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

  // Direct Single-Click Delete Product, Banner, or Category
  async function handleDelete(type: "product" | "banner" | "category", id: string, permanent = true) {
    setSaving(true);
    try {
      if (type === "product") {
        catalog.deleteProduct(id, permanent);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        try {
          const url = `/api/admin/products?id=${encodeURIComponent(id)}${
            permanent ? "&permanent=true" : ""
          }`;
          await fetch(url, { method: "DELETE" });
        } catch { /* dev fallback */ }
      } else if (type === "banner") {
        catalog.deleteBanner(id);
        setBanners((prev) => prev.filter((b) => b.id !== id));
        try {
          const url = `/api/admin/banners?id=${encodeURIComponent(id)}`;
          await fetch(url, { method: "DELETE" });
        } catch { /* dev fallback */ }
      } else if (type === "category") {
        catalog.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.slug !== id));
        try {
          const url = `/api/admin/categories?slug=${encodeURIComponent(id)}`;
          await fetch(url, { method: "DELETE" });
        } catch { /* dev fallback */ }
      }

      setToast({
        message: "Item deleted successfully. Storefront updated instantly.",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Delete failed",
        type: "error",
      });
    } finally {
      setSaving(false);
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
        message: "Banner saved successfully! Storefront banners updated instantly.",
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

    const autoSlug = editingCategory.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const finalCategory: CategoryInput = {
      ...editingCategory,
      slug: (isNewCategory ? autoSlug : editingCategory.slug) || autoSlug || `cat-${Date.now().toString(36)}`,
      title: editingCategory.title?.trim() || editingCategory.name.trim(),
      type: editingCategory.type || "category",
      productCount: editingCategory.productCount ?? 0,
    };

    if (!finalCategory.name.trim()) {
      setToast({ message: "Category name is required.", type: "error" });
      return;
    }
    if (!finalCategory.image.trim()) {
      setToast({ message: "Category image is required.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      catalog.saveCategory(finalCategory, isNewCategory);

      if (isNewCategory) {
        setCategories([...categories, finalCategory]);
      } else {
        setCategories(
          categories.map((c) => (c.slug === finalCategory.slug ? finalCategory : c))
        );
      }

      try {
        const method = isNewCategory ? "POST" : "PUT";
        await fetch("/api/admin/categories", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalCategory),
        });
      } catch {
        // Dev fallback
      }

      setEditingCategory(null);
      setIsNewCategory(false);
      setToast({
        message: "Category saved successfully! Storefront categories updated instantly.",
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
            <div className="w-12 h-12 rounded-2xl bg-[#EC0B12] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
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
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
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
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full mt-2 py-2.5 px-4 bg-[#EC0B12] hover:bg-[#D0090F] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col overflow-x-hidden w-full max-w-full">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight leading-none">Admin</h1>
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
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-100 overflow-x-auto scrollbar-none scroll-smooth">
          <div className="flex justify-center items-center gap-3 sm:gap-8 min-w-max mx-auto whitespace-nowrap">
            <button
              ref={tabProductsRef}
              onClick={() => setActiveTab("products")}
              className={`py-3 px-1 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-colors cursor-pointer shrink-0 snap-center ${
                activeTab === "products"
                  ? "border-[#EC0B12] text-[#EC0B12]"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Products</span>
              <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono">
                {products.length}
              </span>
            </button>
            <button
              ref={tabBannersRef}
              onClick={() => setActiveTab("banners")}
              className={`py-3 px-1 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-colors cursor-pointer shrink-0 snap-center ${
                activeTab === "banners"
                  ? "border-[#EC0B12] text-[#EC0B12]"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Banners</span>
              <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono">
                {banners.length}
              </span>
            </button>
            <button
              ref={tabCategoriesRef}
              onClick={() => setActiveTab("categories")}
              className={`py-3 px-1 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-colors cursor-pointer shrink-0 snap-center ${
                activeTab === "categories"
                  ? "border-[#EC0B12] text-[#EC0B12]"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Categories</span>
              <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono">
                {categories.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 pointer-events-none">
          <div
            className={`p-3.5 sm:p-4 rounded-xl shadow-lg border flex items-start gap-3 pointer-events-auto ${
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
            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">{toast.message}</div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-stone-400 hover:text-stone-600 p-1 shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full max-w-full overflow-x-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-[#EC0B12] animate-spin mx-auto mb-3" />
            <p className="text-stone-600 font-medium">Loading store content...</p>
          </div>
        ) : activeTab === "products" ? (
          /* Products View */
          <div>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center mb-6">
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2 w-full sm:w-auto items-stretch sm:items-center">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                  <CustomSelect
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={[
                      { value: "all", label: "All Categories" },
                      ...dynamicCategoryOptions.map((c) => ({ value: c.slug, label: c.label })),
                    ]}
                    className="w-full sm:w-48"
                  />
                  <CustomSelect
                    value={selectedStatus}
                    onChange={(val) => setSelectedStatus(val as "all" | "published" | "draft")}
                    options={[
                      { value: "all", label: "All Statuses" },
                      { value: "published", label: "Published" },
                      { value: "draft", label: "Unpublished" },
                    ]}
                    className="w-full sm:w-36"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(createNewProductTemplate());
                  setIsNewProduct(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EC0B12] hover:bg-[#D0090F] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {/* Products List / Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-stone-900 mb-1">No products found</h3>
                <p className="text-sm text-stone-500 mb-4">Try clearing filters or add a new product.</p>
                <button
                  onClick={() => {
                    setEditingProduct(createNewProductTemplate());
                    setIsNewProduct(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#EC0B12] text-white text-sm font-semibold rounded-lg cursor-pointer"
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
                        className="p-3.5 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 hover:bg-stone-50/70 transition-colors"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          {/* Thumbnail */}
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            {product.images[0] && !product.images[0].startsWith("/images/products/") ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <ProductImage
                                slug={product.slug}
                                name={product.name}
                                categorySlug={product.categorySlug}
                                image={product.images[0]}
                                aspectRatio="square"
                                noPadding
                                className="w-full h-full"
                              />
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-bold text-stone-900 truncate max-w-[190px] sm:max-w-md">
                                {product.name}
                              </h3>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                                  isPublished
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-stone-100 text-stone-600"
                                }`}
                              >
                                {isPublished ? "Published" : "Unpublished"}
                              </span>
                              {product.offerTag && (
                                <span className="hidden md:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 shrink-0">
                                  {product.offerTag}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs text-stone-500">
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
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t border-stone-100 sm:border-t-0 pt-2.5 sm:pt-0 shrink-0">
                          <button
                            onClick={() => handleToggleProductPublished(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors text-xs font-semibold cursor-pointer"
                            title={isPublished ? "Unpublish" : "Publish"}
                          >
                            {isPublished ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                <span>Unpublish</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-emerald-700">Publish</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setEditingProduct({ ...product });
                              setIsNewProduct(false);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 shrink-0" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDelete("product", product.id, true)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
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
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EC0B12] hover:bg-[#D0090F] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#EC0B12] text-white text-sm font-semibold rounded-lg"
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
                            onClick={() => handleDelete("banner", banner.id, true)}
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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center mb-6">
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2 w-full sm:w-auto items-stretch sm:items-center">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                  />
                </div>
                <div className="overflow-x-auto scrollbar-none max-w-full pb-0.5">
                  <div className="inline-flex rounded-lg border border-stone-200 bg-white p-1 text-xs font-semibold shrink-0">
                    <button
                      onClick={() => setSelectedCategoryType("all")}
                      className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                        selectedCategoryType === "all"
                          ? "bg-[#EC0B12] text-white"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      All ({categories.length})
                    </button>
                    <button
                      onClick={() => setSelectedCategoryType("category")}
                      className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                        selectedCategoryType === "category"
                          ? "bg-[#EC0B12] text-white"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      Main ({categories.filter((c) => (c.type || "category") === "category").length})
                    </button>
                    <button
                      onClick={() => setSelectedCategoryType("occasion")}
                      className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                        selectedCategoryType === "occasion"
                          ? "bg-[#EC0B12] text-white"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      Occasions ({categories.filter((c) => c.type === "occasion").length})
                    </button>
                    <button
                      onClick={() => setSelectedCategoryType("recipient")}
                      className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                        selectedCategoryType === "recipient"
                          ? "bg-[#EC0B12] text-white"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      Recipients ({categories.filter((c) => c.type === "recipient").length})
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingCategory(createNewCategoryTemplate());
                  setIsNewCategory(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EC0B12] hover:bg-[#D0090F] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#EC0B12] text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.slug}
                    className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col hover:border-[#EC0B12]/40 transition-all"
                  >
                    <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                      {cat.image && !cat.image.startsWith("/images/categories/") ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <ProductImage
                          slug={cat.slug}
                          name={cat.name}
                          categorySlug={cat.slug}
                          image={cat.image}
                          aspectRatio="square"
                          noPadding
                          className="w-full h-full"
                        />
                      )}
                      <div className="absolute top-1.5 right-1.5">
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                          {cat.productCount ?? 0} items
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                      <div className="min-w-0">
                        <h3 className="font-bold text-stone-900 text-xs sm:text-sm truncate" title={cat.name}>
                          {cat.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between gap-1 border-t border-stone-100 pt-2 mt-2">
                        <button
                          onClick={() => {
                            setEditingCategory({ ...cat });
                            setIsNewCategory(false);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("category", cat.slug, true)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        multiple
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 border border-stone-200"
          >
            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
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
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
                  <CustomSelect
                    value={editingProduct.categorySlug}
                    onChange={(val) => setEditingProduct({ ...editingProduct, categorySlug: val })}
                    options={dynamicCategoryOptions.map((c) => ({ value: c.slug, label: c.label }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                        shortDescription: e.target.value,
                      })
                    }
                    placeholder="Product details, materials, dimensions, and specifications"
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-stone-700">
                    Images * <span className="text-stone-400 font-normal text-[11px]">(1:1 ratio)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[#EC0B12]" />
                    {uploading ? "Uploading..." : "Upload Images"}
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
                        className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md z-10 transition-transform active:scale-95 cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {editingProduct.images.length === 0 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:border-[#EC0B12] cursor-pointer transition-colors"
                    >
                      <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-stone-700">Click to upload images</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">1:1 ratio (PNG, JPG, or WEBP up to 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing (single line) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">MRP (₹)</label>
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
                    className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Discount</label>
                  <input
                    type="text"
                    value={editingProduct.offerTag || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, offerTag: e.target.value })}
                    placeholder="e.g. 20% OFF"
                    className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                  />
                </div>
              </div>

              {/* Sizes and Frame Colors */}
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
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
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
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                  />
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

            </div>

            {/* Sticky Modal Footer Actions */}
            <div className="px-5 py-3 sm:px-6 sm:py-3.5 border-t border-stone-200 bg-stone-50/90 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-[#EC0B12] hover:bg-[#D0090F] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BANNER EDITOR MODAL */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form
            onSubmit={handleSaveBanner}
            className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 border border-stone-200"
          >
            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="e.g. Handcrafted Wooden Keepsakes"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingBanner.description}
                  onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                  placeholder="Short tagline or promo text"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
                <CustomSelect
                  value={
                    dynamicCategoryOptions.some((opt) => `/categories/${opt.slug}` === editingBanner.link || opt.slug === editingBanner.link)
                      ? (editingBanner.link.startsWith("/categories/") ? editingBanner.link : `/categories/${editingBanner.link}`)
                      : (dynamicCategoryOptions[0] ? `/categories/${dynamicCategoryOptions[0].slug}` : "")
                  }
                  onChange={(val) => setEditingBanner({ ...editingBanner, link: val })}
                  options={dynamicCategoryOptions.map((c) => ({
                    value: `/categories/${c.slug}`,
                    label: c.label,
                  }))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Image * <span className="text-stone-400 font-normal text-[11px]">(16:9 ratio)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs font-semibold text-[#EC0B12] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
                {editingBanner.image ? (
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200 mt-2">
                    <Image
                      src={editingBanner.image}
                      alt="Banner Preview"
                      fill
                      sizes="500px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingBanner({ ...editingBanner, image: "" })}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md z-10 transition-transform active:scale-95 cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => bannerFileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-200 rounded-xl p-6 sm:p-8 text-center hover:border-[#EC0B12] cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-stone-700">Click to upload image</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">16:9 ratio (PNG, JPG, or WEBP up to 5MB)</p>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={editingBanner.displayOrder}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, displayOrder: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                  />
                </div>

                {/* Visibility Toggle Switch */}
                <div className="border-t border-stone-100 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">Active on Storefront</h4>
                    <p className="text-[11px] sm:text-xs text-stone-500">Enable banner on homepage sliding carousel</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={editingBanner.enabled !== false}
                      onChange={(e) => setEditingBanner({ ...editingBanner, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Sticky Modal Footer Actions */}
            <div className="px-5 py-3 sm:px-6 sm:py-3.5 border-t border-stone-200 bg-stone-50/90 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-[#EC0B12] hover:bg-[#D0090F] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {saving ? "Saving..." : "Save Banner"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CATEGORY EDITOR MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 border border-stone-200"
          >
            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                    setEditingCategory({
                      ...editingCategory,
                      name,
                      title: name,
                      slug: isNewCategory ? autoSlug : (editingCategory.slug || autoSlug),
                    });
                  }}
                  placeholder="e.g. Personalized Frames"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC0B12]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Image * <span className="text-stone-400 font-normal text-[11px]">(1:1 ratio)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => categoryFileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs font-semibold text-[#EC0B12] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
                {editingCategory.image ? (
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 mt-2">
                    <Image
                      src={editingCategory.image}
                      alt="Category Preview"
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingCategory({ ...editingCategory, image: "" })}
                      className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md z-10 transition-transform active:scale-95 cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => categoryFileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:border-[#EC0B12] cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-7 h-7 text-stone-400 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-stone-700">Click to upload image</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">1:1 ratio (PNG, JPG, or WEBP up to 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Modal Footer Actions */}
            <div className="px-5 py-3 sm:px-6 sm:py-3.5 border-t border-stone-200 bg-stone-50/90 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-[#EC0B12] hover:bg-[#D0090F] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {saving ? "Saving..." : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
