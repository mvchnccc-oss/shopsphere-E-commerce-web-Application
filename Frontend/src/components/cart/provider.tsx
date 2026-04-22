"use client";
import { CartProduct } from "@/lib/interfaces/cart.interface";
import { ReactNode, useState } from "react";
import { CartContext } from "./context";

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartProducts, setCartProducts] = useState<Record<string, CartProduct>>({});

  return (
    <CartContext value={{ cartProducts, updateCart: setCartProducts }}>{children}</CartContext>
  );
}
