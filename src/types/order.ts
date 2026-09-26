import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  selectedSize: z.string().optional(),
  selectedFrameColor: z.string().optional(),
  selectedMaterial: z.string().optional(),
  customizationText: z.string().optional(),
  quantity: z.number().int().positive().max(50),
});

export const orderPlacementSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Please enter a valid full name"),
  address: z
    .string()
    .min(5, "Delivery address must be at least 5 characters")
    .max(500, "Address is too long"),
  landmark: z.string().max(200).optional(),
  items: z.array(orderItemSchema).min(1, "Cart cannot be empty"),
});

export type OrderPlacementInput = z.infer<typeof orderPlacementSchema>;

export interface OrderRecord {
  id: string; // e.g. GF-789123
  createdAt: string;
  customer: {
    fullName: string;
    address: string;
    landmark?: string;
  };
  items: {
    productId: string;
    productName: string;
    selectedSize?: string;
    selectedFrameColor?: string;
    selectedMaterial?: string;
    customizationText?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}
