"use client";

import { apiFetch } from "./client";

export type CartItem = {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  options?: Record<string, string>;
};

export type CartSummary = {
  subtotal: number;
  tax: number;
  total: number;
};

export type CartResponse = {
  items: CartItem[];
  summary: CartSummary;
};

export async function getCart(): Promise<CartResponse> {
  return apiFetch<CartResponse>("/cart");
}

export async function updateCartItem(id: string, quantity: number) {
  return apiFetch<CartResponse>("/cart/items/" + id, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function clearCart() {
  return apiFetch<CartResponse>("/cart/clear", {
    method: "POST",
  });
}

export async function addCartItem(payload: {
  itemId: string;
  quantity: number;
  options?: Record<string, unknown>;
}) {
  return apiFetch<CartResponse>("/cart/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
