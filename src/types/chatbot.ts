"use client";

export type ChatRole = "user" | "assistant";

export interface CoffeeCardData {
  itemId: number;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  defaultQuantity?: number;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  coffeeCards?: CoffeeCardData[];
  createdAt: string;
}

export interface ChatbotApiRequest {
  userMessage: string;
  conversationId: string;
  userId?: string;
  source: "FLOATING_CHATBOT";
}

export interface ChatbotApiResponse {
  replyText: string;
  action: "NONE" | "SUGGEST_ITEMS" | "ADD_TO_CART";
  coffeeRecommendations?: {
    menuItemId: number;
    name: string;
    description: string;
    imageUrl?: string | null;
    price: number;
    defaultQuantity?: number;
  }[];
}
