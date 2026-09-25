import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { orderPlacementSchema } from "../src/types/order";

describe("Order Placement Schema Validation", () => {
  const validOrder = {
    fullName: "Rahul Sharma",
    phoneNumber: "9876543210",
    email: "rahul@example.com",
    address: "Flat 402, Sunshine Heights, Main Road",
    city: "Kadapa",
    state: "Andhra Pradesh",
    pincode: "516001",
    customizationNotes: "Print Rahul & Priya · 14.02.2023",
    items: [
      {
        productId: "p1",
        productName: "Personalized Couple Frame",
        selectedSize: '8" × 10"',
        selectedFrameColor: "Black",
        selectedMaterial: "Wood",
        customizationText: "Rahul & Priya",
        quantity: 1,
      },
    ],
  };

  test("Accepts valid order submission", () => {
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

  test("Rejects invalid phone number (less than 10 digits)", () => {
    const invalid = { ...validOrder, phoneNumber: "12345" };
    const result = orderPlacementSchema.safeParse(invalid);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.error.flatten().fieldErrors.phoneNumber);
    }
  });

  test("Rejects invalid Indian PIN code (must be 6 digits)", () => {
    const invalid = { ...validOrder, pincode: "516" };
    const result = orderPlacementSchema.safeParse(invalid);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.error.flatten().fieldErrors.pincode);
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
});
