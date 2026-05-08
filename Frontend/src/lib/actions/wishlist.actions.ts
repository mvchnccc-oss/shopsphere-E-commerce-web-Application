"use server";
import fetchApi from "../fetchApi";
import { GetWishlist } from "../interfaces/wishlist.interface";

export type GetWishlistActionResult =
  | { success: true; products: number[] }
  | { success: false; products: number[]; message?: string };

export async function getWishlistAction(): Promise<GetWishlistActionResult> {
  const result = await fetchApi("wishlist", "GET", {
    includeToken: true,
  });

  if (result.status === "Success") {
    return { success: true, products: result.data?.products ?? [] };
  }

  return { success: false, products: [], message: result.message ?? "Failed to load wishlist" };
}

export async function addToWishlistAction(productId: number) {
  const result = await fetchApi("wishlist", "POST", {
    includeToken: true,
    body: { productId },
  });

  return result.status === "Success";
}

export async function removeFromWishlistAction(productId: number) {
  const result = await fetchApi(`wishlist/${productId}`, "DELETE", {
    includeToken: true,
  });

  return result.status === "Success";
}