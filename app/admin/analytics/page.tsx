"use client";

import dynamic from "next/dynamic";
import { Paper, Stack, Typography, Grid } from "@mui/material";
import type { AnalyticsSummary, PeakTimePoint, SoldItemDataPoint } from "@/types/admin";

const AnalyticsCharts = dynamic(
  () => import("@/components/admin/AnalyticsCharts"),
  {
    ssr: false,
    loading: () => (
      <Typography variant="body2" color="text.secondary">
        Loading analytics...
      </Typography>
    ),
  }
);

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

      <AnalyticsCharts soldItems={soldItems} peakTimes={peakTimes} />
    </Stack>
  );
}
