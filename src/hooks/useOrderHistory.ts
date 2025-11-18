"use client";

import { useEffect, useState } from "react";
import type { OrderHistoryItem } from "@/types/auth";

const mockOrderHistory: OrderHistoryItem[] = [
  {
    id: "order-001",
    createdAt: new Date().toISOString(),
    status: "COMPLETED",
    total: 18.75,
  },
  {
    id: "order-002",
    createdAt: new Date(new Date().getTime() - 2 * 86400000).toISOString(),
    status: "READY_FOR_PICKUP",
    total: 12.4,
  },
  {
    id: "order-003",
    createdAt: new Date(new Date().getTime() - 5 * 86400000).toISOString(),
    status: "COMPLETED",
    total: 7.2,
  },
];

export function useOrderHistory(userId?: string) {
  const [data, setData] = useState<OrderHistoryItem[]>([]);
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
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (cancelled) return;
      // TODO: replace with GET /me/orders
      setData(mockOrderHistory);
      setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { data, loading, error };
}
