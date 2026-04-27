import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useCart } from "./context";
import toast from "react-hot-toast";

export default function QuantityField({ id, dark }: { id: string; dark?: boolean }) {
  const { cartProducts, updateCartItem } = useCart();

  function deleteProduct() {
    const productName = cartProducts[id]?.title || "Item";

    updateCartItem(id, 0);

    toast(`${productName} removed from cart`, {
      icon: <Trash2Icon className="size-5 text-red-500" />,
      duration: 2000,
    });
  }
  function updateQuanitity(value: number) {
    if (value < 1) return;
    updateCartItem(id, value);
  }

  return (
    <div className="flex items-center justify-between w-full">
      <Button
        variant="destructive"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteProduct();
        }}
      >
        <Trash2Icon />
      </Button>
      <div className="flex">
        <div
          className="cursor-default"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Button
            className="bg-black"
            size="icon-sm"
            onClick={() => updateQuanitity(cartProducts[id].quantity - 1)}
            disabled={cartProducts[id].quantity <= 1}
          >
            <MinusIcon />
          </Button>
        </div>
        <input
          className={` ${dark ? "text-white" : "text-black"} w-5 text-center outline-0 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          type="number"
          min={1}
          value={cartProducts[id].quantity}
          onChange={(e) => updateQuanitity(Number(e.target.value) || 0)}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onFocus={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
        <Button
          className="bg-black"
          size="icon-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateQuanitity(cartProducts[id].quantity + 1);
          }}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
