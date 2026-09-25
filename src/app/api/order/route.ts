import { NextRequest, NextResponse } from "next/server";
import { orderPlacementSchema, OrderRecord } from "@/types/order";
import { getProductById } from "@/data/products";

// Temporary in-memory or edge store for generated orders
const ORDERS_STORE = new Map<string, OrderRecord>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod schema validation
    const validation = orderPlacementSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 2. Derive trusted prices from server catalog data (prevent price tampering)
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of data.items) {
      const product = getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          {
            success: false,
            error: `Product with id ${item.productId} was not found in catalog`,
          },
          { status: 400 }
        );
      }

      // Check variant price if size variant is selected
      const sizeVariant = product.variants?.find((v) => v.size === item.selectedSize);
      const unitPrice = sizeVariant ? sizeVariant.price : product.price;
      const totalPrice = unitPrice * item.quantity;
      calculatedSubtotal += totalPrice;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        selectedSize: item.selectedSize,
        selectedFrameColor: item.selectedFrameColor,
        selectedMaterial: item.selectedMaterial,
        customizationText: item.customizationText,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    const deliveryFee = calculatedSubtotal >= 999 ? 0 : 50;
    const calculatedTotal = calculatedSubtotal + deliveryFee;

    // 3. Generate unique Order ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `GF-${randomSuffix}`;

    const orderRecord: OrderRecord = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email || undefined,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
      notes: {
        customization: data.customizationNotes,
        order: data.orderNotes,
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      deliveryFee,
      total: calculatedTotal,
      status: "received",
    };

    // Store in memory (cleanly migratable to Cloudflare D1/KV later)
    ORDERS_STORE.set(orderId, orderRecord);

    return NextResponse.json({
      success: true,
      orderId,
      order: orderRecord,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error processing order",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  if (!orderId) {
    return NextResponse.json(
      { success: false, error: "Order ID is required" },
      { status: 400 }
    );
  }

  const order = ORDERS_STORE.get(orderId);
  if (!order) {
    return NextResponse.json(
      { success: false, error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, order });
}
