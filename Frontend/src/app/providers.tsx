"use client";

import CartProvider from "@/components/cart/provider";
import { ThemeProvider } from "@/components/theme-provider";
import WishlistProvider from "@/components/wishlist/provider";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { Toaster } from "sonner";

function SessionChecker() {
  const { data: session } = useSession();
  useEffect(() => {
    if ((session as any)?.error === "AccessTokenError") {
      signOut({ callbackUrl: "/auth/login" });
    }
  }, [session]);
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
