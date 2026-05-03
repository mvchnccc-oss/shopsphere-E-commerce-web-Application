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
import { Heart, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WishlistCarousel() {
  const { wishlist, isLoading, error } = useWishlist();
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

  if (isLoading || loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="min-w-55 h-85 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="bg-rose-50 dark:bg-rose-950 rounded-full p-6">
          <Heart className="size-12 text-rose-300 dark:text-rose-700" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Unable to load wishlist</p>
          <p className="text-muted-foreground text-sm mt-1">{error}</p>
        </div>
        <Link href="/products">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
            Browse products <ArrowRightIcon className="size-4" />
          </Button>
        </Link>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="bg-rose-50 dark:bg-rose-950 rounded-full p-6">
          <Heart className="size-12 text-rose-300 dark:text-rose-700" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Your wishlist is empty</p>
          <p className="text-muted-foreground text-sm mt-1">
            Save items you love and find them here later
          </p>
        </div>
        <Link href="/products">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
            Browse products <ArrowRightIcon className="size-4" />
          </Button>
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