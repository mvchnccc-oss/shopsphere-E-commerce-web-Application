"use client";
import { getProductById } from "@/lib/actions/products.actions";
import { Product } from "@/lib/interfaces/products.interface";
import { useWishlist } from "@/components/wishlist/context";
import { useEffect, useState, useRef } from "react";
import LoadingImage from "@/components/loading-image";
import AddToCartButton from "@/components/cart/add-button";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, Heart } from "lucide-react";
import AddToWishlistButton from "../add-button-whishlist";

export default function WishlistCarousel() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchWishlistProducts() {
      setLoading(true);
      const results = await Promise.all(wishlist.map((id) => getProductById(id)));
      setProducts(results.filter(Boolean) as Product[]);
      setLoading(false);
    }

    if (wishlist.length > 0) {
      fetchWishlistProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [wishlist]);

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  }

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="min-w-65 h-85 rounded-xl bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <span className="text-5xl">
            <Heart/>
        </span>
        <p className="text-lg font-medium">Your wishlist is empty</p>
        <Link href="/products" className="text-sm text-emerald-600 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Scroll Left */}
      <button
        onClick={scrollLeft}
        className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <ChevronLeftIcon className="size-5" />
      </button>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-60 max-w-60 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-zinc-800 flex items-center justify-center">
                <LoadingImage
                  src={product.images[0]}
                  width={240}
                  height={240}
                  alt={product.title}
                  className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="flex flex-col p-3 gap-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {product.title}
                </h3>
                <span className="text-[10px] font-medium text-gray-400 uppercase">
                  {product.brand?.name}
                </span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  EGP {product.price}
                </span>
              </div>
            </Link>
            <div className="px-3 pb-3 flex items-center gap-2">
              <div className="flex-1">
                <AddToCartButton
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.images[0]}
                />
              </div>
              <AddToWishlistButton id={Number(product.id)} iconOnly />
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Right */}
      <button
        onClick={scrollRight}
        className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <ChevronRightIcon className="size-5" />
      </button>
    </div>
  );
}