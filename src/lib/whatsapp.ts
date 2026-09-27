import { CartItem } from "@/types/cart";

export const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

export function getGeneralWhatsAppUrl(): string {
  const message = "Hi Giftly! I have a question about personalized gifts.";
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export interface OrderWhatsAppPayload {
  fullName: string;
  address: string;
  landmark?: string;
  items: CartItem[];
  total: number;
}

export function buildOrderWhatsAppUrl(payload: OrderWhatsAppPayload): string {
  const { fullName, address, landmark, items, total } = payload;

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const lines: string[] = [
    "🎁 *NEW ORDER REQUEST — GIFTLY*",
    "",
    "👤 *Customer Details:*",
    `• *Name:* ${fullName.trim()}`,
    `• *Delivery Address:* ${address.trim()}`,
  ];

  if (landmark && landmark.trim()) {
    lines.push(`• *Landmark:* ${landmark.trim()}`);
  }

  lines.push("", `📦 *Order Items (${totalItemsCount}):*`);

  items.forEach((item, idx) => {
    lines.push(`${idx + 1}. *${item.product.name}*`);
    lines.push(
      `   • Qty: ${item.quantity} × ₹${item.price.toLocaleString("en-IN")} = ₹${(
        item.price * item.quantity
      ).toLocaleString("en-IN")}`
    );
    if (item.selectedSize) {
      lines.push(`   • Size: ${item.selectedSize}`);
    }
    if (item.selectedFrameColor) {
      lines.push(`   • Frame: ${item.selectedFrameColor}`);
    }
    if (item.selectedMaterial) {
      lines.push(`   • Material: ${item.selectedMaterial}`);
    }
    if (item.customizationText && item.customizationText.trim()) {
      lines.push(`   • Custom Notes: "${item.customizationText.trim()}"`);
    }
  });

  lines.push(
    "",
    "💰 *Order Total:*",
    `• *Total Payable:* ₹${total.toLocaleString("en-IN")}`,
    "",
    "✨ Please confirm my order and let me know where to send photos for customization!"
  );

  const fullMessage = lines.join("\n");
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(fullMessage)}`;
}
