"use client";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useCart } from "./context";

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

  function deleteProduct() {
    updateCart((cart) => {
      const copy = { ...cart };
      delete copy[id];

      return copy;
    });
  }

  function updateQuanitity(value: number) {
    updateCart((cart) => ({ ...cart, [id]: { title, price, quantity: value } }));
  }

  if (id in cartProducts) {
    return (
      <div className="flex items-center justify-between w-full">
        <Button variant="destructive" size="icon" onClick={deleteProduct}>
          <Trash2Icon />
        </Button>
        <div className="flex">
          <Button
            className="bg-black"
            size="icon-sm"
            onClick={() => updateQuanitity(cartProducts[id].quantity - 1)}
            disabled={cartProducts[id].quantity === 1}
          >
            <MinusIcon />
          </Button>
          <input
            className={` ${dark ? "text-white" : "text-black"} w-5 text-center outline-0 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            type="number"
            min={1}
            value={cartProducts[id].quantity}
            onChange={(e) => updateQuanitity(Number(e.target.value) || 0)}
          />
          <Button
            className="bg-black"
            size="icon-sm"
            onClick={() => updateQuanitity(cartProducts[id].quantity + 1)}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
      onClick={addProduct}
    >
      Add to Cart
    </Button>
  );
}
