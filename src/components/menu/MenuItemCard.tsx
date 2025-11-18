import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { MenuItem } from "@/mock/menuItems";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const placeholderImage =
  "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=900&q=80";

export type MenuItemCardProps = {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
  onAskAI?: (item: MenuItem) => void;
};

export default function MenuItemCard({
  item,
  onAddToCart,
  onAskAI,
}: MenuItemCardProps) {
  const priceLabel = currencyFormatter.format(item.price);

  const handleAddToCart = () => {
    console.info("Add to cart", item.id);
    onAddToCart?.(item);
    // TODO: wire in the actual cart service or context.
  };

  const handleAskAI = () => {
    console.info("Ask AI", item.id);
    onAskAI?.(item);
    // TODO: open the AI ordering assistant or customization panel.
  };

  return (
    <Card elevation={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height={190}
        image={item.imageUrl || placeholderImage}
        alt={item.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {item.description}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            {priceLabel}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", justifyContent: "flex-end", gap: 0.5 }}>
            {item.tags.slice(0, 3).map((tag) => (
              <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
            ))}
          </Stack>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
          <Button variant="contained" fullWidth onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button variant="outlined" fullWidth onClick={handleAskAI}>
            Ask AI
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}
