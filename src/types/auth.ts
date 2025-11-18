import type { UserRole } from "@/types/admin";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: UserRole;
};

export type OrderHistoryItem = {
  id: string;
  createdAt: string;
  status: "PENDING" | "ACCEPTED" | "IN_PREPARATION" | "READY_FOR_PICKUP" | "COMPLETED";
  total: number;
};

export type FavoriteDrink = {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  price?: number;
};
