"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "./context";

export default function CartNavbarDropdown() {
  const { cartProducts } = useCart();

  const count = Object.keys(cartProducts).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative" variant="ghost" size="icon">
          <ShoppingCartIcon />
          <span className="absolute -right-1 bottom-4 text-[10px] bg-rose-500 pt-px pr-px rounded-full min-w-4">
            {count}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent></DropdownMenuContent>
    </DropdownMenu>
  );
}
