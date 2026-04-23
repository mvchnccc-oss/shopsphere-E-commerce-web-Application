import { CartProduct } from "@/lib/interfaces/cart.interface";
import { createContext, useContext } from "react";

interface ICartContext {
  cartProducts: Record<string, CartProduct>;
  updateCartItem: (id: string, quantity: number) => void;
}

export const CartContext = createContext<ICartContext | null>(null);
export const useCart = () => useContext(CartContext)!;
