"use server";
import fetchApi from "../fetchApi";
import { GetCartResponse } from "../interfaces/cart.interface";


export async function getCartAction(): Promise<GetCartResponse & { success: boolean }> {
  const result = await fetchApi("cart", "GET", {
    includeToken: true,
  });

  if (result.status !== "Success") {
    return { success: false, items: [], totalPrice: 0, totalProducts: 0 };
  }

  return { success: true, ...result.data };
}


export async function updateCartItemAction(productId: string, quantity: number): Promise<boolean> {
  const result = await fetchApi("cart", "POST", {
    includeToken: true,
    body: { productId, quantity },
  });
  return result.status === "Success";
}