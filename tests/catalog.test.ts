import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { PRODUCTS, getAllProducts, getProductBySlug } from "../src/data/products";
import { CATEGORIES, OCCASIONS, RECIPIENTS } from "../src/data/categories";

describe("Catalog Data Integrity", () => {
  test("Catalog contains over 100 personalized gifts", () => {
    const products = getAllProducts();
    assert.ok(products.length >= 100, `Expected at least 100 products, got ${products.length}`);
  });

  test("Every product has required fields and valid pricing", () => {
    for (const product of PRODUCTS) {
      assert.ok(product.id, "Product must have an id");
      assert.ok(product.slug, "Product must have a slug");
      assert.ok(product.name, "Product must have a name");
      assert.ok(product.price > 0, `Product ${product.id} price must be > 0`);
      assert.ok(product.rating >= 4.0 && product.rating <= 5.0, "Rating must be between 4 and 5");
      assert.ok(product.reviewsCount >= 0, "Reviews count must be >= 0");
      assert.ok(product.categorySlug, "Category slug must be defined");
      assert.ok(product.sizes.length > 0, "Sizes must have at least 1 option");
      assert.ok(product.materials.length > 0, "Materials must have at least 1 option");
    }
  });

  test("Taxonomy has all required categories, occasions, and recipients", () => {
    assert.ok(CATEGORIES.length >= 6, "Categories count must be at least 6");
    assert.ok(OCCASIONS.length >= 9, "Occasions count must be at least 9");
    assert.ok(RECIPIENTS.length >= 8, "Recipients count must be at least 8");

    // Check specific required slugs from screenshots
    const coupleFrame = getProductBySlug("personalized-couple-frame");
    assert.ok(coupleFrame, "Must contain 'personalized-couple-frame'");
    assert.equal(coupleFrame?.price, 699);
  });
});
