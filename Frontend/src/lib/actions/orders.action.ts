import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function getOrdersAction() {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false };
  const { token } = session;
  console.log(token);

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
