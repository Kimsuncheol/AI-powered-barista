"use client";

import { Box, Grid, Typography } from "@mui/material";
import RecommendationCard from "./RecommendationCard";
import type { RecommendedItem } from "./types";

type RecommendationContext = "home" | "cart" | "assistant";

type RecommendationsSectionProps = {
  title?: string;
  items: RecommendedItem[];
  onAddToCart?: (item: RecommendedItem) => void;
  context?: RecommendationContext;
  loading?: boolean;
  emptyMessage?: string;
};

const defaultTitles: Record<RecommendationContext, string> = {
  home: "Recommended for you",
  cart: "You may also like…",
  assistant: "Other drinks you might like",
};

export default function RecommendationsSection({
  title,
  items,
  onAddToCart,
  context = "home",
  loading = false,
  emptyMessage,
}: RecommendationsSectionProps) {
  const headline = title ?? defaultTitles[context];

  const gridSizing = context === "assistant" ? { xs: 12, sm: 6 } : { xs: 12, sm: 6, md: 4 };

  return (
    <Box component="section" sx={{ width: "100%" }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {headline}
      </Typography>

      {loading ? (
        <Typography variant="body2" color="text.secondary">
          Loading recommendations…
        </Typography>
      ) : items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {emptyMessage ?? "No recommendations available right now."}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item key={item.id} {...gridSizing}>
              <RecommendationCard item={item} onAddToCart={onAddToCart} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
