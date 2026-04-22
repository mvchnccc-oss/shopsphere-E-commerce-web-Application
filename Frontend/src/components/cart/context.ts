import { CartProduct } from "@/lib/interfaces/cart.interface";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface ICartContext {
  cartProducts: Record<string, CartProduct>;
  updateCart: Dispatch<SetStateAction<Record<string, CartProduct>>>;
}

export const CartContext = createContext<ICartContext | null>(null);
export const useCart = () => useContext(CartContext)!;
