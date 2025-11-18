"use client";

import { Paper, Stack, Typography, Grid, Box } from "@mui/material";
import type { AnalyticsSummary, SoldItemDataPoint, PeakTimePoint } from "@/types/admin";

const analyticsSummary: AnalyticsSummary = {
  totalRevenue: 6240,
  totalOrders: 389,
  averageOrderValue: 16.05,
};

const soldItems: SoldItemDataPoint[] = [
  { itemName: "Cinnamon Espresso Craft", quantity: 124 },
  { itemName: "Sunrise Cold Brew", quantity: 98 },
  { itemName: "Matcha Latte", quantity: 86 },
  { itemName: "Golden Milk", quantity: 74 },
  { itemName: "Hibiscus Citrus Tea", quantity: 63 },
];

const peakTimes: PeakTimePoint[] = [
  { label: "8 AM", count: 42 },
  { label: "9 AM", count: 58 },
  { label: "10 AM", count: 70 },
  { label: "11 AM", count: 64 },
  { label: "12 PM", count: 52 },
  { label: "1 PM", count: 49 },
  { label: "2 PM", count: 31 },
];

const maxQuantity = Math.max(...soldItems.map((item) => item.quantity));
const maxOrders = Math.max(...peakTimes.map((point) => point.count));

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function AdminAnalyticsPage() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor revenue, orders, and peak periods to keep the AI barista optimized.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {[
          { label: "Total Revenue", value: formatCurrency(analyticsSummary.totalRevenue) },
          { label: "Total Orders", value: analyticsSummary.totalOrders.toString() },
          {
            label: "Avg Order Value",
            value: formatCurrency(analyticsSummary.averageOrderValue),
          },
        ].map((card) => (
          <Grid item xs={12} md={4} key={card.label}>
            <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {card.value}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                Top Sold Items
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 2,
                  minHeight: 200,
                  px: 1,
                }}
              >
                {soldItems.map((item) => (
                  <Box key={item.itemName} sx={{ textAlign: "center", flex: 1 }}>
                    <Box
                      sx={{
                        height: `${(item.quantity / maxQuantity) * 100}%`,
                        background:
                          "linear-gradient(180deg, #ffb347 0%, #ffcc33 100%)",
                        borderRadius: 2,
                        transition: "height 0.2s ease",
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" display="block">
                      {item.itemName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.quantity}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {/* TODO: replace with GET /admin/analytics/top-items */}
                Data is refreshed periodically.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                Peak Order Times
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 2,
                  minHeight: 200,
                }}
              >
                {peakTimes.map((point) => (
                  <Box key={point.label} sx={{ textAlign: "center", flex: 1 }}>
                    <Box
                      sx={{
                        height: `${(point.count / maxOrders) * 100}%`,
                        background: "linear-gradient(180deg, #42a5f5 0%, #1e88e5 100%)",
                        borderRadius: 2,
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" display="block">
                      {point.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {point.count} orders
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {/* TODO: replace with GET /admin/analytics/revenue */}
                Bars represent orders per hour.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
