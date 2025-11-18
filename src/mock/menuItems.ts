export type MenuItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  price: number;
};

export const menuItems: MenuItem[] = [
  {
    id: "cinnamon-espresso-craft",
    name: "Cinnamon Espresso Craft",
    description: "Espresso, toasted cinnamon, and steamed oat milk.",
    imageUrl:
      "https://images.unsplash.com/photo-1510626176961-4b57c4d6c7b0?auto=format&fit=crop&w=900&q=80",
    category: "Coffee",
    tags: ["hot", "sweet", "caffeinated"],
    price: 5.5,
  },
  {
    id: "sunrise-cold-brew",
    name: "Sunrise Cold Brew",
    description: "Bright cold brew finished with citrus foam.",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    category: "Coffee",
    tags: ["cold", "bold", "caffeinated"],
    price: 4.75,
  },
  {
    id: "vanilla-oat-flat-white",
    name: "Vanilla Oat Flat White",
    description: "Microfoam, single-origin beans, and vanilla syrup.",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    category: "Coffee",
    tags: ["hot", "sweet", "caffeinated"],
    price: 5.25,
  },
  {
    id: "hibiscus-citrus-tea",
    name: "Hibiscus Citrus Tea",
    description: "Floral hibiscus with Valencia orange and mint.",
    imageUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
    category: "Tea",
    tags: ["cold", "tart", "caffeine-free"],
    price: 4.2,
  },
  {
    id: "matcha-latte",
    name: "Stone-Ground Matcha Latte",
    description: "Creamy matcha whisked with steamed milk and chia seeds.",
    imageUrl:
      "https://images.unsplash.com/photo-1510626176961-4b57c4d6c7b0?auto=format&fit=crop&w=900&q=80",
    category: "Tea",
    tags: ["hot", "plant-based", "caffeinated"],
    price: 5.95,
  },
  {
    id: "golden-milk",
    name: "Golden Milk Elixir",
    description: "Turmeric, ginger, and oat milk finished with honeycomb dusting.",
    imageUrl:
      "https://images.unsplash.com/photo-1505252772228-9cda47a547af?auto=format&fit=crop&w=900&q=80",
    category: "Non-Coffee",
    tags: ["hot", "spiced", "wellness"],
    price: 4.9,
  },
  {
    id: "cacao-nirvana",
    name: "Cacao Nirvana",
    description: "Chilled cacao blend with oat cream and toasted hazelnut.",
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
    category: "Non-Coffee",
    tags: ["chilled", "dessert", "caffeinated"],
    price: 6.25,
  },
  {
    id: "hazelnut-maple-tart",
    name: "Hazelnut Maple Tart",
    description: "Butter crust with hazelnut praline, maple cream, and sea salt.",
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    category: "Dessert",
    tags: ["sweet", "seasonal", "vegetarian"],
    price: 7.4,
  },
];
