"use server";
import { UpdateProfileForm, updateProfileSchema } from "@/lib/validations/profile.schema";
import fetchApi from "../fetchApi";
import { UpdateProfileResponse } from "../interfaces/profile.interface";

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
    message: result.status === "Unauthorized" ? "Unauthorized" : "Server unavailable" 
  };
}