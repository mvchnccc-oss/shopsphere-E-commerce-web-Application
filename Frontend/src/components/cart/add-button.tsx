"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useCart } from "./context";
import QuantityField from "./quantity-field";
import { AlertCircle, Loader2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

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
  const pathname = usePathname();
  const { status, data } = useSession();

  async function addProduct() {
    if (status === "loading") return;

    if (
      status === "unauthenticated" ||
      (status === "authenticated" && (data as any)?.error === "AccessTokenError")
    ) {
      router.push(`/auth/login?url=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsAdding(true);
    try {
      const success = await addCartItem(id, { title, price, image, quantity: 1 });
      if (success) {
        toast.success(`${title} added to cart!`, {
          icon: <ShoppingCart className="h-5 w-5 text-emerald-600" />,
        });
      } else {
        toast.error("Failed to add to cart. Try again.", {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
      }
    } catch {
      toast.error("Failed to add to cart. Try again.", {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
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