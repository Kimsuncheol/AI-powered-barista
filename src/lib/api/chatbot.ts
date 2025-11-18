"use client";

import { apiFetch } from "./client";
import type { ChatbotApiRequest, ChatbotApiResponse } from "@/types/chatbot";

export async function postChatbotMessage(
  payload: ChatbotApiRequest
): Promise<ChatbotApiResponse> {
  return apiFetch<ChatbotApiResponse>("/ai/chatbot", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
