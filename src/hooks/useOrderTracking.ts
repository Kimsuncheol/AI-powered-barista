"use client";

import { useCallback, useEffect, useState } from "react";
import type { OrderTracking } from "@/components/orders/types";

const fetchOrderTracking = async (orderId: string): Promise<OrderTracking> => {
  // TODO: replace the mocked endpoint with an actual GET /orders/${orderId}.
  const response = await fetch(`/api/mock-orders/${orderId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch order tracking data");
  }
  return response.json();
};

export function useOrderTracking(orderId: string) {
  const [data, setData] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const tracking = await fetchOrderTracking(orderId);
      setData(tracking);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return undefined;
    let mounted = true;
    const interval = setInterval(() => {
      if (!mounted) return;
      void load();
    }, 10000);

    const run = async () => {
      if (!mounted) return;
      await load();
    };

    void run();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [orderId, load]);

  // TODO: replace polling with a WebSocket subscription to /ws/orders/${orderId} for real-time updates.

  return { data, loading, error, reload: load };
}
