"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { registerAction, type ActionResult } from "@/actions/auth.actions";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, UserIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PasswordInput from "../_components/password-input";
import { div } from "framer-motion/client";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setSuccessMsg(null);

    const result = await registerAction(data);

    if (!result.success) {
      setServerError(result.message || "An unexpected error occurred.");
      return;
    }

    setSuccessMsg(result.message || "Account created successfully!");
    // Redirect to login after short delay
    setTimeout(() => router.push("/auth/login"), 1500);
  };

  return (
    
    <Card className="w-full max-w-sm mx-auto my-5">
      <CardHeader className="flex flex-col items-center">
        <div className="bg-accent p-2 shadow-md rounded-lg mb-2">
          <UserPlusIcon className="size-10" />
        </div>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-6">
            {/* Server Error */}
            {serverError && (
              <p className="text-sm text-destructive text-center bg-destructive/10 py-2 px-3 rounded-md">
                {serverError}
              </p>
            )}

            {/* Success */}
            {successMsg && (
              <p className="text-sm text-green-600 text-center bg-green-50 py-2 px-3 rounded-md">
                {successMsg}
              </p>
            )}

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <UserIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id="name"
                  type="text"
                  placeholder="Your name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
              </InputGroup>
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <MailIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
              </InputGroup>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <PasswordInput
              registration={register("password")}
              error={errors.password?.message}
            />

            {/* Confirm Password */}
            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              registration={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>

          <CardFooter className="flex-col gap-4 px-0 pt-6">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Register"}
            </Button>
            <Link href="/auth/login" className="text-muted-foreground text-sm hover:text-blue-500 duration-300">
              Login into your account instead
            </Link>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
