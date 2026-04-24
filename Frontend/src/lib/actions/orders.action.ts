"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function getOrdersAction() {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false };
  const { token } = session;
  

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const body = await res.json();

    if (!res.ok) return { success: false, ...body };

    return { ...body, success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function PostOrdersAction() {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false };
  const { token } = session;
  

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) return { success: false };

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
