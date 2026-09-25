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
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[0-9+\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, "Delivery address must be at least 5 characters")
    .max(300, "Address is too long"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100),
  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(100),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit PIN code"),
  customizationNotes: z.string().max(1000).optional(),
  orderNotes: z.string().max(500).optional(),
  items: z.array(orderItemSchema).min(1, "Cart cannot be empty"),
});

export type OrderPlacementInput = z.infer<typeof orderPlacementSchema>;

export interface OrderRecord {
  id: string; // e.g. GF-789123
  createdAt: string;
  customer: {
    fullName: string;
    phoneNumber: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  notes?: {
    customization?: string;
    order?: string;
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
  status: "received" | "confirmed" | "processing" | "shipped" | "delivered";
}
