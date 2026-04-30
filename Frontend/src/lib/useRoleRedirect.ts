"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthRedirect = (redirectTo: string = "/dashboard") => {
  const { data: session, status } = useSession();
  const router = useRouter();
  

  const isSeller = (session as any)?.isSeller ?? false;

  useEffect(() => {
    if (status === "authenticated" && isSeller) {
      router.replace(redirectTo);
    }
  }, [status, isSeller, router, redirectTo]);

  return { session, status, isSeller };
};