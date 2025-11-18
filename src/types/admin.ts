export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
};

export type AdminOptionItem = {
  id: string;
  name: string;
  priceDelta: number;
  isDefault: boolean;
};

export type AdminOptionGroup = {
  id: string;
  name: string;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  options: AdminOptionItem[];
};

export type AdminMenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  imageUrl?: string;
  isHidden: boolean;
  isOutOfStock: boolean;
  isSeasonal: boolean;
  seasonStart?: string;
  seasonEnd?: string;
  tags: string[];
  optionGroups: AdminOptionGroup[];
};

export type AdminOrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PREPARATION"
  | "READY_FOR_PICKUP"
  | "COMPLETED";

export type AdminOrder = {
  id: string;
  userName: string;
  createdAt: string;
  status: AdminOrderStatus;
  total: number;
  itemsSummary: string;
};

export type AnalyticsSummary = {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
};

export type SoldItemDataPoint = {
  itemName: string;
  quantity: number;
};

export type PeakTimePoint = {
  label: string;
  count: number;
};
