"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./context";
import QuantityField from "./quantity-field";

export default function CartNavbarDropdown() {
  const [isOpen, setOpen] = useState(false);
  const { cartProducts } = useCart();

  const count = Object.keys(cartProducts).length;

  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="relative" variant="ghost" size="icon">
          <ShoppingCartIcon />
          <span className="absolute -right-1 bottom-4 text-[10px] bg-rose-500 pt-px pr-px rounded-full min-w-4">
            {count}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuGroup className="w-full">
          {count === 0 && (
            <div className="text-muted-foreground text-center italic text-sm">No products</div>
          )}
          {count !== 0 &&
            Object.entries(cartProducts).map(([id, product]) => (
              <Link key={id} href={`/products/${id}`} onClick={() => setOpen(false)}>
                <div className="flex items-center gap-2 p-2 w-full">
                  <div className="size-8">
                    <ImageIcon className="size-8" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <span className="text-sm">{product.title}</span>
                    <QuantityField id={id} dark />
                  </div>
                </div>
              </Link>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
