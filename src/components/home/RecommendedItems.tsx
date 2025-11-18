"use client";

import { Grid, Card, CardContent, CardActions, Button, Typography } from "@mui/material";

export interface RecommendedItem {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface RecommendedItemsProps {
  items: RecommendedItem[];
}

const RecommendedItems = ({ items }: RecommendedItemsProps) => {
  const handleAddToCart = (item: RecommendedItem) => {
    // TODO: wire up add-to-cart with the real cart service
    console.debug(`Add ${item.name} to cart`);
  };

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {item.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 2 }}
              >
                {item.description}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                {item.price}
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, mt: "auto" }}>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleAddToCart(item)}
              >
                Add to Cart
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecommendedItems;
