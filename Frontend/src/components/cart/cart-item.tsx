"use client";
import { CartProduct } from "@/lib/interfaces/cart.interface";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import QuantityField from "./quantity-field";

interface CardItemProps {
  product: CartProduct & { id: string };
  onClick?: () => void;
  dark?: boolean;
}

export default function CartItem({ product, onClick, dark }: CardItemProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link key={product.id} href={`/products/${product.id}`} onClick={onClick}>
      <div className="flex items-center gap-2w-full">
        <div>
          {imageError || !product.image ? (
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
              onError={() => setImageError(true)}
              className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1 p-2">
          <span className="text-sm line-clamp-1">{product.title}</span>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Unit <strong>EGP {product.price}</strong>
            </span>
            <span>
              Total <strong>EGP {product.quantity * product.price}</strong>
            </span>
          </div>
          <QuantityField id={product.id} dark={dark} />
        </div>
      </div>
    </Link>
  );
}
