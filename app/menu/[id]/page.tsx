"use client";

import { useState, type ChangeEvent, type MouseEvent } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { MenuItem } from "@/mock/menuItems";
import { menuItems } from "@/mock/menuItems";

type SizeOption = "small" | "medium" | "large";
type MilkOption = "whole" | "low-fat" | "soy" | "oat";
type SugarOption = "no-sugar" | "half-sugar" | "regular" | "extra-sweet";

const getMenuItemById = (id: string): MenuItem | undefined =>
  menuItems.find((item) => item.id === id);

const sizeLabels: Record<SizeOption, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

const milkLabels: Record<MilkOption, string> = {
  whole: "Whole",
  "low-fat": "Low-fat",
  soy: "Soy",
  oat: "Oat",
};

const sugarLabels: Record<SugarOption, string> = {
  "no-sugar": "No sugar",
  "half-sugar": "Half sugar",
  regular: "Regular",
  "extra-sweet": "Extra sweet",
};

const sugarOptions: SugarOption[] = ["no-sugar", "half-sugar", "regular", "extra-sweet"];

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

export default function MenuItemDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const menuItemId = Array.isArray(rawId) ? rawId[0] : rawId;
  const item = menuItemId ? getMenuItemById(menuItemId) : undefined;

  const [size, setSize] = useState<SizeOption>("medium");
  const [milkType, setMilkType] = useState<MilkOption>("whole");
  const [sugarLevel, setSugarLevel] = useState<SugarOption>("regular");

  const handleSizeChange = (_: MouseEvent<HTMLElement>, newSize: SizeOption | null) => {
    if (newSize) {
      setSize(newSize);
    }
  };

  const handleMilkChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMilkType(event.target.value as MilkOption);
  };

  const handleSugarChange = (_: MouseEvent<HTMLElement>, newSugar: SugarOption | null) => {
    if (newSugar) {
      setSugarLevel(newSugar);
    }
  };

  const handleAddToCart = () => {
    if (!item) return;

    const cartItem = {
      itemId: item.id,
      name: item.name,
      basePrice: item.price,
      options: {
        size,
        milkType,
        sugarLevel,
      },
    };

    console.info("Add to cart (mock)", cartItem);
    // TODO: integrate with the cart state or order API.
  };

  const handleAskAI = () => {
    if (!item) return;

    console.info("Ask AI about item (mock)", {
      item,
      size,
      milkType,
      sugarLevel,
    });
    // TODO: open the AI assistant panel (e.g. /ai/order-assistant).
  };

  if (!item) {
    return (
      <Container component="main" sx={{ py: { xs: 10, md: 16 } }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" fontWeight={600}>
            Item not found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            We could not locate that menu item. Please try a different selection.
          </Typography>
        </Box>
      </Container>
    );
  }

  const selectionSummary = `${sizeLabels[size]} · ${milkLabels[milkType]} milk · ${sugarLabels[sugarLevel]} sugar`;

  return (
    <Container component="main" sx={{ py: { xs: 6, md: 10 } }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src={item.imageUrl}
            alt={item.name}
            sx={{
              width: "100%",
              borderRadius: 3,
              height: { xs: 260, md: 360 },
              objectFit: "cover",
              boxShadow: 4,
            }}
          />
        </Grid>

        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">
                {item.category}
              </Typography>
              <Typography variant="h4" component="h1" fontWeight={700}>
                {item.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {item.description}
              </Typography>
              {item.tags.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ pt: 1 }}>
                  {item.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Stack>
              )}
            </Stack>

            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Size
                </Typography>
                <ToggleButtonGroup
                  value={size}
                  exclusive
                  onChange={handleSizeChange}
                  aria-label="Size options"
                  sx={{ flexWrap: "wrap" }}
                >
                  {Object.entries(sizeLabels).map(([value, label]) => (
                    <ToggleButton
                      key={value}
                      value={value}
                      aria-label={label}
                      sx={{ textTransform: "none" }}
                    >
                      {label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              <Box>
                <FormControl>
                  <FormLabel id="milk-options-label" sx={{ fontSize: "0.8rem" }}>
                    Milk Type
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="milk-options-label"
                    value={milkType}
                    onChange={handleMilkChange}
                    row
                  >
                    {Object.entries(milkLabels).map(([value, label]) => (
                      <FormControlLabel
                        key={value}
                        value={value}
                        control={<Radio />}
                        label={label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sugar Level
                </Typography>
                <ToggleButtonGroup
                  value={sugarLevel}
                  exclusive
                  onChange={handleSugarChange}
                  aria-label="Sugar level options"
                  sx={{ flexWrap: "wrap" }}
                >
                  {sugarOptions.map((option) => (
                    <ToggleButton key={option} value={option} sx={{ textTransform: "none" }}>
                      {sugarLabels[option]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                {selectionSummary}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {formatCurrency(item.price)}
              </Typography>
              {/* TODO: adjust price dynamically based on size/milk/sugar selection. */}
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="stretch"
            >
              <Button
                variant="contained"
                onClick={handleAddToCart}
                fullWidth
                sx={{ textTransform: "none" }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                onClick={handleAskAI}
                sx={{
                  textTransform: "none",
                  width: { xs: "100%", sm: "auto" },
                  flexShrink: 0,
                }}
              >
                Ask AI About This Item
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
