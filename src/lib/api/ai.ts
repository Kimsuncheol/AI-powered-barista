"use client";

import { apiFetch } from "./client";

export type OrderAssistantPayload = {
  query: string;
  context: Record<string, unknown>;
};

export type RecommendationRequest = {
  context: "home" | "cart" | "assistant";
};

export async function sendAssistantQuery(payload: OrderAssistantPayload) {
  return apiFetch<{ message: string }>("/ai/order-assistant", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getRecommendations(
  query: RecommendationRequest
): Promise<{ recommendations: unknown[] }> {
  return apiFetch<{ recommendations: unknown[] }>("/ai/recommendations", {
    method: "POST",
    body: JSON.stringify(query),
  });
}
