"use client";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import RecommendationsSection from "@/components/recommendations/RecommendationsSection";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useCart } from "@/hooks/useCart";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const placeholderImage =
  "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=80";

export default function CartPage() {
  const router = useRouter();
  const { items, summary, incrementQuantity, decrementQuantity, removeItem, clearCart } = useCart();
  const { items: recommendations, loading } = useRecommendations("cart");
  const hasItems = items.length > 0;

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 8, display: "flex", flexDirection: "column", gap: 6 }}>
      <Stack spacing={4}>
        <Typography variant="h4" fontWeight={600}>
          Your Cart
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              {hasItems ? (
                items.map((item) => (
                  <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems="flex-start"
                    >
                      <Box
                        component="img"
                        src={item.imageUrl ?? placeholderImage}
                        alt={item.name}
                        sx={{
                          width: { xs: "100%", sm: 120 },
                          height: { xs: 160, sm: 120 },
                          objectFit: "cover",
                          borderRadius: 2,
                          flexShrink: 0,
                        }}
                      />

                      <Stack spacing={1} sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.name}
                        </Typography>
                        {item.options && (
                          <Typography variant="body2" color="text.secondary">
                            {Object.entries(item.options)
                              .map(([option, value]) => `${option}: ${value}`)
                              .join(" · ")}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          Unit price: {formatCurrency(item.price)}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          Line total: {formatCurrency(item.price * item.quantity)}
                        </Typography>
                      </Stack>

                      <Stack spacing={1} alignItems="flex-end">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <IconButton
                            aria-label="Decrease quantity"
                            size="small"
                            onClick={() => decrementQuantity(item.id)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body1" fontWeight={600}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            aria-label="Increase quantity"
                            size="small"
                            onClick={() => incrementQuantity(item.id)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                        <IconButton
                          aria-label="Remove item"
                          size="small"
                          onClick={() => removeItem(item.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                ))
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">Your cart is empty</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Browse the menu to add caffeinated and non-coffee delights.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={() => router.push("/menu")}
                  >
                    Explore the menu
                  </Button>
                </Paper>
              )}

              {hasItems && (
                <Button variant="text" onClick={() => clearCart()}>
                  Clear cart
                </Button>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight={600}>
                    Subtotal
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {formatCurrency(summary.subtotal)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Tax
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(summary.tax)}
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(summary.total)}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!hasItems}
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>

      <RecommendationsSection
        context="cart"
        items={recommendations}
        loading={loading}
        emptyMessage="Stay tuned for personalized pairings."
        onAddToCart={(item) => {
          console.info("Cart recommendation added to cart (mock)", item.id);
          // TODO: integrate with cart service.
        }}
      />
    </Container>
  );
}
