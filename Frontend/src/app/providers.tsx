"use client";

import CartProvider from "@/components/cart/provider";
import { ThemeProvider } from "@/components/theme-provider";
import WishlistProvider from "@/components/wishlist/provider";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
