"use client";

import { useMemo, useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  itemId: string;
  name: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  options?: {
    size?: string;
    milkType?: string;
    sugarLevel?: string;
    [key: string]: unknown;
  };
};

export type CartSummary = {
  subtotal: number;
  tax: number;
  total: number;
};

const TAX_RATE = 0.1;

const initialCartItems: CartItem[] = [
  {
    id: "cart-line-1",
    itemId: "cinnamon-espresso-craft",
    name: "Cinnamon Espresso Craft",
    imageUrl:
      "https://images.unsplash.com/photo-1510626176961-4b57c4d6c7b0?auto=format&fit=crop&w=900&q=80",
    price: 5.5,
    quantity: 2,
    options: {
      size: "medium",
      milkType: "oat",
      sugarLevel: "regular",
    },
  },
  {
    id: "cart-line-2",
    itemId: "hibiscus-citrus-tea",
    name: "Hibiscus Citrus Tea",
    imageUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
    price: 4.2,
    quantity: 1,
    options: {
      size: "large",
      sugarLevel: "no-sugar",
    },
  },
];

let cartItems: CartItem[] = initialCartItems;
const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const setCartItems = (items: CartItem[]) => {
  cartItems = items;
  emitChange();
};

export function useCart() {
  const items = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => cartItems,
    () => cartItems
  );

  const summary = useMemo<CartSummary>(() => {
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    return {
      subtotal,
      tax,
      total,
    };
  }, [items]);

  const incrementQuantity = (id: string) => {
    const next = items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(next);
  };

  const decrementQuantity = (id: string) => {
    const next: CartItem[] = [];
    items.forEach((item) => {
      if (item.id !== id) {
        next.push(item);
        return;
      }
      if (item.quantity > 1) {
        next.push({ ...item, quantity: item.quantity - 1 });
      }
    });
    setCartItems(next);
  };

  const removeItem = (id: string) => {
    setCartItems(items.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    items,
    summary,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
  };
}
