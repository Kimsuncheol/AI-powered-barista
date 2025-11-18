"use client";

import { useEffect, useRef } from "react";
import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import type { CoffeeCardData, ChatMessage } from "@/types/chatbot";
import CoffeeCard from "./CoffeeCard";

type ChatMessageListProps = {
  messages: ChatMessage[];
  onAddToCart: (item: CoffeeCardData, quantity: number) => Promise<void> | void;
  onPayNow: (item: CoffeeCardData, quantity: number) => Promise<void> | void;
};

export default function ChatMessageList({
  messages,
  onAddToCart,
  onPayNow,
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const node = containerRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        overflowY: "auto",
        pr: 0.5,
      }}
    >
      <Stack spacing={2}>
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <Stack
              key={message.id}
              direction="row"
              justifyContent={isUser ? "flex-end" : "flex-start"}
              alignItems="flex-start"
            >
              <Paper
                elevation={isUser ? 3 : 0}
                sx={{
                  px: 2,
                  py: 1.5,
                  maxWidth: "90%",
                  borderRadius: 3,
                  bgcolor: isUser
                    ? theme.palette.primary.main
                    : theme.palette.background.default,
                  color: isUser
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {message.text}
                </Typography>
                {message.coffeeCards?.length ? (
                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    {message.coffeeCards.map((card) => (
                      <CoffeeCard
                        key={`${message.id}-${card.itemId}`}
                        data={card}
                        onAddToCart={onAddToCart}
                        onPayNow={onPayNow}
                      />
                    ))}
                  </Stack>
                ) : null}
              </Paper>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
