import { verifyAdminAuth, AdminEnv } from "../../../src/lib/admin/auth";
import { productInputSchema, ProductInput } from "../../../src/lib/admin/validation";
import { fetchRepoFile, commitRepoFile, GitHubEnv } from "../../../src/lib/admin/github";
import { z } from "zod";

type CombinedEnv = AdminEnv & GitHubEnv;

const PRODUCTS_FILE_PATH = "content/products.json";

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
 * GET /api/admin/products
 * Returns all products for admin dashboard
 */
export async function onRequestGet(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const file = await fetchRepoFile(PRODUCTS_FILE_PATH, context.env);
    if (!file.exists) {
      return jsonResponse({ products: [], sha: "" });
    }

    const products = JSON.parse(file.content) as ProductInput[];
    // Sort by displayOrder ascending
    products.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

    return jsonResponse({ products, sha: file.sha });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to load products" },
      500
    );
  }
}

/**
 * POST /api/admin/products
 * Creates a new product
 */
export async function onRequestPost(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const body = await context.request.json();
    const validatedProduct = productInputSchema.parse(body);

    const file = await fetchRepoFile(PRODUCTS_FILE_PATH, context.env);
    const existingProducts: ProductInput[] = file.exists ? JSON.parse(file.content) : [];

    // Ensure unique ID
    if (existingProducts.some((p) => p.id === validatedProduct.id)) {
      return jsonResponse({ error: `Product with ID "${validatedProduct.id}" already exists` }, 400);
    }

    // Append new product
    const updatedProducts = [...existingProducts, validatedProduct];

    // Validate entire dataset integrity before committing
    z.array(productInputSchema).parse(updatedProducts);

    const commitResult = await commitRepoFile(
      PRODUCTS_FILE_PATH,
      JSON.stringify(updatedProducts, null, 2) + "\n",
      `add product "${validatedProduct.name}"`,
      context.env,
      file.sha
    );

    return jsonResponse({
      success: true,
      message: "Product created successfully. The website rebuild has been triggered.",
      product: validatedProduct,
      commitUrl: commitResult.commitUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse({ error: "Validation failed", details: error.flatten().fieldErrors }, 400);
    }
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      error instanceof Error && error.message.includes("Conflict") ? 409 : 500
    );
  }
}

/**
 * PUT /api/admin/products
 * Updates an existing product
 */
export async function onRequestPut(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const body = await context.request.json();
    const validatedProduct = productInputSchema.parse(body);

    const file = await fetchRepoFile(PRODUCTS_FILE_PATH, context.env);
    if (!file.exists) {
      return jsonResponse({ error: "Products file not found in repository" }, 404);
    }

    const existingProducts: ProductInput[] = JSON.parse(file.content);
    const index = existingProducts.findIndex((p) => p.id === validatedProduct.id);

    if (index === -1) {
      return jsonResponse({ error: `Product with ID "${validatedProduct.id}" not found` }, 404);
    }

    existingProducts[index] = validatedProduct;

    // Validate entire dataset
    z.array(productInputSchema).parse(existingProducts);

    const commitResult = await commitRepoFile(
      PRODUCTS_FILE_PATH,
      JSON.stringify(existingProducts, null, 2) + "\n",
      `update product "${validatedProduct.name}"`,
      context.env,
      file.sha
    );

    return jsonResponse({
      success: true,
      message: "Product updated successfully. The website rebuild has been triggered.",
      product: validatedProduct,
      commitUrl: commitResult.commitUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse({ error: "Validation failed", details: error.flatten().fieldErrors }, 400);
    }
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to update product" },
      error instanceof Error && error.message.includes("Conflict") ? 409 : 500
    );
  }
}

/**
 * DELETE /api/admin/products
 * Unpublishes or deletes a product
 */
export async function onRequestDelete(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");
    const permanent = url.searchParams.get("permanent") === "true";

    if (!id) {
      return jsonResponse({ error: "Product id query parameter is required" }, 400);
    }

    const file = await fetchRepoFile(PRODUCTS_FILE_PATH, context.env);
    if (!file.exists) {
      return jsonResponse({ error: "Products file not found in repository" }, 404);
    }

    const existingProducts: ProductInput[] = JSON.parse(file.content);
    const targetProduct = existingProducts.find((p) => p.id === id);

    if (!targetProduct) {
      return jsonResponse({ error: `Product with ID "${id}" not found` }, 404);
    }

    let updatedProducts: ProductInput[];
    let actionDesc: string;

    if (permanent) {
      updatedProducts = existingProducts.filter((p) => p.id !== id);
      actionDesc = `delete product "${targetProduct.name}"`;
    } else {
      updatedProducts = existingProducts.map((p) => (p.id === id ? { ...p, enabled: false } : p));
      actionDesc = `unpublish product "${targetProduct.name}"`;
    }

    // Validate entire dataset
    z.array(productInputSchema).parse(updatedProducts);

    const commitResult = await commitRepoFile(
      PRODUCTS_FILE_PATH,
      JSON.stringify(updatedProducts, null, 2) + "\n",
      actionDesc,
      context.env,
      file.sha
    );

    return jsonResponse({
      success: true,
      message: permanent
        ? "Product permanently deleted. The website rebuild has been triggered."
        : "Product unpublished. The website rebuild has been triggered.",
      id,
      commitUrl: commitResult.commitUrl,
    });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to delete product" },
      error instanceof Error && error.message.includes("Conflict") ? 409 : 500
    );
  }
}
