"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import RecommendationsSection from "@/components/recommendations/RecommendationsSection";
import { useRecommendations } from "@/hooks/useRecommendations";

export type ChatSuggestionDrink = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: ChatSuggestionDrink[];
};

const quickReplies = [
  "Recommend something sweet",
  "I want something iced",
  "Low caffeine option",
  "Show my last order style",
];

type AIChatPanelProps = {
  open: boolean;
  onClose: () => void;
  messages?: ChatMessage[];
  initialMessages?: ChatMessage[];
  onAddToCart?: (drink: ChatSuggestionDrink) => void;
  onModifyDrink?: (drink: ChatSuggestionDrink) => void;
  onSendMessage?: (
    message: string,
    context: { messages: ChatMessage[] }
  ) => Promise<ChatMessage | ChatMessage[]> | void;
};

const createClientMessageId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const formatCurrency = (value?: number) => (value ? `$${value.toFixed(2)}` : undefined);

type ChatMessageBubbleProps = {
  message: ChatMessage;
};

const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <Stack
      direction="row"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      alignItems="flex-start"
      sx={{ width: "100%" }}
    >
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: 3,
          bgcolor: isUser ? "primary.main" : "background.paper",
          color: isUser ? "primary.contrastText" : "text.primary",
          maxWidth: "80%",
          boxShadow: isUser ? 3 : "none",
        }}
      >
        <Typography variant="body2">{message.content}</Typography>
      </Paper>
    </Stack>
  );
};

type SuggestedDrinkCardProps = {
  drink: ChatSuggestionDrink;
  onAddToCart?: (drink: ChatSuggestionDrink) => void;
  onModifyDrink?: (drink: ChatSuggestionDrink) => void;
};

const SuggestedDrinkCard = ({ drink, onAddToCart, onModifyDrink }: SuggestedDrinkCardProps) => (
  <Card variant="outlined" sx={{ width: "100%" }}>
    {drink.imageUrl && (
      <CardMedia component="img" height="140" image={drink.imageUrl} alt={drink.name} />
    )}
    <CardContent sx={{ px: 2, py: 1.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          {drink.name}
        </Typography>
        {drink.price != null && (
          <Typography variant="subtitle2" color="text.secondary">
            {formatCurrency(drink.price)}
          </Typography>
        )}
      </Stack>
      {drink.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {drink.description}
        </Typography>
      )}
    </CardContent>
    <CardActions sx={{ px: 1.5, pb: 1 }}>
      <Button
        size="small"
        variant="contained"
        onClick={() => {
          onAddToCart?.(drink);
          // TODO: wire this to the shared cart state or order service.
        }}
        sx={{ textTransform: "none" }}
      >
        Add to cart
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() => {
          onModifyDrink?.(drink);
          // TODO: open the drink configuration panel.
        }}
        sx={{ textTransform: "none" }}
      >
        Modify your drink
      </Button>
    </CardActions>
  </Card>
);

export default function AIChatPanel({
  open,
  onClose,
  messages,
  initialMessages = [],
  onAddToCart,
  onModifyDrink,
  onSendMessage,
}: AIChatPanelProps) {
  const [internalMessages, setInternalMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const isControlled = messages !== undefined;

  useEffect(() => {
    if (isControlled) return;
    setInternalMessages(initialMessages);
  }, [initialMessages, isControlled]);

  const displayedMessages = messages ?? internalMessages;
  const { items: assistantRecommendations, loading: assistantLoading } = useRecommendations("assistant");
  const assistantPreview = assistantRecommendations.slice(0, 3);

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    if (!open) return;
    scrollToBottom();
  }, [displayedMessages.length, isSending, open]);

  const appendLocalMessages = (newMessages: ChatMessage | ChatMessage[]) => {
    if (isControlled) return;
    const additions = Array.isArray(newMessages) ? newMessages : [newMessages];
    setInternalMessages((prev) => [...prev, ...additions]);
  };

  const appendUserMessage = (message: ChatMessage) => {
    if (isControlled) return;
    setInternalMessages((prev) => [...prev, message]);
  };

  const handleSendMessage = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || isSending) return;

    const userMessage: ChatMessage = {
      id: createClientMessageId(),
      role: "user",
      content: text,
    };

    appendUserMessage(userMessage);
    setInputValue("");
    setIsSending(true);

    if (!onSendMessage) {
      // TODO: integrate with /ai/order-assistant when the backend endpoint is ready.
      console.info("AIChatPanel: onSendMessage handler was not provided.");
      setIsSending(false);
      return;
    }

    const contextMessages = [...displayedMessages, userMessage];

    try {
      const response = await onSendMessage(text, { messages: contextMessages });
      if (response) {
        const responses = Array.isArray(response) ? response : [response];
        appendLocalMessages(responses);
      }
    } catch (error) {
      console.error("AIChatPanel error while sending message", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSendMessage(inputValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage(inputValue);
    }
  };

  const handleQuickReply = (reply: string) => {
    void handleSendMessage(reply);
  };

  const shouldShowInitialHint = displayedMessages.length === 0 && !isSending;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          maxWidth: "100%",
          height: "100%",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 3, py: 2, flexShrink: 0 }}
        >
          <Typography variant="h6" fontWeight={600}>
            AI Barista Assistant
          </Typography>
          <IconButton onClick={onClose} aria-label="Close chat panel">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            px: 3,
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {shouldShowInitialHint && (
            <Paper
              variant="outlined"
              sx={{
                px: 3,
                py: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                alignSelf: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Ask me to recommend a drink based on your taste!
              </Typography>
            </Paper>
          )}

          {displayedMessages.map((message) => (
            <Box key={message.id} sx={{ width: "100%" }}>
              <ChatMessageBubble message={message} />
              {message.role === "assistant" && message.suggestions?.length ? (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {message.suggestions.map((drink) => (
                    <SuggestedDrinkCard
                      key={`${message.id}-${drink.id}`}
                      drink={drink}
                      onAddToCart={onAddToCart}
                      onModifyDrink={onModifyDrink}
                    />
                  ))}
                </Stack>
              ) : null}
            </Box>
          ))}

          {isSending && (
            <Paper
              variant="outlined"
              sx={{
                px: 2.5,
                py: 1.5,
                borderRadius: 3,
                bgcolor: "background.paper",
                width: "fit-content",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                AI is typing…
              </Typography>
            </Paper>
          )}
        </Box>

        <Divider />
        <Box
          sx={{
            px: 3,
            py: 1.5,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            overflowX: "auto",
          }}
        >
          <Stack direction="row" spacing={1} sx={{ flexWrap: "nowrap" }}>
            {quickReplies.map((reply) => (
              <Chip
                key={reply}
                label={reply}
                clickable
                variant="outlined"
                onClick={() => handleQuickReply(reply)}
                sx={{ flexShrink: 0 }}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ px: 3, py: 2 }}>
          <RecommendationsSection
            context="assistant"
            title="Other drinks you might like"
            items={assistantPreview}
            loading={assistantLoading}
            emptyMessage="Share more about your taste and I'll tailor a recommendation."
            onAddToCart={onAddToCart}
          />
        </Box>

        <Divider />
        <Box component="form" onSubmit={handleFormSubmit} sx={{ px: 3, py: 2 }}>
          <Stack spacing={1}>
            <TextField
              value={inputValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for a recommendation..."
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              disabled={isSending}
            />
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={isSending || !inputValue.trim()}
              sx={{ textTransform: "none" }}
            >
              Send
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
