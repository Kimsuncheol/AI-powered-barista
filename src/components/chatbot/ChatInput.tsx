"use client";

import { useState, type KeyboardEvent } from "react";
import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton, TextField } from "@mui/material";

type ChatInputProps = {
  disabled?: boolean;
  onSend: (text: string) => Promise<void> | void;
};

export default function ChatInput({ disabled = false, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    await onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSend();
      }}
    >
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={4}
        placeholder="Ask for a recommendation..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <IconButton
              aria-label="Send message"
              onClick={() => void handleSend()}
              disabled={disabled || !value.trim()}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
}
