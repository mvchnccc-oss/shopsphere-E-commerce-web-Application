"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCardIcon, ImageIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./context";
import QuantityField from "./quantity-field";

export default function CartNavbarDropdown() {
  const [isOpen, setOpen] = useState(false);
  const { cartProducts } = useCart();
  const [imageError, setImageError] = useState<string[]>([]);

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
              <DropdownMenuItem>
                <Link href="/checkout" className=" w-full">
                  <Button className="flex justify-center items-center w-full gap-2">
                    <CreditCardIcon /> Checkout
                  </Button>
                </Link>
              </DropdownMenuItem>
              {Object.entries(cartProducts).map(([id, product]) => (
                <Link key={id} href={`/products/${id}`} onClick={() => setOpen(false)}>
                  <div className="flex items-center gap-2w-full">
                    <div>
                      {imageError.includes(id) || !product.image ? (
                        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
                          <ImageIcon className="size-16 text-gray-300" />
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      ) : (
                        <Image
                          src={product.image}
                          width={64}
                          height={64}
                          alt={product.title}
                          onError={() => setImageError((v) => [...v, id])}
                          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1 p-2">
                      <span className="text-sm">{product.title}</span>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>
                          Unit <strong>EGP {product.price}</strong>
                        </span>
                        <span>
                          Total <strong>EGP {product.quantity * product.price}</strong>
                        </span>
                      </div>
                      <QuantityField id={id} dark />
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
