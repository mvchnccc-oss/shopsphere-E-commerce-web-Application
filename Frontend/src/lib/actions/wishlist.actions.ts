"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { GetWishlist } from "../interfaces/wishlist.interface";

export async function getWishlistAction(): Promise<GetWishlist | null> {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const { token } = session;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function addToWishlistAction(productId: number) {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const { token } = session;

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
      }),
    });

    return true;
  } catch (e) {
    return false;
  }
}

export async function removeFromWishlistAction(productId: number) {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const { token } = session;

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (e) {
    return false;
  }
}
