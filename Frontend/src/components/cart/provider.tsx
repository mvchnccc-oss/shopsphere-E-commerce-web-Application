"use client";
import { getCartAction, updateCartItemAction, clearCartAction } from "@/lib/actions/cart.actions";
import { CartProduct } from "@/lib/interfaces/cart.interface";
import { ReactNode, useEffect, useState } from "react";
import { CartContext } from "./context";

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartProducts, setCartProducts] = useState<Record<string, CartProduct>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCartAction().then((cart) => {
      if (!cart.success) {
        setError(cart.message ?? "Failed to load cart");
        setIsLoading(false);
        return;
      }

      const products = cart.items.map(({ product: { id, title, price, images }, quantity }: any) => ({
        id,
        title,
        image: images[0],
        quantity,
        price,
      }));

      const cartProduct = products.reduce<Record<string, CartProduct>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      setCartProducts(cartProduct);
      setIsLoading(false);
    });
  }, []);

  async function updateCartItem(id: string, quantity: number) {
    const success = await updateCartItemAction(id, quantity);
    if (!success) return;

    if (quantity === 0) {
      setCartProducts((cart) => {
        const copy = { ...cart };
        delete copy[id];
        return copy;
      });
    } else {
      const product = cartProducts[id];
      setCartProducts((cart) => ({ ...cart, [id]: { ...product, quantity } }));
    }
  }

  async function addCartItem(id: string, data: CartProduct) {
    const success = await updateCartItemAction(id, data.quantity);
    if (!success) return;
    setCartProducts((cart) => ({ ...cart, [id]: { ...data } }));
  }

  async function clearCart() {
    const res = await clearCartAction(); 

    if (res.success) {
      setCartProducts({}); 
    } else {
      console.error(res.message);
    }
  }

  return (
    <CartContext.Provider value={{ cartProducts, updateCartItem, addCartItem, clearCart, isLoading, error }}>
      {children}
    </CartContext.Provider>
  );
}