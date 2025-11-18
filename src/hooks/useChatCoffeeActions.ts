"use client";

import { useCallback } from "react";
import { addCartItem } from "@/lib/api/cart";
import { createOrder } from "@/lib/api/orders";
import { capturePayPalOrder, createPayPalOrder } from "@/lib/api/payments";
import type { CoffeeCardData } from "@/types/chatbot";

export function useChatCoffeeActions() {
  const handleAddToCart = useCallback(async (item: CoffeeCardData, quantity: number) => {
    await addCartItem({
      itemId: String(item.itemId),
      quantity,
    });
  }, []);

  const handlePayNow = useCallback(async (item: CoffeeCardData, quantity: number) => {
    const order = await createOrder({
      pickupInfo: {
        name: "AI Chatbot Order",
        phone: "N/A",
      },
      items: [{ itemId: String(item.itemId), quantity }],
    });

    const amount = item.price * quantity;
    const paypalOrder = await createPayPalOrder({
      amount,
      pickupInfo: {
        name: "AI Chatbot Order",
        phone: "N/A",
      },
    });

    const captureResponse = await capturePayPalOrder(paypalOrder);

    return {
      orderId: order.id,
      paypalOrderId: captureResponse.paypalOrderId,
    };
  }, []);

  return {
    handleAddToCart,
    handlePayNow,
  };
}
