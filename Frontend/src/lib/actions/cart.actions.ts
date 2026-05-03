"use server";
import fetchApi from "../fetchApi";
import { GetCartResponse } from "../interfaces/cart.interface";

export type GetCartActionResult = GetCartResponse & { success: boolean; message?: string };

export async function getCartAction(): Promise<GetCartActionResult> {
  const result = await fetchApi("cart", "GET", {
    includeToken: true,
  });

  if (result.status !== "Success") {
    return { success: false, items: [], message: result.message ?? "Failed to load cart" };
  }

  return { success: true, ...result.data };
}

export async function updateCartItemAction(productId: string, quantity: number): Promise<boolean> {
  const result = await fetchApi("cart", "POST", {
    includeToken: true,
    body: { productId: Number(productId), quantity },
  });

  return result.status === "Success";
}

export async function clearCartAction() {
  const result = await fetchApi("cart", "DELETE", {
    includeToken: true,
  });

  if (result.status === "Success") {
    return { success: true };
  }

  return {
    success: false,
    message: result.status === "Unauthorized" ? "Session expired" : "Failed to clear cart"
  };
}
