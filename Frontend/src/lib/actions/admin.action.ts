"use server";

import fetchApi from "../fetchApi";
import { revalidatePath } from "next/cache";
import type {
  AdminStats,
  AdminOrders,
  AdminUser,
  AdminProduct,
  AdminProductPage,
  GetAllUsersResponse,
} from "../interfaces/admin.interface";

// Re-export types so pages/components can import them from here
export type { AdminProduct, AdminProductPage, AdminUser, AdminStats, AdminOrders } from "../interfaces/admin.interface";

// ─── Helper ──────────────────────────────────────────────────────────────────

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Stats ───────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/stats
 */
export async function getAdminStatsAction(): Promise<ActionResult<AdminStats>> {
  const result = await fetchApi("admin/stats", "GET", {
    includeToken: true,
    cache: "no-store",
  });

  if (result.status === "Success" && result.data) {
    return { success: true, data: result.data as AdminStats };
  }

  const errorMap: Record<string, string> = {
    Unauthorized: "You are not authorised to view admin stats.",
    ServerNotFound: "Cannot reach the server. Please check your connection.",
    BadRequest: "Bad request when fetching stats.",
    Unknown: "An unexpected error occurred while fetching stats.",
  };

  return {
    success: false,
    error: errorMap[result.status] ?? "Failed to fetch admin stats.",
  };
}

// ─── Orders ──────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/orders?page=&size=
 */
export async function getAdminOrdersAction(
  page: number = 0,
  size: number = 10
): Promise<ActionResult<AdminOrders>> {
  const result = await fetchApi(`admin/orders?page=${page}&size=${size}`, "GET", {
    includeToken: true,
    cache: "no-store",
  });

  if (result.status === "Success" && result.data) {
    return { success: true, data: result.data as AdminOrders };
  }

  const errorMap: Record<string, string> = {
    Unauthorized: "You are not authorised to view orders.",
    ServerNotFound: "Cannot reach the server. Please check your connection.",
    BadRequest: "Bad request when fetching orders.",
    Unknown: "An unexpected error occurred while fetching orders.",
  };

  return {
    success: false,
    error: errorMap[result.status] ?? "Failed to fetch orders.",
  };
}

// ─── Users ────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/users
 */
export async function getAdminUsersAction(): Promise<ActionResult<AdminUser[]>> {
  const result = await fetchApi("admin/users", "GET", {
    includeToken: true,
    cache: "no-store",
  });

  if (result.status === "Success" && result.data) {
    const response = result.data as GetAllUsersResponse;
    return { success: true, data: response.users ?? [] };
  }

  const errorMap: Record<string, string> = {
    Unauthorized: "You are not authorised to view users.",
    ServerNotFound: "Cannot reach the server. Please check your connection.",
    BadRequest: "Bad request when fetching users.",
    Unknown: "An unexpected error occurred while fetching users.",
  };

  return {
    success: false,
    error: errorMap[result.status] ?? "Failed to fetch users.",
  };
}

/**
 * POST /api/v1/admin/users/lock
 */
export async function lockAdminUserAction(
  userId: number,
  lock: boolean
): Promise<ActionResult<null>> {
  const result = await fetchApi("admin/users/lock", "POST", {
    includeToken: true,
    body: { userId, lock },
  });

  if (result.status === "Success") {
    revalidatePath("/admin/users");
    return { success: true, data: null };
  }

  const errorMap: Record<string, string> = {
    Unauthorized: "You are not authorised to lock/unlock users.",
    ServerNotFound: "Cannot reach the server. Please check your connection.",
    BadRequest: "Invalid request. Check the user ID and lock value.",
    Unknown: "An unexpected error occurred.",
  };

  return {
    success: false,
    error: errorMap[result.status] ?? "Failed to update user lock status.",
  };
}

// ─── Products ─────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/products?page=0&size=200
 */
export async function getAdminProductsAction(
  page: number = 0,
  size: number = 200
): Promise<ActionResult<AdminProductPage>> {
  const result = await fetchApi(`products?page=${page}&size=${size}`, "GET", {
    includeToken: true,
    cache: "no-store",
  });

  if (result.status === "Success" && result.data) {
    const data: any = result.data;
    const raw: any[] = data.products ?? [];
    const products: AdminProduct[] = raw.map((p) => ({
      id: p.id,
      title: p.title,
      price: typeof p.price === "number" ? p.price : Number(p.price),
      images: Array.isArray(p.images) ? p.images : [],
      seller: p.seller ?? null,
      category: p.category?.name ?? "—",
    }));

    return {
      success: true,
      data: {
        products,
        currentPage: data.currentPage ?? page,
        totalPages: data.totalPages ?? 0,
        totalElements: data.totalElements ?? products.length,
        pageSize: data.pageSize ?? size,
      },
    };
  }

  const errorMap: Record<string, string> = {
    Unauthorized: "You are not authorised to view products.",
    ServerNotFound: "Cannot reach the server. Please check your connection.",
    BadRequest: "Bad request when fetching products.",
    Unknown: "An unexpected error occurred while fetching products.",
  };

  return {
    success: false,
    error: errorMap[result.status] ?? "Failed to fetch products.",
  };
}

/**
 * DELETE /api/v1/products/{id}
 */
export async function deleteAdminProductAction(
  productId: number
): Promise<ActionResult<null>> {
  const result = await fetchApi(`products/${productId}`, "DELETE", {
    includeToken: true,
  });

  if (result.status === "Success") {
    revalidatePath("/admin/products");
    return { success: true, data: null };
  }

  const errorMap: Record<string, string> = {
    Unauthorized: "You are not authorised to delete products.",
    ServerNotFound: "Cannot reach the server. Please check your connection.",
    BadRequest: "Product not found or invalid ID.",
    Unknown: "An unexpected error occurred.",
  };

  return {
    success: false,
    error: errorMap[result.status] ?? "Failed to delete product.",
  };
}