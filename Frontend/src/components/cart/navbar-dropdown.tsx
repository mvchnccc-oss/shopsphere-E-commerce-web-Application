"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCardIcon, ShoppingCart, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CartItem from "./cart-item";
import { useCart } from "./context";

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
          {count !== 0 && (
            <>
              <div className="flex p-1.5 gap-2">
                <Link href="/checkout" className="w-full">
                  <Button
                    className="flex justify-center items-center w-full gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <CreditCardIcon /> Checkout
                  </Button>
                </Link>
                <Link href="/cart" className="w-full">
                  <Button
                    variant="secondary"
                    className="flex justify-center items-center w-full gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <ShoppingCart /> Cart
                  </Button>
                </Link>
              </div>
              <DropdownMenuSeparator />
              {Object.entries(cartProducts).map(([id, product]) => (
                <CartItem
                  key={id}
                  product={{ ...product, id }}
                  onClick={() => setOpen(false)}
                  dark
                />
              ))}
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
