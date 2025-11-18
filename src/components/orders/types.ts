export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PREPARATION"
  | "READY_FOR_PICKUP"
  | "COMPLETED";

export type OrderTracking = {
  orderId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedReadyAt?: string;
  timestamps?: {
    PENDING?: string;
    ACCEPTED?: string;
    IN_PREPARATION?: string;
    READY_FOR_PICKUP?: string;
    COMPLETED?: string;
  };
};
