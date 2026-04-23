"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { GetCartResponse } from "../interfaces/cart.interface";

export async function getCartAction(): Promise<GetCartResponse & { success: boolean }> {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, items: [], totalPrice: 0, totalProducts: 0 };

  const { token } = session;

  try {
    const body = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cart`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    }).then((data) => data.json());

    return { ...body, success: true };
  } catch (error) {
    return { success: false, items: [], totalPrice: 0, totalProducts: 0 };
  }
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
