"use server";
import fetchApi from "../fetchApi";
import { Product } from "../interfaces/products.interface";


export interface SellerProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;        
  categoryId?: number;
  images: string[];
}

export interface CreateProductPayload {
  title: string;
  description: string;
  price: number;
  category: string;        
  images: string[];
}

export type SellerActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function getSellerProductsAction(): Promise<SellerActionResult<SellerProduct[]>> {
  const result = await fetchApi("products?size=100", "GET", { includeToken: false });

  if (result.status !== "Success") {
    return { success: false, message: "Failed to load products" };
  }

  const meResult = await fetchApi("auth/me", "GET", { includeToken: true });
  const currentUserEmail = meResult.status === "Success" ? meResult.data.email : null;

  const allProducts: Product[] = result.data.products ?? [];


  const myProducts = currentUserEmail
    ? allProducts.filter((p: Product) => p.seller === currentUserEmail)
    : allProducts;

  return {
    success: true,
    data: myProducts.map((p: Product) => ({
      id: Number(p.id),
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category?.name ?? "",
      categoryId: p.category?.id,
      images: p.images ?? [],
    })),
  };
}


export async function createProductAction(
  payload: CreateProductPayload
): Promise<SellerActionResult> {
  const result = await fetchApi("products", "POST", {
    includeToken: true,
    body: {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      images: payload.images,
    },
  });

  if (result.status === "Success") return { success: true, data: null };
  return {
    success: false,
    message: result.status === "Unauthorized" ? "Unauthorized" : "Failed to create product",
  };
}

// ── Update product ───────────────────────────────────────
export async function updateProductAction(
  id: number,
  payload: CreateProductPayload
): Promise<SellerActionResult> {
  const result = await fetchApi(`products/${id}`, "POST", {
    includeToken: true,
    body: {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      images: payload.images,
    },
  });

  if (result.status === "Success") return { success: true, data: null };
  return {
    success: false,
    message: result.status === "Unauthorized" ? "Unauthorized" : "Failed to update product",
  };
}

// ── Delete product ───────────────────────────────────────
export async function deleteProductAction(id: number): Promise<SellerActionResult> {
  const result = await fetchApi(`products/${id}`, "DELETE", { includeToken: true });

  if (result.status === "Success") return { success: true, data: null };
  return {
    success: false,
    message: result.status === "Unauthorized" ? "Unauthorized" : "Failed to delete product",
  };
}

// ── Dashboard stats (من الـ orders + products) ───────────
export interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
}

export interface RecentOrder {
  id: number;
  orderedAt: string;
  totalAmount: number;
  itemCount: number;
  address: string;
}

export async function getSellerStatsAction(): Promise<SellerActionResult<SellerStats>> {
  const [productsResult, ordersResult] = await Promise.all([
    getSellerProductsAction(),
    fetchApi("orders", "GET", { includeToken: true }),
  ]);

  const totalProducts = productsResult.success ? productsResult.data.length : 0;

  if (ordersResult.status !== "Success") {
    return {
      success: true,
      data: { totalProducts, totalOrders: 0, totalRevenue: 0, recentOrders: [] },
    };
  }

  const orders = ordersResult.data.orders ?? [];
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum: number, order: any) => {
    const orderTotal = (order.orderItems ?? []).reduce(
      (s: number, item: any) => s + item.pricePerUnit * item.quantity,
      0
    );
    return sum + orderTotal;
  }, 0);

  const recentOrders: RecentOrder[] = orders.slice(0, 5).map((order: any) => ({
    id: order.id,
    orderedAt: order.orderedAt,
    totalAmount: (order.orderItems ?? []).reduce(
      (s: number, item: any) => s + item.pricePerUnit * item.quantity,
      0
    ),
    itemCount: (order.orderItems ?? []).reduce((s: number, item: any) => s + item.quantity, 0),
    address: order.address
      ? `${order.address.city ?? ""}`
      : "",
  }));

  return {
    success: true,
    data: { totalProducts, totalOrders, totalRevenue, recentOrders },
  };
}
