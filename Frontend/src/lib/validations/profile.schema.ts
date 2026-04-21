import z from "zod";
import { registerSchema } from "./auth.schema";

export const updateProfileSchema = z.object(registerSchema.shape).pick({ name: true, email: true });
export type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
