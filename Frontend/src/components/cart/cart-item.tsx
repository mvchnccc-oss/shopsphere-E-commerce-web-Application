"use client";
import { CartProduct } from "@/lib/interfaces/cart.interface";
import Link from "next/link";
import LoadingImage from "../loading-image";
import QuantityField from "./quantity-field";

interface CardItemProps {
  product: CartProduct & { id: string };
  onClick?: () => void;
  dark?: boolean;
}

export default function CartItem({ product, onClick, dark }: CardItemProps) {
  return (
    <Link key={product.id} href={`/products/${product.id}`} onClick={onClick}>
      <div className="flex items-center gap-2">
        <div className="flex-none w-16 h-16">
          <LoadingImage
            src={product.image}
            width={64}
            height={64}
            alt={product.title}
            className="object-contain w-full transition-transform duration-300 group-hover:scale-105"
          />
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
