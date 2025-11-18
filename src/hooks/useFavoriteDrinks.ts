"use client";

import { useEffect, useState } from "react";
import type { FavoriteDrink } from "@/types/auth";

const mockFavorites: FavoriteDrink[] = [
  {
    id: "favorite-espresso",
    name: "Espresso Neat",
    description: "Single-origin espresso shot with crema.",
    price: 3.5,
    imageUrl:
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "favorite-hazelnut",
    name: "Hazelnut Maple Tart",
    description: "Butter crust with hazelnut praline & maple cream.",
    price: 7.4,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  },
];

export function useFavoriteDrinks(userId?: string) {
  const [data, setData] = useState<FavoriteDrink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!userId) {
      const clearHandle = setTimeout(() => {
        if (cancelled) return;
        setData([]);
        setLoading(false);
        setError(null);
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(clearHandle);
      };
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (cancelled) return;
      // TODO: replace with GET /me/favorites endpoint
      setData(mockFavorites);
      setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { data, loading, error };
}
