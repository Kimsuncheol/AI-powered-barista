"use client";

import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
} from "@mui/material";
import RecommendationsSection from "@/components/recommendations/RecommendationsSection";
import type { RecommendedItem } from "@/components/recommendations/types";
import { mockUser } from "@/lib/mockUser";

const recommendedMenu: RecommendedItem[] = [
  {
    id: "cinnamon-espresso-craft",
    name: "Cinnamon Espresso Craft",
    description: "Espresso, toasted cinnamon, and steamed oat milk.",
    price: 5.5,
    score: 0.91,
    imageUrl:
      "https://images.unsplash.com/photo-1510626176961-4b57c4d6c7b0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sunrise-cold-brew",
    name: "Sunrise Cold Brew",
    description: "Bright cold brew finished with citrus foam.",
    price: 4.75,
    score: 0.87,
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "vanilla-oat-flat-white",
    name: "Vanilla Oat Flat White",
    description: "Microfoam, single-origin beans, and vanilla syrup.",
    price: 5.25,
    score: 0.89,
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
  },
];

const menuCategories = [
  {
    id: "coffee",
    name: "Coffee",
    description: "House espressos, handcrafted lattes, and curated pour-overs.",
    href: "/menu#coffee",
  },
  {
    id: "tea",
    name: "Tea",
    description: "Botanical blends, matcha, and vibrant herbal infusions.",
    href: "/menu#tea",
  },
  {
    id: "non-coffee",
    name: "Non-Coffee",
    description: "Golden milk, cacao elixirs, and sparkling refreshments.",
    href: "/menu#non-coffee",
  },
  {
    id: "dessert",
    name: "Dessert & Snacks",
    description: "Baked goods, plant-based pastries, and snackable bites.",
    href: "/menu#dessert",
  },
];

export default function Home() {
  const isSignedIn = mockUser.isSignedIn;

  return (
    <Box component="main" sx={{ bgcolor: "background.default", color: "text.primary" }}>
      <Box
        component="section"
        sx={{
          width: "100%",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            spacing={3}
            sx={{
              textAlign: { xs: "center", md: "left" },
              alignItems: { xs: "center", md: "flex-start" },
              maxWidth: 640,
              mx: "auto",
              minHeight: { md: "55vh" },
              justifyContent: "center",
            }}
          >
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700 }}>
              AI-Powered Barista
            </Typography>
            <Typography variant="h6" color="inherit">
              Tell us what you are craving and let our AI barista craft the perfect pour.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
            >
              <Link
                href="/order"
                style={{ textDecoration: "none", width: "fit-content" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Order Now
                </Button>
              </Link>
              <Link
                href="/menu"
                style={{ textDecoration: "none", width: "fit-content" }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Explore Menu
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        {isSignedIn && (
          <Box component="section">
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Typography variant="h5" fontWeight={600}>
                Recommended for you
              </Typography>
              <Link href="/menu" style={{ textDecoration: "none" }}>
                <Button variant="text">View full menu</Button>
              </Link>
            </Stack>
            <RecommendationsSection
              items={recommendedMenu}
              context="home"
              onAddToCart={(item) => {
                console.info("Home recommendation add to cart (mock)", item.id);
                // TODO: call `/ai/recommendations?context=home` and hook into the cart.
              }}
            />
          </Box>
        )}

        <Box component="section">
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={600}>
              Menu Categories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Curated collections for every mood—from bold shots to gentle sips.
            </Typography>
          </Stack>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {menuCategories.map((category) => (
                  <Grid item xs={12} sm={6} md={3} key={category.id}>
                    <Link
                      href={category.href}
                      style={{ textDecoration: "none", display: "block" }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 3,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          height: "100%",
                          borderRadius: 3,
                          color: "inherit",
                          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                          "&:hover": {
                            borderColor: "primary.main",
                            boxShadow: 4,
                          },
                        }}
                      >
                        <Typography variant="h6" fontWeight={600}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.description}
                        </Typography>
                      </Paper>
                    </Link>
                  </Grid>
                ))}
              </Grid>
        </Box>

        <Box
          component="section"
          sx={{
            py: 6,
            px: { xs: 3, md: 5 },
            borderRadius: 4,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={3}
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Ready to order?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI barista stays tuned to your preferences—customize your pour in seconds.
              </Typography>
            </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Link
                  href="/order"
                  style={{ textDecoration: "none", width: "fit-content" }}
                >
                  <Button variant="contained" size="large">
                    Order Now
                  </Button>
                </Link>
                <Link
                  href="/menu"
                  style={{ textDecoration: "none", width: "fit-content" }}
                >
                  <Button variant="outlined" size="large">
                    Explore Menu
                  </Button>
                </Link>
              </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
