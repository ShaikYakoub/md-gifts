import { test, describe } from "node:test";
import assert from "node:assert";
import {
  levenshteinDistance,
  correctQuery,
  filterProductsFuzzy,
} from "../../src/lib/search/fuzzySearch";
import { getAllProducts } from "../../src/data/products";

describe("Fuzzy Search & Spell Correction", () => {
  test("computes correct Levenshtein distance", () => {
    assert.strictEqual(levenshteinDistance("frame", "frame"), 0);
    assert.strictEqual(levenshteinDistance("fames", "frames"), 1); // missing 'r'
    assert.strictEqual(levenshteinDistance("cuple", "couple"), 1); // missing 'o'
    assert.strictEqual(levenshteinDistance("mugg", "mug"), 1); // extra 'g'
    assert.strictEqual(levenshteinDistance("bithday", "birthday"), 1); // missing 'r'
  });

  test("corrects domain typos like 'fames' to 'frames'", () => {
    const vocab = ["frames", "mugs", "keychains", "personalized", "couple"];
    const result = correctQuery("fames", vocab);
    assert.strictEqual(result.hasCorrections, true);
    assert.strictEqual(result.correctedQuery, "frames");
  });

  test("corrects multi-word query with typos", () => {
    const vocab = ["couple", "frames", "photo", "gifts"];
    const result = correctQuery("cuple fames", vocab);
    assert.strictEqual(result.hasCorrections, true);
    assert.strictEqual(result.correctedQuery, "couple frames");
  });

  test("filters real product catalog when searching 'fames'", () => {
    const products = getAllProducts();
    const { matchedProducts, correctedQuery } = filterProductsFuzzy(products, "fames");

    assert.ok(matchedProducts.length > 0, "Should return matching frame products");
    assert.strictEqual(correctedQuery, "frames");
    // Verify results actually contain frames
    const allHaveFrames = matchedProducts.some((p) =>
      p.name.toLowerCase().includes("frame") || p.categorySlug.includes("frame")
    );
    assert.ok(allHaveFrames, "Results should include frame products");
  });

  test("filters real product catalog when searching 'mugg'", () => {
    const products = getAllProducts();
    const { matchedProducts, correctedQuery } = filterProductsFuzzy(products, "mugg");

    assert.ok(matchedProducts.length > 0, "Should return matching mug products");
    assert.strictEqual(correctedQuery, "mug");
  });

  test("keeps exact matches untouched when spelled correctly", () => {
    const products = getAllProducts();
    const { matchedProducts, correctedQuery } = filterProductsFuzzy(products, "wallet");

    assert.ok(matchedProducts.length > 0);
    assert.strictEqual(correctedQuery, null, "Should not correct correctly spelled words");
  });
});
