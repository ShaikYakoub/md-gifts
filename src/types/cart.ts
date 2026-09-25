import { Product } from "./catalog";

export interface CartItem {
  id: string; // unique item key e.g. `${product.id}-${size}-${frameColor}-${material}`
  product: Product;
  selectedSize?: string;
  selectedFrameColor?: string;
  selectedMaterial?: string;
  customizationText?: string;
  price: number;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalQuantity: number;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  activeQuickViewProduct: Product | null;
}
