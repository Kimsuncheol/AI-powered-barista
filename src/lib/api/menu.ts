"use client";

import { apiFetch } from "./client";

export type MenuItemPayload = {
  category?: string;
};

export type MenuItemDetail = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  tags: string[];
};

export async function getMenuItems(query?: MenuItemPayload): Promise<MenuItemDetail[]> {
  const params = new URLSearchParams();
  if (query?.category) {
    params.set("category", query.category);
  }
  const path = params.toString() ? `/menu/items?${params}` : "/menu/items";
  return apiFetch<MenuItemDetail[]>(path);
}
