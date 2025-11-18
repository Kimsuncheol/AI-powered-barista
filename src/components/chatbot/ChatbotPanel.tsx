"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import type { CoffeeCardData, ChatMessage } from "@/types/chatbot";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";

type ChatbotPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => Promise<void> | void;
  onAddToCart: (item: CoffeeCardData, quantity: number) => Promise<void> | void;
  onPayNow: (item: CoffeeCardData, quantity: number) => Promise<void> | void;
};

export default function ChatbotPanel({
  isOpen,
  onClose,
  messages,
  isLoading,
  onSendMessage,
  onAddToCart,
  onPayNow,
}: ChatbotPanelProps) {
  return (
    <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: { xs: "calc(100vw - 32px)", sm: 360, md: 380 },
            height: { xs: "75vh", sm: 520 },
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                AI Assistant
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                Your AI Barista
              </Typography>
            </Box>
            <IconButton size="small" aria-label="Close chat" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
          <ChatMessageList messages={messages} onAddToCart={onAddToCart} onPayNow={onPayNow} />
          {isLoading ? (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">
                The AI barista is thinking...
              </Typography>
            </Stack>
          ) : null}
          <ChatInput disabled={isLoading} onSend={onSendMessage} />
        </Paper>
      </Box>
    </Slide>
  );
}
