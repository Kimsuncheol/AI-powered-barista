"use client";

import { apiFetch } from "./client";
import type { AdminUser, AdminMenuItem, AdminOrder } from "@/types/admin";

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>("/admin/users");
}

export async function updateAdminUser(userId: string, payload: Partial<AdminUser>) {
  return apiFetch<AdminUser[]>(`/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function fetchAdminMenuItems(): Promise<AdminMenuItem[]> {
  return apiFetch<AdminMenuItem[]>("/admin/menu");
}

export async function createAdminMenuItem(payload: AdminMenuItem) {
  return apiFetch<AdminMenuItem>("/admin/menu", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  return apiFetch<AdminOrder[]>("/admin/orders");
}
