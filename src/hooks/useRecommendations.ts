import { useEffect, useState } from "react";
import type { RecommendedItem } from "@/components/recommendations/types";

export type RecommendationContext = "home" | "cart" | "assistant";

const mockRecommendations: Record<RecommendationContext, RecommendedItem[]> = {
  home: [
    {
      id: "cascara-latte",
      name: "Cascara Honey Latte",
      description: "Bright cascara syrup, espresso, and honeyed almond milk.",
      price: 6.25,
      score: 0.94,
      imageUrl:
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "cold-brew-tonic",
      name: "Cold Brew Tonic",
      description: "Sparkling tonic, citrus kiss, and house cold brew.",
      price: 5.8,
      score: 0.88,
      imageUrl:
        "https://images.unsplash.com/photo-1510626176961-4b57c4d6c7b0?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "hibiscus-citrus-tea",
      name: "Hibiscus Citrus Tea",
      description: "Floral hibiscus, Valencia orange, and mint.",
      price: 4.2,
      score: 0.82,
      imageUrl:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80",
    },
  ],
  cart: [
    {
      id: "golden-milk",
      name: "Golden Milk Elixir",
      description: "Turmeric, ginger, and oat milk finished with honeycomb dusting.",
      price: 4.9,
      score: 0.79,
      imageUrl:
        "https://images.unsplash.com/photo-1505252772228-9cda47a547af?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "cacao-nirvana",
      name: "Cacao Nirvana",
      description: "Chilled cacao blend with oat cream and toasted hazelnut.",
      price: 6.25,
      score: 0.76,
      imageUrl:
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80",
    },
  ],
  assistant: [
    {
      id: "vanilla-oat-flat-white",
      name: "Vanilla Oat Flat White",
      description: "Microfoam, single-origin beans, and vanilla syrup.",
      price: 5.25,
      score: 0.91,
      imageUrl:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "matching-chai",
      name: "Matcha Chai Fusion",
      description: "Stone-ground matcha balanced with chai spices and steamed milk.",
      price: 6.5,
      score: 0.86,
      imageUrl:
        "https://images.unsplash.com/photo-1447933601403-9c8daed5f343?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "cinnamon-espresso-craft",
      name: "Cinnamon Espresso Craft",
      description: "Espresso, toasted cinnamon, and steamed oat milk.",
      price: 5.5,
      score: 0.87,
      imageUrl:
        "https://images.unsplash.com/photo-1510626176961-4b57c4d6c7b0?auto=format&fit=crop&w=600&q=80",
    },
  ],
};

export function useRecommendations(context: RecommendationContext) {
  const [items, setItems] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadRecommendations = async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setItems([]);
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (cancelled) return;
      setItems(mockRecommendations[context]);
      setLoading(false);
    };

    void loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [context]);

  return {
    items,
    loading,
    // TODO: replace mock data with a real `/ai/recommendations?context=${context}` call
  };
}
