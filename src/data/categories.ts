import { CategoryInfo } from "@/types/catalog";
import rawCategories from "../../content/categories.json";

export const ALL_TAXONOMY: CategoryInfo[] = rawCategories as CategoryInfo[];

export const CATEGORIES: CategoryInfo[] = (rawCategories as CategoryInfo[]).filter(
  (item) => item.type === "category"
);

export const OCCASIONS: CategoryInfo[] = (rawCategories as CategoryInfo[]).filter(
  (item) => item.type === "occasion"
);

export const RECIPIENTS: CategoryInfo[] = (rawCategories as CategoryInfo[]).filter(
  (item) => item.type === "recipient"
);

export function getTaxonomyBySlug(slug: string): CategoryInfo | undefined {
  return ALL_TAXONOMY.find((item) => item.slug === slug);
}

