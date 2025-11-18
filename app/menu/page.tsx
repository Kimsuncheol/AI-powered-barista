"use client";

import { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem as MuiMenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MenuItemCard from "@/components/menu/MenuItemCard";
import type { MenuItem } from "@/mock/menuItems";
import { menuItems } from "@/mock/menuItems";

const filterMenuItems = (
  items: MenuItem[],
  category: string,
  tags: string[],
  priceRange: [number, number]
) => {
  return items.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesTags = tags.length === 0 || tags.every((tag) => item.tags.includes(tag));
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

    return matchesCategory && matchesTags && matchesPrice;
  });
};

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

export default function MenuPage() {
  const categoryOptions = useMemo(() => {
    const categories = new Set<string>(menuItems.map((item) => item.category));
    return ["All", ...categories];
  }, []);

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    menuItems.forEach((item) => item.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const priceBounds = useMemo(() => {
    const prices = menuItems.map((item) => item.price);
    return [Math.min(...prices), Math.max(...prices)] as [number, number];
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(priceBounds);

  const filteredItems = useMemo(
    () => filterMenuItems(menuItems, selectedCategory, selectedTags, priceRange),
    [selectedCategory, selectedTags, priceRange]
  );

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };

  const handleTagsChange = (_: unknown, value: string[]) => {
    setSelectedTags(value);
  };

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  const handleAddToCart = (item: MenuItem) => {
    console.info("Add to cart", item.id);
    // TODO: connect to the cart state or backend order service.
  };

  const handleAskAI = (item: MenuItem) => {
    console.info("Ask AI", item.id);
    // TODO: surface the AI customization assistant.
  };

  return (
    <Container component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="overline" color="text.secondary">
          Explore
        </Typography>
        <Typography variant="h3" component="h1" fontWeight={700}>
          Menu
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
          Choose your drink and let our AI assistant help you refine the perfect pour.
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ md: "center" }}
        sx={{ mb: 4 }}
      >
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel id="menu-category-label">Category</InputLabel>
          <Select
            labelId="menu-category-label"
            label="Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categoryOptions.map((option) => (
              <MuiMenuItem key={option} value={option}>
                {option}
              </MuiMenuItem>
            ))}
          </Select>
        </FormControl>

        <Autocomplete
          multiple
          options={tagOptions}
          value={selectedTags}
          onChange={handleTagsChange}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          renderInput={(params) => (
            <TextField {...params} label="Tags" placeholder="Search tags" />
          )}
        />

        <Box sx={{ width: { xs: "100%", md: 260 } }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Price: {formatCurrency(priceRange[0])} – {formatCurrency(priceRange[1])}
          </Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => formatCurrency(value)}
            min={priceBounds[0]}
            max={priceBounds[1]}
            step={0.25}
            disableSwap
          />
        </Box>
      </Stack>

      {filteredItems.length === 0 ? (
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No items match your filters. Try relaxing the filters above.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <MenuItemCard
                item={item}
                onAddToCart={handleAddToCart}
                onAskAI={handleAskAI}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
