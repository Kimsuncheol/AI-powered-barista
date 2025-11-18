"use client";

import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import type { OrderStatus } from "./types";

const ORDER_STATUS_STEPS: { key: OrderStatus; label: string; description: string }[] = [
  { key: "PENDING", label: "Pending", description: "We received your order." },
  { key: "ACCEPTED", label: "Accepted", description: "A barista has accepted your order." },
  { key: "IN_PREPARATION", label: "In Preparation", description: "Your drink is being prepared." },
  { key: "READY_FOR_PICKUP", label: "Ready for Pickup", description: "Your drink is ready!" },
  { key: "COMPLETED", label: "Completed", description: "Order picked up or completed." },
];

type OrderStatusStepperProps = {
  currentStatus: OrderStatus;
  timestamps?: Record<OrderStatus, string>;
};

const getActiveStep = (currentStatus: OrderStatus) =>
  ORDER_STATUS_STEPS.findIndex((step) => step.key === currentStatus);

export default function OrderStatusStepper({ currentStatus, timestamps }: OrderStatusStepperProps) {
  const activeStep = Math.max(getActiveStep(currentStatus), 0);

  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      sx={{ width: "100%", flexWrap: "wrap" }}
      nonLinear
    >
      {ORDER_STATUS_STEPS.map((step, index) => (
        <Step key={step.key} completed={index < activeStep}>
          <StepLabel
            optional={
              timestamps && timestamps[step.key] ? (
                <Typography variant="caption" color="text.secondary">
                  {new Date(timestamps[step.key]!).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              ) : undefined
            }
          >
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
