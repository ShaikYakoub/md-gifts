import { verifyAdminAuth, AdminEnv } from "../../../src/lib/admin/auth";
import { categoryInputSchema, CategoryInput } from "../../../src/lib/admin/validation";
import { fetchRepoFile, commitRepoFile, GitHubEnv } from "../../../src/lib/admin/github";
import { z } from "zod";

type CombinedEnv = AdminEnv & GitHubEnv;

const CATEGORIES_FILE_PATH = "content/categories.json";

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * GET /api/admin/categories
 * Returns all categories for admin dashboard
 */
export async function onRequestGet(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = await verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const file = await fetchRepoFile(CATEGORIES_FILE_PATH, context.env);
    if (!file.exists) {
      return jsonResponse({ categories: [], sha: "" });
    }

    const categories = JSON.parse(file.content) as CategoryInput[];
    return jsonResponse({ categories, sha: file.sha });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to load categories" },
      500
    );
  }
}

/**
 * POST /api/admin/categories
 * Creates a new category
 */
export async function onRequestPost(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = await verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const body = await context.request.json();
    const validatedCategory = categoryInputSchema.parse(body);

    const file = await fetchRepoFile(CATEGORIES_FILE_PATH, context.env);
    const existingCategories: CategoryInput[] = file.exists ? JSON.parse(file.content) : [];

    if (existingCategories.some((c) => c.slug === validatedCategory.slug)) {
      return jsonResponse({ error: `Category with slug "${validatedCategory.slug}" already exists` }, 400);
    }

    const updatedCategories = [...existingCategories, validatedCategory];
    z.array(categoryInputSchema).parse(updatedCategories);

    const commitResult = await commitRepoFile(
      CATEGORIES_FILE_PATH,
      JSON.stringify(updatedCategories, null, 2) + "\n",
      `add category "${validatedCategory.name}"`,
      context.env,
      file.sha
    );

    return jsonResponse({
      success: true,
      message: "Category created successfully.",
      category: validatedCategory,
      commitUrl: commitResult.commitUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse({ error: "Validation failed", details: error.flatten().fieldErrors }, 400);
    }
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to create category" },
      error instanceof Error && error.message.includes("Conflict") ? 409 : 500
    );
  }
}

/**
 * PUT /api/admin/categories
 * Updates an existing category
 */
export async function onRequestPut(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = await verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const body = await context.request.json();
    const validatedCategory = categoryInputSchema.parse(body);

    const file = await fetchRepoFile(CATEGORIES_FILE_PATH, context.env);
    if (!file.exists) {
      return jsonResponse({ error: "Categories file not found in repository" }, 404);
    }

    const categories = JSON.parse(file.content) as CategoryInput[];
    const index = categories.findIndex((c) => c.slug === validatedCategory.slug);

    if (index === -1) {
      return jsonResponse({ error: `Category with slug "${validatedCategory.slug}" not found` }, 404);
    }

    categories[index] = validatedCategory;
    z.array(categoryInputSchema).parse(categories);

    const commitResult = await commitRepoFile(
      CATEGORIES_FILE_PATH,
      JSON.stringify(categories, null, 2) + "\n",
      `update category "${validatedCategory.name}"`,
      context.env,
      file.sha
    );

    return jsonResponse({
      success: true,
      message: "Category updated successfully.",
      category: validatedCategory,
      commitUrl: commitResult.commitUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse({ error: "Validation failed", details: error.flatten().fieldErrors }, 400);
    }
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to update category" },
      error instanceof Error && error.message.includes("Conflict") ? 409 : 500
    );
  }
}

/**
 * DELETE /api/admin/categories?slug=...
 * Deletes a category
 */
export async function onRequestDelete(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = await verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const url = new URL(context.request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return jsonResponse({ error: "Missing category slug parameter" }, 400);
    }

    const file = await fetchRepoFile(CATEGORIES_FILE_PATH, context.env);
    if (!file.exists) {
      return jsonResponse({ error: "Categories file not found" }, 404);
    }

    const categories = JSON.parse(file.content) as CategoryInput[];
    const existing = categories.find((c) => c.slug === slug);
    if (!existing) {
      return jsonResponse({ error: `Category "${slug}" not found` }, 404);
    }

    const updatedCategories = categories.filter((c) => c.slug !== slug);
    z.array(categoryInputSchema).parse(updatedCategories);

    const commitResult = await commitRepoFile(
      CATEGORIES_FILE_PATH,
      JSON.stringify(updatedCategories, null, 2) + "\n",
      `delete category "${existing.name}"`,
      context.env,
      file.sha
    );

    return jsonResponse({
      success: true,
      message: "Category removed successfully.",
      commitUrl: commitResult.commitUrl,
    });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to delete category" },
      error instanceof Error && error.message.includes("Conflict") ? 409 : 500
    );
  }
}
