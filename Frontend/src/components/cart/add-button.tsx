"use client";
import { useState } from "react"; 
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useCart } from "./context";
import QuantityField from "./quantity-field";
import { Loader2 } from "lucide-react"; 
interface AddToCartButtonProps {
  id: string;
  title: string;
  price: number;
  image: string;
  dark?: boolean;
}

export default function AddToCartButton({ id, title, price, image, dark }: AddToCartButtonProps) {
  const { cartProducts, addCartItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();
  const { status } = useSession(); 

  async function addProduct() {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    setIsAdding(true);
    
    try {
      await addCartItem(id, { title, price, image, quantity: 1 });
    } finally {
      setIsAdding(false);
    }
  }

  if (id in cartProducts) return <QuantityField id={id} dark={dark} />;


  const isLoading = status === "loading" || isAdding;

  return (
    <Button
      className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      onClick={addProduct}
      disabled={isLoading} 
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
}