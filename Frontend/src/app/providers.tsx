"use client";

import CartProvider from "@/components/cart/provider";
import { ThemeProvider } from "@/components/theme-provider";
import WishlistProvider from "@/components/wishlist/provider";
import { checkSessionAction } from "@/lib/actions/auth.actions";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { Toaster } from "sonner";

function SessionChecker() {
  const { data: session } = useSession();

  // Token expired
  useEffect(() => {
    if ((session as any)?.error === "AccessTokenError") {
      signOut({ callbackUrl: "/auth/login" });
    }
  }, [session]);

  // Account locked 
  useEffect(() => {
    if (!session?.token) return;

    const check = async () => {
      const { valid } = await checkSessionAction();
      if (!valid) signOut({ callbackUrl: "/auth/login" });
    };

    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [session?.token]);

  return null;
}
export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <SessionChecker />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <CartProvider>
          <WishlistProvider>
            {children}
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
