"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import type { CoffeeCardData } from "@/types/chatbot";

type CoffeeCardProps = {
  data: CoffeeCardData;
  onAddToCart: (item: CoffeeCardData, quantity: number) => Promise<void> | void;
  onPayNow: (item: CoffeeCardData, quantity: number) => Promise<void> | void;
};

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

export default function CoffeeCard({ data, onAddToCart, onPayNow }: CoffeeCardProps) {
  const [quantity, setQuantity] = useState(Math.max(1, data.defaultQuantity ?? 1));
  const [isAdding, setIsAdding] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const increment = () => setQuantity((current) => current + 1);
  const decrement = () => setQuantity((current) => Math.max(1, current - 1));

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await Promise.resolve(onAddToCart(data, quantity));
    } finally {
      setIsAdding(false);
    }
  };

  const handlePayNow = async () => {
    if (isPaying) return;
    setIsPaying(true);
    try {
      await Promise.resolve(onPayNow(data, quantity));
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      {data.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={data.imageUrl}
          alt={data.name}
          sx={{ objectFit: "cover" }}
        />
      )}
      <CardHeader
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
        subheaderTypographyProps={{ variant: "caption", color: "text.secondary" }}
        title={data.name}
        subheader={formatCurrency(data.price)}
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {data.description}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mt: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Quantity
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton size="small" onClick={decrement} aria-label="Decrease quantity">
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography variant="body1" sx={{ minWidth: 24, textAlign: "center" }}>
              {quantity}
            </Typography>
            <IconButton size="small" onClick={increment} aria-label="Increase quantity">
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, gap: 1, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          disabled={isAdding}
          onClick={() => void handleAddToCart()}
        >
          {isAdding ? "Adding..." : "Add to cart"}
        </Button>
        <Button
          variant="contained"
          size="small"
          fullWidth
          disabled={isPaying}
          onClick={() => void handlePayNow()}
        >
          {isPaying ? "Processing..." : "Pay Now"}
        </Button>
      </CardActions>
    </Card>
  );
}
