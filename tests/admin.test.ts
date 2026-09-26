import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  productInputSchema,
  bannerInputSchema,
  validateUploadPath,
  sanitizeFileName,
} from "../src/lib/admin/validation";
import { verifyAdminAuth } from "../src/lib/admin/auth";
import { isAllowedRepoPath } from "../src/lib/admin/github";

describe("Admin Authorization (Cloudflare Access)", () => {
  const env = {
    ADMIN_EMAIL: "owner@mdgifts.in, manager@mdgifts.in",
  };

  test("Rejects unauthenticated request with missing Cf-Access header (401)", () => {
    const req = new Request("https://mdgifts.in/api/admin/products");
    const result = verifyAdminAuth(req, env);
    assert.equal(result.authorized, false);
    assert.equal(result.status, 401);
  });

  test("Rejects authenticated identity that is not in the allowed admin list (403)", () => {
    const req = new Request("https://mdgifts.in/api/admin/products", {
      headers: {
        "Cf-Access-Authenticated-User-Email": "hacker@example.com",
      },
    });
    const result = verifyAdminAuth(req, env);
    assert.equal(result.authorized, false);
    assert.equal(result.status, 403);
  });

  test("Accepts valid configured admin email case-insensitively (200)", () => {
    const req = new Request("https://mdgifts.in/api/admin/products", {
      headers: {
        "Cf-Access-Authenticated-User-Email": "OWNER@mdgifts.in",
      },
    });
    const result = verifyAdminAuth(req, env);
    assert.equal(result.authorized, true);
    assert.equal(result.status, 200);
    assert.equal(result.email, "owner@mdgifts.in");
  });

  test("Fails safely with 500 when ADMIN_EMAIL secret is missing", () => {
    const req = new Request("https://mdgifts.in/api/admin/products", {
      headers: {
        "Cf-Access-Authenticated-User-Email": "owner@mdgifts.in",
      },
    });
    const result = verifyAdminAuth(req, {});
    assert.equal(result.authorized, false);
    assert.equal(result.status, 500);
  });
});

describe("Admin Product Validation", () => {
  const validProduct = {
    id: "prod-test-1",
    slug: "personalized-frame",
    name: "Personalized Wooden Frame",
    price: 599,
    compareAtPrice: 899,
    offerTag: "Save 33%",
    categorySlug: "frames",
    images: ["/uploads/products/frame-1.jpg"],
    sizes: ["6x8 inch", "8x12 inch"],
    frameColors: [{ name: "Classic Black", hex: "#1A1A1A" }],
    enabled: true,
    displayOrder: 10,
  };

  test("Valid product passes schema validation", () => {
    const parsed = productInputSchema.parse(validProduct);
    assert.equal(parsed.name, validProduct.name);
    assert.equal(parsed.price, 599);
    assert.equal(parsed.enabled, true);
  });

  test("Rejects product with negative price", () => {
    assert.throws(
      () => productInputSchema.parse({ ...validProduct, price: -50 }),
      /Price must be >= 0/
    );
  });

  test("Rejects product with empty images array", () => {
    assert.throws(
      () => productInputSchema.parse({ ...validProduct, images: [] }),
      /At least one product image is required/
    );
  });

  test("Rejects product with invalid slug format", () => {
    assert.throws(
      () => productInputSchema.parse({ ...validProduct, slug: "Invalid Slug with Spaces!" }),
      /Slug must only contain lowercase letters/
    );
  });
});

describe("Admin Banner Validation", () => {
  const validBanner = {
    id: "banner-valentines",
    image: "/uploads/banners/hero.webp",
    title: "Valentine's Special Collection",
    description: "Handcrafted keepsakes for couples",
    link: "/categories/frames",
    enabled: true,
    displayOrder: 1,
  };

  test("Valid banner passes schema validation", () => {
    const parsed = bannerInputSchema.parse(validBanner);
    assert.equal(parsed.title, validBanner.title);
    assert.equal(parsed.enabled, true);
  });

  test("Rejects banner with missing destination link", () => {
    assert.throws(
      () => bannerInputSchema.parse({ ...validBanner, link: "" }),
      /Destination link is required/
    );
  });
});

describe("Path Validation & Repository Boundary Safety", () => {
  test("Allows valid product and banner upload paths", () => {
    assert.equal(validateUploadPath("public/uploads/products/frame-1.png").isValid, true);
    assert.equal(validateUploadPath("public/uploads/banners/hero-2.webp").isValid, true);
    assert.equal(validateUploadPath("public/uploads/products/gift-box.jpg").isValid, true);
  });

  test("Rejects path traversal attempts", () => {
    assert.equal(validateUploadPath("public/uploads/products/../../secret.txt").isValid, false);
    assert.equal(validateUploadPath("public/uploads/banners/../index.html").isValid, false);
    assert.equal(validateUploadPath("public/uploads/products/\0malicious.png").isValid, false);
  });

  test("Rejects disallowed extensions", () => {
    assert.equal(validateUploadPath("public/uploads/products/script.js").isValid, false);
    assert.equal(validateUploadPath("public/uploads/products/malicious.exe").isValid, false);
    assert.equal(validateUploadPath("public/uploads/products/payload.sh").isValid, false);
  });

  test("isAllowedRepoPath restricts modifications strictly to approved content files", () => {
    // Whitelisted files
    assert.equal(isAllowedRepoPath("content/products.json"), true);
    assert.equal(isAllowedRepoPath("content/banners.json"), true);
    assert.equal(isAllowedRepoPath("public/uploads/products/img-123.jpg"), true);
    assert.equal(isAllowedRepoPath("public/uploads/banners/hero.webp"), true);

    // Forbidden paths
    assert.equal(isAllowedRepoPath("package.json"), false);
    assert.equal(isAllowedRepoPath(".env"), false);
    assert.equal(isAllowedRepoPath("src/app/page.tsx"), false);
    assert.equal(isAllowedRepoPath(".github/workflows/deploy.yml"), false);
    assert.equal(isAllowedRepoPath("../outside-repo"), false);
  });

  test("sanitizeFileName produces safe, collision-resistant filenames", () => {
    const sanitized = sanitizeFileName("My Crazy Photo (1)!?.PNG");
    assert.ok(sanitized.endsWith(".png"));
    assert.ok(!sanitized.includes(" "));
    assert.ok(!sanitized.includes("?"));
    assert.ok(!sanitized.includes("!"));
  });
});
