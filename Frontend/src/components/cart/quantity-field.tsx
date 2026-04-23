import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useCart } from "./context";

export default function QuantityField({ id, dark }: { id: string; dark?: boolean }) {
  const { cartProducts, updateCart } = useCart();

  function deleteProduct() {
    updateCart((cart) => {
      const copy = { ...cart };
      delete copy[id];

      return copy;
    });
  }

  function updateQuanitity(value: number) {
    if (value < 1) return;

    const product = cartProducts[id];
    updateCart((cart) => ({ ...cart, [id]: { ...product, quantity: value } }));
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
