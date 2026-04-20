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
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon, MailIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PasswordInput from "../_components/password-input";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("url") || "/";

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      // Map NextAuth generic error to a user-friendly message
      setServerError(
        result.error === "CredentialsSignin"
          ? "Invalid email or password."
          : result.error
      );
      return;
    }

    router.push(redirectUrl);
    router.refresh();
  };

  return (
    <Card className="w-full max-w-sm absolute top-[50vh] left-[50vw] -translate-1/2">
      <CardHeader className="flex flex-col items-center">
        <div className="bg-accent p-2 shadow-md rounded-lg mb-2">
          <LogInIcon className="size-10" />
        </div>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
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
          </div>

          {/* Submit inside form */}
          <CardFooter className="flex-col gap-4 px-0 pt-6">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </Button>
            <Link href="/auth/register" className="text-muted-foreground text-sm  hover:text-blue-500 duration-300">
              Create a new account instead
            </Link>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
