"use client";
import { getCartAction, updateCartItemAction } from "@/lib/actions/cart.actions";
import { CartProduct } from "@/lib/interfaces/cart.interface";
import { ReactNode, useEffect, useState } from "react";
import { CartContext } from "./context";

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartProducts, setCartProducts] = useState<Record<string, CartProduct>>({});

  useEffect(() => {
    getCartAction().then((cart) => {
      const products = cart.items.map(({ product: { id, title, price, images }, quantity }) => ({
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
    setCartProducts({});
    try {
      const productIds = Object.keys(cartProducts);
      await Promise.all(productIds.map((id) => updateCartItemAction(id, 0)));
    } catch (error) {
      console.error("Failed to clear backend cart:", error);
    }
  }
  return (
    <CartContext value={{ cartProducts, updateCartItem, addCartItem, clearCart }}>
      {children}
    </CartContext>
  );
}
