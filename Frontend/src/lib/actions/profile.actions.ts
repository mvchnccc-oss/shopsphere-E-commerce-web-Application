"use server";
import { UpdateProfileForm, updateProfileSchema } from "@/lib/validations/profile.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { UpdateProfileResponse } from "../interfaces/profile.interface";

export async function updateProfileAction(data: UpdateProfileForm): Promise<UpdateProfileResponse> {
  const { error } = updateProfileSchema.safeParse(data);
  if (error) return { success: false, message: error.message };

  const session = await getServerSession(authOptions);
  if (!session) return { success: false, message: "Unauthorized" };
  const { token } = session;

  try {
    console.log(token);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
      }),
    });

    // TODO: Make next-auth use the new token
    const body = await response.json();
    const newToken = body.auth.token;

    return {
      success: true,
      token: newToken,
    };
  } catch (_) {
    return { success: false, message: "Server unavailable" };
  }
}
