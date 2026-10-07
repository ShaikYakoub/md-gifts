import { verifyAdminAuth, AdminEnv } from "../../../src/lib/admin/auth";
import { validateUploadPath, sanitizeFileName } from "../../../src/lib/admin/validation";
import { commitRepoFile, GitHubEnv } from "../../../src/lib/admin/github";

export interface R2Env {
  R2_BUCKET?: R2Bucket;
  R2_PUBLIC_URL?: string;
}

type CombinedEnv = AdminEnv & GitHubEnv & R2Env;

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

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
 * POST /api/admin/upload
 * Handles authenticated image uploads to R2 storage or repository public/uploads
 */
export async function onRequestPost(context: { request: Request; env: CombinedEnv }): Promise<Response> {
  const auth = await verifyAdminAuth(context.request, context.env);
  if (!auth.authorized) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const formData = await context.request.formData();
    const file = formData.get("file");
    const rawFolder = formData.get("folder") || formData.get("type");

    if (!file || !(file instanceof File)) {
      return jsonResponse({ error: "No image file provided in upload" }, 400);
    }

    // Only allow products, banners, or categories subfolder
    const folder = typeof rawFolder === "string" ? rawFolder.trim().toLowerCase() : "products";
    if (folder !== "products" && folder !== "banners" && folder !== "categories") {
      return jsonResponse({ error: 'Folder must be "products", "banners", or "categories"' }, 400);
    }

    // File size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return jsonResponse({ error: "File size exceeds 5MB limit" }, 400);
    }

    // MIME type check
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return jsonResponse({ error: `Unsupported file MIME type: ${file.type}` }, 400);
    }

    // Generate sanitized, collision-safe filename
    const sanitizedFileName = sanitizeFileName(file.name);
    const targetPath = `public/uploads/${folder}/${sanitizedFileName}`;

    // Validate path security (traversal prevention and extension check)
    const pathValidation = validateUploadPath(targetPath);
    if (!pathValidation.isValid) {
      return jsonResponse({ error: pathValidation.error || "Invalid file destination" }, 400);
    }

    // Read bytes
    const arrayBuffer = await file.arrayBuffer();

    // 1. Direct R2 Bucket Storage (Fast, instant, no git commit delay)
    if (context.env.R2_BUCKET) {
      const r2Key = `uploads/${folder}/${sanitizedFileName}`;
      await context.env.R2_BUCKET.put(r2Key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
      });

      const publicBase = context.env.R2_PUBLIC_URL?.replace(/\/$/, "");
      const publicUrl = publicBase
        ? `${publicBase}/${r2Key}`
        : `/uploads/${folder}/${sanitizedFileName}`;

      return jsonResponse({
        success: true,
        url: publicUrl,
        storage: "r2",
        key: r2Key,
        filename: sanitizedFileName,
        message: "Image uploaded to R2 storage instantly.",
      });
    }

    // 2. Fallback: Commit file directly to GitHub
    const fileBytes = new Uint8Array(arrayBuffer);
    const commitResult = await commitRepoFile(
      targetPath,
      fileBytes,
      `upload image "${sanitizedFileName}" to ${folder}`,
      context.env
    );

    // Return the public web URL path (Next.js serves public/ at root)
    const publicUrl = `/uploads/${folder}/${sanitizedFileName}`;

    return jsonResponse({
      success: true,
      url: publicUrl,
      path: targetPath,
      filename: sanitizedFileName,
      commitUrl: commitResult.commitUrl,
      message: "Image uploaded successfully. It will be live once the rebuild completes.",
    });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Failed to upload image" },
      500
    );
  }
}
