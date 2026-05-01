"use server";
import fetchApi from "../fetchApi";

// ── Interfaces ────────────────────────────────────────────

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  isSeller: boolean;
  createdAt?: string;
}

export interface AdminProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  seller?: string;
}

export interface AdminOrder {
  id: number;
  orderedAt: string;
  totalAmount: number;
  itemCount: number;
  customerName: string;
  city: string;
  orderItems: {
    productTitle: string;
    quantity: number;
    pricePerUnit: number;
  }[];
}

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: AdminOrder[];
}

export type AdminResult<T = null> =
  | { success: true; data: T }
  | { success: false; message: string };

// ── Stats ─────────────────────────────────────────────────

export async function getAdminStatsAction(): Promise<AdminResult<AdminStats>> {
  const [usersRes, productsRes, ordersRes] = await Promise.all([
    fetchApi("admin/users", "GET", { includeToken: true }),
    fetchApi("admin/products", "GET", { includeToken: true }),
    fetchApi("admin/orders", "GET", { includeToken: true }),
  ]);

  const users: any[] = usersRes.status === "Success" ? (usersRes.data?.users ?? usersRes.data ?? []) : [];
  const products: any[] = productsRes.status === "Success" ? (productsRes.data?.products ?? productsRes.data ?? []) : [];
  const orders: any[] = ordersRes.status === "Success" ? (ordersRes.data?.orders ?? ordersRes.data ?? []) : [];

  const sellers = users.filter((u) => u.isSeller);
  const customers = users.filter((u) => !u.isSeller);

  const totalRevenue = orders.reduce((sum: number, order: any) => {
    return sum + (order.orderItems ?? []).reduce(
      (s: number, item: any) => s + item.pricePerUnit * item.quantity, 0
    );
  }, 0);

  const recentOrders: AdminOrder[] = orders.slice(0, 8).map((order: any) => ({
    id: order.id,
    orderedAt: order.orderedAt,
    totalAmount: (order.orderItems ?? []).reduce(
      (s: number, item: any) => s + item.pricePerUnit * item.quantity, 0
    ),
    itemCount: (order.orderItems ?? []).reduce(
      (s: number, item: any) => s + item.quantity, 0
    ),
    customerName: order.firstname ? `${order.firstname} ${order.lastname ?? ""}`.trim() : "—",
    city: order.address?.city ?? order.city ?? "—",
    orderItems: (order.orderItems ?? []).map((item: any) => ({
      productTitle: item.productTitle,
      quantity: item.quantity,
      pricePerUnit: item.pricePerUnit,
    })),
  }));

  return {
    success: true,
    data: {
      totalUsers: users.length,
      totalSellers: sellers.length,
      totalCustomers: customers.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      recentOrders,
    },
  };
}

// ── Users ─────────────────────────────────────────────────

export async function getAdminUsersAction(): Promise<AdminResult<AdminUser[]>> {
  const res = await fetchApi("admin/users", "GET", { includeToken: true });
  if (res.status !== "Success") return { success: false, message: "Failed to load users" };

  const raw: any[] = res.data?.users ?? res.data ?? [];
  return {
    success: true,
    data: raw.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isSeller: u.isSeller ?? false,
      createdAt: u.createdAt,
    })),
  };
}

export async function deleteAdminUserAction(id: number): Promise<AdminResult> {
  const res = await fetchApi(`admin/users/${id}`, "DELETE", { includeToken: true });
  if (res.status === "Success") return { success: true, data: null };
  return { success: false, message: "Failed to delete user" };
}

// ── Products ──────────────────────────────────────────────

export async function getAdminProductsAction(): Promise<AdminResult<AdminProduct[]>> {
  const res = await fetchApi("admin/products", "GET", { includeToken: true });
  if (res.status !== "Success") return { success: false, message: "Failed to load products" };

  const raw: any[] = res.data?.products ?? res.data ?? [];
  return {
    success: true,
    data: raw.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category?.name ?? p.category ?? "—",
      images: p.images ?? [],
      seller: p.seller ?? "—",
    })),
  };
}

export async function deleteAdminProductAction(id: number): Promise<AdminResult> {
  const res = await fetchApi(`admin/products/${id}`, "DELETE", { includeToken: true });
  if (res.status === "Success") return { success: true, data: null };
  return { success: false, message: "Failed to delete product" };
}

// ── Orders ────────────────────────────────────────────────

export async function getAdminOrdersAction(): Promise<AdminResult<AdminOrder[]>> {
  const res = await fetchApi("admin/orders", "GET", { includeToken: true });
  if (res.status !== "Success") return { success: false, message: "Failed to load orders" };

  const raw: any[] = res.data?.orders ?? res.data ?? [];
  return {
    success: true,
    data: raw.map((order: any) => ({
      id: order.id,
      orderedAt: order.orderedAt,
      totalAmount: (order.orderItems ?? []).reduce(
        (s: number, item: any) => s + item.pricePerUnit * item.quantity, 0
      ),
      itemCount: (order.orderItems ?? []).reduce(
        (s: number, item: any) => s + item.quantity, 0
      ),
      customerName: order.firstname ? `${order.firstname} ${order.lastname ?? ""}`.trim() : "—",
      city: order.address?.city ?? order.city ?? "—",
      orderItems: (order.orderItems ?? []).map((item: any) => ({
        productTitle: item.productTitle,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
      })),
    })),
  };
}