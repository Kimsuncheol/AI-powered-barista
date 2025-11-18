"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Card, Divider, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { AdminOrder, AdminOrderStatus } from "@/types/admin";

const statusFlow: AdminOrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "IN_PREPARATION",
  "READY_FOR_PICKUP",
  "COMPLETED",
];

const mockOrders: AdminOrder[] = [
  {
    id: "order-1001",
    userName: "Hannah B.",
    createdAt: new Date().toISOString(),
    status: "PENDING",
    total: 18.8,
    itemsSummary: "2x Latte, 1x Matcha",
  },
  {
    id: "order-1002",
    userName: "Liam S.",
    createdAt: new Date(Date.now() - 600000).toISOString(),
    status: "IN_PREPARATION",
    total: 12.4,
    itemsSummary: "1x Cold Brew Tonic",
  },
  {
    id: "order-1003",
    userName: "Keira C.",
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    status: "READY_FOR_PICKUP",
    total: 9.7,
    itemsSummary: "1x Golden Milk, 1x Cacao Nirvana",
  },
  {
    id: "order-1004",
    userName: "Noah D.",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    status: "ACCEPTED",
    total: 6.5,
    itemsSummary: "1x Hazelnut Tart",
  },
];

const formatTime = (timestamp: string) =>
  new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(mockOrders);

  const groupedOrders = useMemo(() => {
    return statusFlow.reduce<Record<AdminOrderStatus, AdminOrder[]>>((acc, status) => {
      acc[status] = orders.filter((order) => order.status === status);
      return acc;
    }, {} as Record<AdminOrderStatus, AdminOrder[]>);
  }, [orders]);

  const updateStatus = (orderId: string, status: AdminOrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
    // TODO: POST /admin/orders/{id}/status
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) => [...prev]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          Order Board
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage active orders and move them through the workflow.
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2,minmax(0,1fr))",
            lg: "repeat(5,minmax(0,1fr))",
          },
          gap: 2,
        }}
      >
        {statusFlow.map((status) => (
          <Paper key={status} variant="outlined" sx={{ borderRadius: 3, p: 2, minHeight: 240 }}>
            <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  {status.replace(/_/g, " ")}
                </Typography>
                <Divider />
                <Stack spacing={1}>
                  {groupedOrders[status]?.length ? (
                    groupedOrders[status].map((order) => (
                      <Card variant="outlined" key={order.id} sx={{ p: 2 }}>
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight={600}>
                              {order.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatTime(order.createdAt)}
                            </Typography>
                          </Stack>
                          <Typography variant="body2">{order.userName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {order.itemsSummary}
                          </Typography>
                          <Typography variant="subtitle2" fontWeight={600}>
                            ${order.total.toFixed(2)}
                          </Typography>
                          <Select
                            value={order.status}
                            onChange={(event) =>
                              updateStatus(order.id, event.target.value as AdminOrderStatus)
                            }
                            fullWidth
                            size="small"
                          >
                            {statusFlow.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option.replace(/_/g, " ")}
                              </MenuItem>
                            ))}
                          </Select>
                        </Stack>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No orders in this lane.
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Paper>
        ))}
      </Box>

      <Typography variant="caption" color="text.secondary">
        Polling orders every 15 seconds. {/* TODO: replace with WebSocket / ws/orders */}
      </Typography>
    </Stack>
  );
}
