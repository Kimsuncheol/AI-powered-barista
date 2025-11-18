"use client";

import Image from "next/image";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { RecommendedItem } from "./types";

type RecommendationCardProps = {
  item: RecommendedItem;
  onAddToCart?: (item: RecommendedItem) => void;
};

const formatCurrency = (price?: number) => (price != null ? `$${price.toFixed(2)}` : undefined);

const placeholderImage =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80";

export default function RecommendationCard({ item, onAddToCart }: RecommendationCardProps) {
  const priceLabel = formatCurrency(item.price);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "relative",
          pt: "56.25%",
          overflow: "hidden",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Image
          src={item.imageUrl ?? placeholderImage}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={600}>
            {item.name}
          </Typography>
          {item.description && (
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          )}
          {priceLabel && (
            <Typography variant="subtitle2" fontWeight={600}>
              {priceLabel}
            </Typography>
          )}
          {item.score != null && (
            <>
              <Divider />
              <Typography variant="caption" color="text.secondary">
                Match: {Math.round(item.score * 100)}%
              </Typography>
            </>
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={() => {
            onAddToCart?.(item);
            console.info("Add recommendation to cart (mock)", item.id);
            // TODO: hook this into the cart state or backend order service.
          }}
          sx={{ textTransform: "none" }}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
