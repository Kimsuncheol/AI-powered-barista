"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PayPalCheckoutButton from "@/components/payments/PayPalCheckoutButton";
import { useCart } from "@/hooks/useCart";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, summary, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  const pickupInfo = useMemo(
    () => ({
      name: name.trim(),
      phone: phone.trim(),
      notes: notes.trim() || undefined,
    }),
    [name, phone, notes]
  );

  const handlePaymentSuccess = async (details: { appOrderId: string }) => {
    clearCart();
    router.push(`/order-confirmed?orderId=${details.appOrderId}`);
  };

  const handlePaymentError = (message: string) => {
    setError(message);
  };

  const isFormValid = Boolean(name.trim() && phone.trim() && items.length > 0);

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={4}>
        <Typography variant="h4" fontWeight={600}>
          Checkout
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Pickup information
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
                <TextField
                  label="Phone number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
                <TextField
                  label="Pickup notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  helperText="Optional: e.g., No straw, extra napkins."
                  multiline
                />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order summary
              </Typography>
              <Stack spacing={1} divider={<Divider sx={{ my: 1 }} />}>
                {items.map((item) => (
                  <Stack key={item.id} spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2">{item.name}</Typography>
                      <Typography variant="subtitle2">
                        {formatCurrency(item.price * item.quantity)}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body2">{formatCurrency(summary.subtotal)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Tax
                  </Typography>
                  <Typography variant="body2">{formatCurrency(summary.tax)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight={600}>
                    Total
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {formatCurrency(summary.total)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack spacing={1} sx={{ mt: 3 }}>
                {error && <Alert severity="error">{error}</Alert>}
                <PayPalCheckoutButton
                  amount={summary.total}
                  pickupInfo={pickupInfo}
                  onApprove={handlePaymentSuccess}
                  disabled={!isFormValid}
                  setProcessing={setIsProcessing}
                  onError={handlePaymentError}
                />
                <Button variant="text" onClick={() => router.push("/cart")} disabled={isProcessing}>
                  Back to cart
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
