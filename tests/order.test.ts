import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { orderPlacementSchema } from "../src/types/order";

describe("Order Placement Schema Validation", () => {
  const validOrder = {
    fullName: "Rahul Sharma",
    address: "Flat 402, Sunshine Heights, 4th Main Road, Kadapa, Andhra Pradesh - 516001",
    landmark: "Near Hanuman Temple",
    items: [
      {
        productId: "p1",
        productName: "Personalized Couple Frame",
        selectedSize: '8" × 10"',
        selectedFrameColor: "Black",
        selectedMaterial: "Wood",
        customizationText: "Rahul & Priya · 14 Feb 2023",
        quantity: 1,
      },
    ],
  };

  test("Accepts valid order submission with name and address", () => {
    const result = orderPlacementSchema.safeParse(validOrder);
    assert.equal(result.success, true);
  });

  test("Rejects empty full name", () => {
    const invalid = { ...validOrder, fullName: " " };
    const result = orderPlacementSchema.safeParse(invalid);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.error.flatten().fieldErrors.fullName);
    }
  });

  test("Rejects address shorter than 5 characters", () => {
    const invalid = { ...validOrder, address: "Home" };
    const result = orderPlacementSchema.safeParse(invalid);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.error.flatten().fieldErrors.address);
    }
  });

  test("Rejects empty cart items", () => {
    const invalid = { ...validOrder, items: [] };
    const result = orderPlacementSchema.safeParse(invalid);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.error.flatten().fieldErrors.items);
    }
  });

  test("Accepts order without landmark", () => {
    const withoutLandmark = {
      fullName: validOrder.fullName,
      address: validOrder.address,
      items: validOrder.items,
    };
    const result = orderPlacementSchema.safeParse(withoutLandmark);
    assert.equal(result.success, true);
  });
});
