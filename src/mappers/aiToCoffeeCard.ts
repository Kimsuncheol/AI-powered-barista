"use client";

import type { CoffeeCardData, ChatbotApiResponse } from "@/types/chatbot";

export function mapChatbotResponseToCoffeeCards(
  response: ChatbotApiResponse
): CoffeeCardData[] {
  if (!response.coffeeRecommendations?.length) {
    return [];
  }

  return response.coffeeRecommendations.map((item) => ({
    itemId: item.menuItemId,
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl ?? undefined,
    price: item.price,
    defaultQuantity: item.defaultQuantity ?? 1,
  }));
}
