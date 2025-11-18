"use client";

import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import type { PeakTimePoint, SoldItemDataPoint } from "@/types/admin";

type AnalyticsChartsProps = {
  soldItems: SoldItemDataPoint[];
  peakTimes: PeakTimePoint[];
};

export default function AnalyticsCharts({ soldItems, peakTimes }: AnalyticsChartsProps) {
  const maxQuantity = Math.max(...soldItems.map((item) => item.quantity), 1);
  const maxOrders = Math.max(...peakTimes.map((point) => point.count), 1);

  return (
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
                minHeight: 220,
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
                      mb: 1,
                      transition: "height 0.2s ease",
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
              Data refreshes throughout the day.
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
                minHeight: 220,
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
  );
}
