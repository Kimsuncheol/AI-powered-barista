"use client";

import Link from "next/link";
import { Button, Container, Paper, Stack, Typography } from "@mui/material";

export default function AdminIndexPage() {
  return (
    <Container component="main" maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            Admin
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            Operations Console
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage users, menu, orders, analytics, and AI settings for the AI-powered barista experience.
          </Typography>
        </Stack>
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              Quick links
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {[
                { label: "Users", href: "/admin/users" },
                { label: "Menu", href: "/admin/menu" },
                { label: "Orders", href: "/admin/orders" },
                { label: "Analytics", href: "/admin/analytics" },
                { label: "AI Settings", href: "/admin/ai-settings" },
              ].map((item) => (
                <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                  <Button variant="outlined">{item.label}</Button>
                </Link>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
