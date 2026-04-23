"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useCart } from "./context";
import QuantityField from "./quantity-field";

interface AddToCartButtonProps {
  id: string;
  title: string;
  price: number;
  dark?: boolean;
}

export default function AddToCartButton({ id, title, price, dark }: AddToCartButtonProps) {
  const { cartProducts, updateCart } = useCart();
  const router = useRouter();
  const session = useSession();

  function addProduct() {
    if (session.status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    updateCart((cart) => ({ ...cart, [id]: { title, price, quantity: 1 } }));
  }

  if (id in cartProducts) return <QuantityField id={id} dark={dark} />;

  return (
    <Button
      className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
      onClick={addProduct}
    >
      Add to Cart
    </Button>
  );
}
