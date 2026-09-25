"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartContextType, CartItem } from "@/types/cart";
import { Product } from "@/types/catalog";

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "giftly_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore cart on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore localStorage parse errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore localStorage quota errors
      }
    }
  }, [items, isLoaded]);

  const addItem = (newItem: Omit<CartItem, "id">) => {
    const id = `${newItem.product.id}_${newItem.selectedSize || "default"}_${newItem.selectedFrameColor || "default"}_${newItem.selectedMaterial || "default"}`;
    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, { ...newItem, id }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const openQuickView = (product: Product) => {
    setActiveQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setActiveQuickViewProduct(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= 999 ? 0 : 50;
  const total = subtotal + deliveryFee;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        totalQuantity,
        openQuickView,
        closeQuickView,
        activeQuickViewProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
