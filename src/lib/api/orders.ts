"use client";

import { apiFetch } from "./client";

export type OrderPayload = {
  pickupInfo: {
    name: string;
    phone: string;
    notes?: string;
  };
  items: Array<{ itemId: string; quantity: number }>;
};

export type OrderDetail = {
  id: string;
  userName: string;
  status: string;
  total: number;
  createdAt: string;
  itemsSummary: string;
};

export async function createOrder(payload: OrderPayload): Promise<OrderDetail> {
  return apiFetch<OrderDetail>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOrder(id: string): Promise<OrderDetail> {
  return apiFetch<OrderDetail>(`/orders/${id}`);
}
