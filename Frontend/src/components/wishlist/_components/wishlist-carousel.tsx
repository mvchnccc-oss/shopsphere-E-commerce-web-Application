"use client";
import { getProductById } from "@/lib/actions/products.actions";
import { Product } from "@/lib/interfaces/products.interface";
import { useWishlist } from "@/components/wishlist/context";
import { useEffect, useState } from "react";
import ProductCard from "@/app/(pages)/products/_components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistCarousel() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="min-w-55 h-85 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <Heart className="size-12" />
        <p className="text-lg font-medium">Your wishlist is empty</p>
        <Link href="/products" className="text-sm text-emerald-600 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="relative px-10">
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}