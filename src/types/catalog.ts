export interface ColorOption {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  size?: string;
  frameColor?: string;
  material?: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  categorySlug: string;
  occasionSlugs: string[];
  recipientSlugs: string[];
  tags: string[];
  sizes: string[];
  frameColors: ColorOption[];
  materials: string[];
  hasCustomizationText?: boolean;
  customizationPlaceholder?: string;
  variants: ProductVariant[];
  isTrending?: boolean;
  isFeatured?: boolean;
  isPersonalizedFavourite?: boolean;
  isUnder499?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  title: string;
  description: string;
  productCount: number;
  image: string;
  type: "category" | "occasion" | "recipient";
}

export interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  sizes: string[];
  colors: string[];
  materials: string[];
  frameColors: string[];
  sort: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
}
