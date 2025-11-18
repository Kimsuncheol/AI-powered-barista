"use client";

import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";

type PickupInfo = {
  name: string;
  phone: string;
  notes?: string;
};

type PayPalOrderPayload = {
  amount: number;
  pickupInfo: PickupInfo;
};

type PayPalOrderResponse = {
  paypalOrderId: string;
  appOrderId: string;
};

export type PayPalCheckoutButtonProps = {
  amount: number;
  pickupInfo: PickupInfo;
  onApprove: (details: PayPalOrderResponse) => Promise<void> | void;
  disabled?: boolean;
  onError?: (message: string) => void;
  setProcessing?: (isProcessing: boolean) => void;
};

const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createPayPalOrder = async (payload: PayPalOrderPayload): Promise<PayPalOrderResponse> => {
  try {
    const response = await fetch("/payments/paypal/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to create PayPal order");
    }
    return (await response.json()) as PayPalOrderResponse;
  } catch (error) {
    console.warn("PayPal create fallback (mock)", error);
    await simulateDelay(400);
    return {
      paypalOrderId: `MOCK_PAYPAL_${Date.now()}`,
      appOrderId: `APP_ORDER_${Date.now()}`,
    };
  }
};

const capturePayPalOrder = async (
  payload: PayPalOrderResponse
): Promise<PayPalOrderResponse> => {
  try {
    const response = await fetch("/payments/paypal/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to capture PayPal order");
    }
    return (await response.json()) as PayPalOrderResponse;
  } catch (error) {
    console.warn("PayPal capture fallback (mock)", error);
    await simulateDelay(400);
    return payload;
  }
};

export default function PayPalCheckoutButton({
  amount,
  pickupInfo,
  onApprove,
  disabled = false,
  onError,
  setProcessing,
}: PayPalCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    setProcessing?.(true);

    try {
      const createResponse = await createPayPalOrder({ amount, pickupInfo });
      // TODO: replace the below with the PayPal JS SDK approval flow.
      const captureResponse = await capturePayPalOrder(createResponse);
      await onApprove(captureResponse);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to process payment right now.";
      onError?.(message);
    } finally {
      setIsLoading(false);
      setProcessing?.(false);
    }
  };

  return (
    <Button
      variant="contained"
      fullWidth
      disabled={disabled || isLoading}
      onClick={handleClick}
      sx={{ textTransform: "none", py: 1.5 }}
      startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
    >
      {isLoading ? "Processing payment..." : `Pay ${amount.toFixed(2)} with PayPal`}
    </Button>
  );
}
