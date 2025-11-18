import Link from "next/link";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

type OrderConfirmedPageProps = {
  searchParams: {
    orderId?: string;
  };
};

export default function OrderConfirmedPage({ searchParams }: OrderConfirmedPageProps) {
  const orderId = searchParams.orderId;

  return (
    <Container component="main" maxWidth="md" sx={{ py: 10 }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        {orderId ? (
          <Stack spacing={3}>
            <Typography variant="h4" fontWeight={700}>
              Order Confirmed 🎉
            </Typography>
            <Typography variant="body1">
              Your order number is <strong>{orderId}</strong>. We&apos;ll notify you when your
              pick-up is ready.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Link href={`/orders/${orderId}`} style={{ textDecoration: "none" }}>
                <Button variant="contained">Track your order</Button>
              </Link>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Button variant="outlined">Back to home</Button>
              </Link>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {/* TODO: point this to the real orders/tracking page once available. */}
              Thanks for ordering with our AI barista.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
              No order ID found.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              If you were redirected here accidentally, return to the cart to start again.
            </Typography>
            <Link href="/cart" style={{ textDecoration: "none" }}>
              <Button variant="contained">View Cart</Button>
            </Link>
          </Stack>
        )}
      </Box>
    </Container>
  );
}
