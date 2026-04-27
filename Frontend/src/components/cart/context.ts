import { CartProduct } from "@/lib/interfaces/cart.interface";
import { createContext, useContext } from "react";

interface ICartContext {
  cartProducts: Record<string, CartProduct>;
  updateCartItem: (id: string, quantity: number) => Promise<boolean>;
  addCartItem: (id: string, data: CartProduct) => Promise<boolean>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<ICartContext | null>(null);
export const useCart = () => useContext(CartContext)!;
