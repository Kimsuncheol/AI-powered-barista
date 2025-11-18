"use client";

import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import OrderStatusStepper from "@/components/orders/OrderStatusStepper";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import type { OrderStatus } from "@/components/orders/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  IN_PREPARATION: "In Preparation",
  READY_FOR_PICKUP: "Ready for Pickup",
  COMPLETED: "Completed",
};

const STATUS_MESSAGES: Record<OrderStatus, string> = {
  PENDING: "We’ve received your order and are waiting for a barista to accept it.",
  ACCEPTED: "A barista has accepted your order and will begin preparing it soon.",
  IN_PREPARATION: "Your drink is being prepared. This usually takes a few minutes.",
  READY_FOR_PICKUP: "Your drink is ready! Please pick it up at the counter.",
  COMPLETED: "Your order has been completed. Thanks for visiting!",
};

const formatTimestamp = (value?: string) =>
  value ? new Date(value).toLocaleString([], { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }) : undefined;

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id ?? "";
  const { data, loading, error, reload } = useOrderTracking(orderId);

  const status = data?.status;
  const statusMessage = status ? STATUS_MESSAGES[status] : undefined;
  const statusLabel = status ? STATUS_LABELS[status] : undefined;

  const lastUpdated = useMemo(() => formatTimestamp(data?.updatedAt), [data?.updatedAt]);
  const estimatedReady = useMemo(() => formatTimestamp(data?.estimatedReadyAt), [data?.estimatedReadyAt]);

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            Live tracking
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            Order Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Order ID: {orderId}
          </Typography>
        </Stack>

        <Paper variant="outlined" sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
          <Stack spacing={3}>
            {loading ? (
              <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  Fetching status… updates every 10 seconds.
                </Typography>
              </Stack>
            ) : error ? (
              <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
                <Button variant="contained" onClick={() => reload()}>
                  Retry
                </Button>
              </Box>
            ) : data ? (
              <Stack spacing={3}>
                <OrderStatusStepper currentStatus={data.status} timestamps={data.timestamps} />
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h5" fontWeight={700}>
                      {statusLabel}
                    </Typography>
                    <Chip label={statusLabel} color="primary" variant="outlined" />
                  </Stack>
                  <Typography variant="body1" color="text.secondary">
                    {statusMessage}
                  </Typography>
                </Stack>
                <Divider />
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Estimated ready time: {estimatedReady ?? "TBD"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last updated: {lastUpdated ?? "Just now"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Auto-refreshes every 10 seconds. {/* TODO: replace polling with WebSocket for instant updates */}
                  </Typography>
                  <Button variant="outlined" onClick={() => reload()} sx={{ width: "max-content" }}>
                    Refresh now
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No tracking data yet.
              </Typography>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
