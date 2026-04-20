"use server";

import { registerSchema, type RegisterFormData } from "@/lib/validations/auth.schema";
export type ActionResult<T = null> =
  | { success: true; data: T; message?: string }
  | { success: false; errors?: Partial<Record<string, string[]>>; message?: string };

export async function registerAction(
  formData: RegisterFormData
): Promise<ActionResult> {
  // Validate input against schema
  const parsed = registerSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Partial<Record<string, string[]>>,
    };
  }

  const { name, email, password } = parsed.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      }
    );

    const payload = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: payload?.message || "Registration failed. Please try again.",
      };
    }

    return { success: true, data: null, message: "Account created successfully!" };
  } catch {
    // Network or server unreachable
    return {
      success: false,
      message: "Unable to reach the server. Please try again later.",
    };
  }
}
