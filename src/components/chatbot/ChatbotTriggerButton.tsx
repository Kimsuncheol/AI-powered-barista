"use client";

import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Badge, Box, Fab, Tooltip } from "@mui/material";

type ChatbotTriggerButtonProps = {
  isOpen: boolean;
  unreadCount: number;
  onClick: () => void;
};

export default function ChatbotTriggerButton({
  isOpen,
  unreadCount,
  onClick,
}: ChatbotTriggerButtonProps) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 16, md: 24 },
        right: { xs: 16, md: 24 },
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: isOpen ? "none" : "inline-flex",
      }}
    >
      <Tooltip title="Chat with AI barista">
        <Badge
          color="error"
          badgeContent={unreadCount > 99 ? "99+" : unreadCount}
          invisible={unreadCount === 0}
          overlap="circular"
        >
          <Fab
            color="primary"
            aria-label="Open AI barista chat"
            onClick={onClick}
            size="medium"
          >
            <ChatBubbleIcon />
          </Fab>
        </Badge>
      </Tooltip>
    </Box>
  );
}
