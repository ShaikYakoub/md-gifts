import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Cart & Pricing Business Logic", () => {
  function calculateTotal(subtotal: number) {
    const deliveryFee = subtotal === 0 || subtotal >= 999 ? 0 : 50;
    const total = subtotal + deliveryFee;
    return { subtotal, deliveryFee, total };
  }

  test("Applies free delivery for orders >= ₹999", () => {
    const calculation = calculateTotal(1048);
    assert.equal(calculation.deliveryFee, 0);
    assert.equal(calculation.total, 1048);
  });

  test("Applies ₹50 delivery fee for orders < ₹999", () => {
    const calculation = calculateTotal(699);
    assert.equal(calculation.deliveryFee, 50);
    assert.equal(calculation.total, 749);
  });

  test("Zero total for empty cart", () => {
    const calculation = calculateTotal(0);
    assert.equal(calculation.deliveryFee, 0);
    assert.equal(calculation.total, 0);
  });
});
