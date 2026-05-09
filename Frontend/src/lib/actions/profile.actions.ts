"use server";
import { UpdateProfileForm, updateProfileSchema } from "@/lib/validations/profile.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import fetchApi from "../fetchApi";
import { BecomeSellerResponse, UpdateProfileResponse } from "../interfaces/profile.interface";

export async function updateProfileAction(data: UpdateProfileForm): Promise<UpdateProfileResponse> {
  const { error } = updateProfileSchema.safeParse(data);
  if (error) return { success: false, message: error.message };

  const result = await fetchApi("auth/me", "POST", {
    includeToken: true,
    body: {
      name: data.name,
      email: data.email,
    },
  });

  if (result.status === "Success") {
    return {
      success: true,
      token: result.data.auth.token,
    };
  }

  return {
    success: false,
    message: result.status === "Unauthorized" ? "Unauthorized" : "Server unavailable",
  };
}

export async function becomeSellerAction(): Promise<BecomeSellerResponse> {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, message: "Unauthorized" };


  const meResult = await fetchApi("auth/me", "GET", { includeToken: true });
  if (meResult.status !== "Success") {
    return { success: false, message: "Could not fetch user data" };
  }

  const name: string = meResult.data.name || session.user.name || session.user.email?.split("@")[0] || "User";
  const email: string = meResult.data.email || session.user.email;

  const result = await fetchApi("auth/me", "POST", {
    includeToken: true,
    body: { name, email, role: "ROLE_SELLER" },
  });

  console.log(result)

  if (result.status === "Success") {
    return {
      success: true,
      token: result.data.auth.token,
      role: result.data.user?.role ?? "ROLE_SELLER",
      accessTokenExpires: Date.now() + result.data.auth.expiresAt,
    };
  }

  return {
    success: false,
    message: result.status === "Unauthorized" ? "Unauthorized" : "Server unavailable",
  };
}
