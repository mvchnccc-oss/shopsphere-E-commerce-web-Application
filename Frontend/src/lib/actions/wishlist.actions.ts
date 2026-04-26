"use server";
import fetchApi from "../fetchApi";
import { GetWishlist } from "../interfaces/wishlist.interface";

export async function getWishlistAction(): Promise<GetWishlist | null> {
  const result = await fetchApi("wishlist", "GET", {
    includeToken: true,
  });

  if (result.status === "Success") {
    return result.data;
  }

  return null;
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