// ─── Shared sub-types ────────────────────────────────────────────────────────

export interface OrderItem {
  productId: number;
  productTitle: string;
  quantity: number;
  pricePerUnit: number;
  product?: {
    id?: number;
    title: string | null;
    images?: string[];
  } | null;
}

export interface Address {
  firstname: string;
  lastname: string;
  city: string;
  street: string;
}

export interface Order {
  id: number;
  orderedAt: string;
  orderItems: OrderItem[];
  address: Address;
}

// ─── Dashboard Stats  (GET /api/v1/admin/stats) ───────────────────────────────
// Backend does NOT return an `orders` array on /stats.
// revenueByMonth is a Map<String, BigDecimal> → Record<string, number> in TS.
export interface AdminStats {
  totalRevenue: number;
  revenueByMonth: Record<string, number>;
  numberOfProducts: number;
  numberOfOrders: number;
  numberOfUsers: number;
  numberOfCustomers: number;
  numberOfSellers: number;
}

// ─── Orders  (GET /api/v1/admin/orders) ──────────────────────────────────────
export interface AdminOrders {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

// ─── Users  (GET /api/v1/admin/users) ────────────────────────────────────────
// Backend UserRole enum serialises as "Customer" | "Seller" | "Admin"
export type UserRole = "ROLE_CUSTOMER" | "ROLE_SELLER" | "ROLE_ADMIN";

export interface AdminUser {  
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isLocked: boolean;
}

export interface GetAllUsersResponse {
  users: AdminUser[];
}

// ─── Products  (GET /api/v1/products) ────────────────────────────────────────
export interface AdminProduct {
  id: number;
  title: string;
  price: number;
  images: string[];
  seller: string | null;
  category: string;
}

export interface AdminProductPage {
  products: AdminProduct[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}