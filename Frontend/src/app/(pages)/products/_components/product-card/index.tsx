"use client";
import AddToCartButton from "@/components/cart/add-button";
import type { Product } from "@/lib/interfaces/products.interface";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ product: prod }: { product: Product }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
        <Link href={`/products/${prod.id}`}>
          <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
            {imageError || !prod.images[0] ? (
              <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs text-gray-500">No Image</span>
              </div>
            ) : (
              <Image
                src={prod.images[0]}
                width={300}
                height={300}
                alt={prod.title}
                onError={handleImageError}
                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>

          <div className="flex flex-1 flex-col p-3">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">{prod.title}</h3>
            <span className="text-[10px] font-medium text-gray-400 uppercase">
              {prod.brand?.name}
            </span>

            {/* the cost */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-emerald-600">EGP {prod.price}</span>
              </div>
            </div>
          </div>
        </Link>
        <div className="w-full mt-auto px-3 pb-3 flex items-center gap-2">
          <AddToCartButton
            id={prod.id}
            title={prod.title}
            price={prod.price}
            image={prod.images[0]}
          />
        </div>
      </div>
    </>
  );
}
