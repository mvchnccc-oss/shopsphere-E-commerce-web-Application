"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
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
  const session = await getServerSession(authOptions);
  if (!session) return false;
  const { token } = session;

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId, quantity }),
    });

    return true;
  } catch (error) {
    return false;
  }
}
