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

  const { name, email } = meResult.data;

  
  const result = await fetchApi("auth/me", "POST", {
    includeToken: true,
    body: {
      name,
      email,
      isSeller: true,
    },
  });

  console.log(result)

  if (result.status === "Success") {
    return {
      success: true,
      token: result.data.auth.token,
      isSeller: result.data.user?.isSeller ?? true,
    };
  }

  return {
    success: false,
    message: result.status === "Unauthorized" ? "Unauthorized" : "Server unavailable",
  };
}
