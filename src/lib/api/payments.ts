"use client";

import { apiFetch } from "./client";

export type PayPalCreatePayload = {
  amount: number;
  pickupInfo: {
    name: string;
    phone: string;
    notes?: string;
  };
};

export type PayPalOrderResponse = {
  paypalOrderId: string;
  appOrderId: string;
};

export async function createPayPalOrder(
  payload: PayPalCreatePayload
): Promise<PayPalOrderResponse> {
  return apiFetch<PayPalOrderResponse>("/payments/paypal/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function capturePayPalOrder(
  payload: PayPalOrderResponse
): Promise<PayPalOrderResponse> {
  return apiFetch<PayPalOrderResponse>("/payments/paypal/capture", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
