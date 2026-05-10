export interface AdminDashboardUser {
  id: number;
  name: string;
  email: string;
  role: "ROLE_SELLER" | "ROLE_CUSTOMER" | "ROLE_ADMIN";
  isLocked: boolean;
}

// Fetch  response (All users except the current logged-in admin)
// GET /api/v1/admin/users
export interface GetAllUsersResponse {
  users: AdminDashboardUser[];
}
