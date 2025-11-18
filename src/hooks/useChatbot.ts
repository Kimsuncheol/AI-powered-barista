"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { postChatbotMessage } from "@/lib/api/chatbot";
import { mapChatbotResponseToCoffeeCards } from "@/mappers/aiToCoffeeCard";
import { useAuth } from "@/hooks/useAuth";
import type { ChatMessage } from "@/types/chatbot";

const STORAGE_KEY = "floating-chatbot-session";

type PersistedConversation = {
  conversationId: string;
  messages: ChatMessage[];
};

const createId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const getInitialState = (): PersistedConversation => {
  if (typeof window === "undefined") {
    return { conversationId: createId(), messages: [] };
  }
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { conversationId: createId(), messages: [] };
    }
    const parsed = JSON.parse(stored) as PersistedConversation;
    return {
      conversationId: parsed?.conversationId || createId(),
      messages: Array.isArray(parsed?.messages) ? parsed.messages : [],
    };
  } catch {
    return { conversationId: createId(), messages: [] };
  }
};

const persistConversation = (value: PersistedConversation) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

export function useChatbot() {
  const { user } = useAuth();
  const [{ conversationId, messages }, setConversation] = useState<PersistedConversation>(
    () => getInitialState()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pendingRequestRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    persistConversation({ conversationId, messages });
  }, [conversationId, messages]);

  const appendMessage = useCallback((message: ChatMessage) => {
    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const resetConversation = useCallback(() => {
    setConversation({
      conversationId: createId(),
      messages: [],
    });
    setUnreadCount(0);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || pendingRequestRef.current) {
        return;
      }

      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        text: trimmed,
        createdAt: new Date().toISOString(),
      };
      appendMessage(userMessage);
      setIsLoading(true);

      const currentConversationId = conversationId || createId();

      const request = (async () => {
        try {
          const response = await postChatbotMessage({
            userMessage: trimmed,
            conversationId: currentConversationId,
            userId: user?.id,
            source: "FLOATING_CHATBOT",
          });

          const assistantMessage: ChatMessage = {
            id: createId(),
            role: "assistant",
            text: response.replyText,
            coffeeCards: mapChatbotResponseToCoffeeCards(response),
            createdAt: new Date().toISOString(),
          };

          appendMessage(assistantMessage);
          if (!isOpen) {
            setUnreadCount((count) => count + 1);
          }
        } catch (error) {
          console.error("Chatbot request failed", error);
          appendMessage({
            id: createId(),
            role: "assistant",
            text: "Sorry, I ran into an issue. Please try again in a moment.",
            createdAt: new Date().toISOString(),
          });
          if (!isOpen) {
            setUnreadCount((count) => count + 1);
          }
        } finally {
          setIsLoading(false);
          pendingRequestRef.current = null;
        }
      })();

      pendingRequestRef.current = request;
      await request;
    },
    [appendMessage, conversationId, isOpen, user]
  );

  const appendSystemMessage = useCallback(
    (text: string) => {
      const systemMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        text,
        createdAt: new Date().toISOString(),
      };
      appendMessage(systemMessage);
      if (!isOpen) {
        setUnreadCount((count) => count + 1);
      }
    },
    [appendMessage, isOpen]
  );

  const value = useMemo(
    () => ({
      isOpen,
      messages,
      isLoading,
      unreadCount,
      sendMessage,
      openChat,
      closeChat,
      resetConversation,
      appendSystemMessage,
    }),
    [
      isOpen,
      messages,
      isLoading,
      unreadCount,
      sendMessage,
      openChat,
      closeChat,
      resetConversation,
      appendSystemMessage,
    ]
  );

  return value;
}
