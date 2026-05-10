export interface AdminDashboardUser {
  id: number;
  name: string;
  email: string;
  role: "ROLE_SELLER" | "ROLE_CUSTOMER" | "ROLE_ADMIN";
  isLocked: boolean;
}
// This file is kept for backwards compatibility.
// All types are now consolidated in admin.interface.ts
export type { AdminUser, AdminProduct, AdminStats, AdminOrders, Order, OrderItem, Address, UserRole, GetAllUsersResponse } from "./admin.interface";
// Fetch  response (All users except the current logged-in admin)
// GET /api/v1/admin/users
export interface GetAllUsersResponse {
  users: AdminDashboardUser[];
}
