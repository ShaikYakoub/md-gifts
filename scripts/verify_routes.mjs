import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

const routes = [
  { path: "/", expectedTexts: ["Gifts made for the people who matter", "Giftly"] },
  { path: "/shop", expectedTexts: ["All Gifts"] },
  { path: "/categories", expectedTexts: ["All Categories"] },
  { path: "/categories/couples", expectedTexts: ["Couple Gifts"] },
  { path: "/categories/frames", expectedTexts: ["Personalized Frames"] },
  { path: "/search?q=photo", expectedTexts: ["Search"] },
  { path: "/cart", expectedTexts: ["Your Cart"] },
  { path: "/order", expectedTexts: ["Cart", "Order"] },
  { path: "/order/success?id=GF-789123", expectedTexts: ["order confirmation", "Order Placed Successfully"] },
  { path: "/order/track?id=GF-789123", expectedTexts: ["order tracking", "DELHIVERY"] },
  { path: "/about", expectedTexts: ["About Us"] },
  { path: "/contact", expectedTexts: ["Contact Us"] },
  { path: "/faq", expectedTexts: ["Frequently Asked Questions"] },
  { path: "/shipping", expectedTexts: ["Shipping Policy"] },
  { path: "/refunds", expectedTexts: ["Refund"] },
  { path: "/terms", expectedTexts: ["Terms"] },
  { path: "/privacy", expectedTexts: ["Privacy Policy"] },
  { path: "/wishlist", expectedTexts: ["My Wishlist"] },
  { path: "/product/personalized-couple-frame", expectedTexts: ["Personalized Couple Frame", "Size", "Frame Color"] },
  { path: "/sitemap.xml", expectedTexts: ["https://giftly.in"] },
  { path: "/robots.txt", expectedTexts: ["sitemap.xml"] },
  { path: "/images/hero-lifestyle.jpg", statusCheckOnly: true },
  { path: "/images/newsletter-gift.jpg", statusCheckOnly: true },
];

async function runAudit() {
  console.log("Starting Comprehensive Route Verification on " + BASE_URL);
  let passed = 0;
  let failed = 0;

  for (const r of routes) {
    try {
      const res = await fetch(`${BASE_URL}${r.path}`);
      if (!res.ok) {
        console.error(`❌ FAIL: ${r.path} -> HTTP ${res.status}`);
        failed++;
        continue;
      }

      if (!r.statusCheckOnly && r.expectedTexts) {
        const text = await res.text();
        const matchesAny = r.expectedTexts.some((t) =>
          text.toLowerCase().includes(t.toLowerCase())
        );
        if (!matchesAny) {
          console.error(
            `❌ FAIL: ${r.path} -> None of expected texts found: ${JSON.stringify(r.expectedTexts)}`
          );
          failed++;
          continue;
        }
      }

      console.log(`✓ PASS: ${r.path} (HTTP ${res.status})`);
      passed++;
    } catch (err) {
      console.error(`❌ ERROR: ${r.path} -> ${err.message}`);
      failed++;
    }
  }

  // Test Order API POST
  console.log("\nTesting POST /api/order...");
  try {
    const payload = {
      fullName: "Ananya Deshmukh",
      phoneNumber: "9876501234",
      email: "ananya@example.com",
      address: "B-204, Lotus Enclave, MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      customizationNotes: "Ananya & Rohan, Est. 2024",
      items: [
        {
          productId: "p1",
          productName: "Personalized Couple Frame",
          selectedSize: '8" × 10"',
          selectedFrameColor: "Black",
          selectedMaterial: "Wood",
          customizationText: "Ananya & Rohan",
          quantity: 1,
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200, "Expected HTTP 200");
    assert.strictEqual(data.success, true, "Expected success: true");
    assert(data.orderId.startsWith("GF-"), "Expected order ID format GF-XXXXXX");
    console.log(`✓ PASS: POST /api/order created order: ${data.orderId}`);
    passed++;

    // Test GET /api/order
    const getRes = await fetch(`${BASE_URL}/api/order?id=${data.orderId}`);
    const getData = await getRes.json();
    assert.strictEqual(getRes.status, 200, "Expected HTTP 200 on GET order");
    assert.strictEqual(getData.order.id, data.orderId);
    console.log(`✓ PASS: GET /api/order retrieved order: ${getData.order.id}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: Order API -> ${err.message}`);
    failed++;
  }

  console.log(`\nAudit Complete: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
}

runAudit();
