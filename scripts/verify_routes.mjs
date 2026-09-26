const BASE_URL = "http://localhost:3000";

const routes = [
  { path: "/", expectedTexts: ["Gifts made for the people who matter", "Giftly"] },
  { path: "/shop", expectedTexts: ["All Gifts"] },
  { path: "/categories", expectedTexts: ["All Categories"] },
  { path: "/categories/couples", expectedTexts: ["Couple Gifts"] },
  { path: "/categories/frames", expectedTexts: ["Personalized Frames"] },
  { path: "/search?q=photo", expectedTexts: ["Search"] },
  { path: "/cart", expectedTexts: ["Your Cart"] },
  { path: "/order", expectedTexts: ["Delivery Details", "Customer & Delivery Information"] },
  { path: "/about", expectedTexts: ["About Us"] },
  { path: "/contact", expectedTexts: ["Contact Us"] },
  { path: "/faq", expectedTexts: ["Frequently Asked Questions"] },
  { path: "/policies", expectedTexts: ["Terms & Policies", "Terms & Conditions", "Privacy Policy"] },
  { path: "/shipping", expectedTexts: ["Terms & Policies"] },
  { path: "/refunds", expectedTexts: ["Terms & Policies"] },
  { path: "/terms", expectedTexts: ["Terms & Policies"] },
  { path: "/privacy", expectedTexts: ["Terms & Policies"] },
  { path: "/product/personalized-couple-frame", expectedTexts: ["Personalized Couple Frame", "Size", "Frame Color"] },
  { path: "/sitemap.xml", expectedTexts: ["https://giftly.in"] },
  { path: "/robots.txt", expectedTexts: ["sitemap.xml"] },
  { path: "/images/hero-lifestyle.jpg", statusCheckOnly: true },
  { path: "/images/newsletter-gift.jpg", statusCheckOnly: true },
];

async function runAudit() {
  console.log("Starting Static Route Verification on " + BASE_URL);
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

  console.log(`\nAudit Complete: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
}

runAudit();
