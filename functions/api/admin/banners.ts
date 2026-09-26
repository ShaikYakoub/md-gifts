import { verifyAdminAuth, AdminEnv } from "../../../src/lib/admin/auth";
import { bannerInputSchema, BannerInput } from "../../../src/lib/admin/validation";
import { fetchRepoFile, commitRepoFile, GitHubEnv } from "../../../src/lib/admin/github";
import { z } from "zod";

type CombinedEnv = AdminEnv & GitHubEnv;

const BANNERS_FILE_PATH = "content/banners.json";

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
 * GET /api/admin/banners
 * Returns all banners for admin dashboard
 */
export async function onRequestGet(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const file = await fetchRepoFile(BANNERS_FILE_PATH, context.env);
    if (!file.exists) {
      return jsonResponse({ banners: [], sha: "" });
    }

    const banners = JSON.parse(file.content) as BannerInput[];
    banners.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

    return jsonResponse({ banners, sha: file.sha });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to load banners" },
      500
    );
  }
}

/**
 * POST /api/admin/banners
 * Creates a new banner
 */
export async function onRequestPost(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const body = await context.request.json();
    const validatedBanner = bannerInputSchema.parse(body);

    const file = await fetchRepoFile(BANNERS_FILE_PATH, context.env);
    const existingBanners: BannerInput[] = file.exists ? JSON.parse(file.content) : [];

    if (existingBanners.some((b) => b.id === validatedBanner.id)) {
      return jsonResponse({ error: `Banner with ID "${validatedBanner.id}" already exists` }, 400);
    }

    const updatedBanners = [...existingBanners, validatedBanner];
    z.array(bannerInputSchema).parse(updatedBanners);

    const commitResult = await commitRepoFile(
      BANNERS_FILE_PATH,
      JSON.stringify(updatedBanners, null, 2) + "\n",
      `add banner "${validatedBanner.title}"`,
      context.env,
      file.sha
    );

    return jsonResponse({
      success: true,
      message: "Banner created successfully. The website rebuild has been triggered.",
      banner: validatedBanner,
      commitUrl: commitResult.commitUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse({ error: "Validation failed", details: error.flatten().fieldErrors }, 400);
    }
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to create banner" },
      error instanceof Error && error.message.includes("Conflict") ? 409 : 500
    );
  }
}

/**
 * PUT /api/admin/banners
 * Updates an existing banner
 */
export async function onRequestPut(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const body = await context.request.json();
    const validatedBanner = bannerInputSchema.parse(body);

    const file = await fetchRepoFile(BANNERS_FILE_PATH, context.env);
    if (!file.exists) {
      return jsonResponse({ error: "Banners file not found in repository" }, 404);
    }

    const existingBanners: BannerInput[] = JSON.parse(file.content);
    const index = existingBanners.findIndex((b) => b.id === validatedBanner.id);

    if (index === -1) {
      return jsonResponse({ error: `Banner with ID "${validatedBanner.id}" not found` }, 404);
    }

    existingBanners[index] = validatedBanner;
    z.array(bannerInputSchema).parse(existingBanners);

    const commitResult = await commitRepoFile(
      BANNERS_FILE_PATH,
      JSON.stringify(existingBanners, null, 2) + "\n",
      `update banner "${validatedBanner.title}"`,
      context.env,
      file.sha
    );

    return jsonResponse({
      success: true,
      message: "Banner updated successfully. The website rebuild has been triggered.",
      banner: validatedBanner,
      commitUrl: commitResult.commitUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse({ error: "Validation failed", details: error.flatten().fieldErrors }, 400);
    }
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to update banner" },
      error instanceof Error && error.message.includes("Conflict") ? 409 : 500
    );
  }
}

/**
 * DELETE /api/admin/banners
 * Deletes a banner
 */
export async function onRequestDelete(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return jsonResponse({ error: "Banner id query parameter is required" }, 400);
    }

    const file = await fetchRepoFile(BANNERS_FILE_PATH, context.env);
    if (!file.exists) {
      return jsonResponse({ error: "Banners file not found in repository" }, 404);
    }

    const existingBanners: BannerInput[] = JSON.parse(file.content);
    const targetBanner = existingBanners.find((b) => b.id === id);

    if (!targetBanner) {
      return jsonResponse({ error: `Banner with ID "${id}" not found` }, 404);
    }

    const updatedBanners = existingBanners.filter((b) => b.id !== id);
    z.array(bannerInputSchema).parse(updatedBanners);

    const commitResult = await commitRepoFile(
      BANNERS_FILE_PATH,
      JSON.stringify(updatedBanners, null, 2) + "\n",
      `delete banner "${targetBanner.title}"`,
      context.env,
      file.sha
    );

    return jsonResponse({
      success: true,
      message: "Banner deleted. The website rebuild has been triggered.",
      id,
      commitUrl: commitResult.commitUrl,
    });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to delete banner" },
      error instanceof Error && error.message.includes("Conflict") ? 409 : 500
    );
  }
}
