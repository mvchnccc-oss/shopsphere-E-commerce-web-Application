"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProductsByCategory } from "@/lib/actions/products.actions";
import { Category } from "@/lib/interfaces/categories.interface";
import { Product } from "@/lib/interfaces/products.interface";
import Link from "next/link";
import { useState, useTransition } from "react";
import ProductCard from "../product-card";

interface ProductCategoryProps {
  category: Category;
  initialProducts: Product[];
  hasMore: boolean;
}

const PRODUCTS_PER_PAGE = 10;

export default function ProductCategory({
  category,
  initialProducts,
  hasMore: initialHasMore,
}: ProductCategoryProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    startTransition(async () => {
      const nextPage = currentPage + 1;
      const result = await getProductsByCategory(category.id, nextPage, PRODUCTS_PER_PAGE);

      setProducts((prev) => [...prev, ...result.products]);
      setCurrentPage(nextPage);
      setHasMore(nextPage < result.totalPages - 1);
    });
  }

  return (
    <div className="mb-10">
      <Link href={`/categories/${category.id}`}>
        <h2 className="text-2xl font-bold mb-3 px-3">{category.name}</h2>
      </Link>

      <Carousel opts={{ align: "start" }} className="w-full relative">
        <CarouselContent className="-ml-2">
          {products.map((product, index) => (
            <CarouselItem
              key={`${category.id}-${product.id}-${index}`}
              className="pl-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 basis-full"
            >
              <div className="p-6 md:p-1">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}

          {/* Load More card — آخر item في الكاروزيل */}
          {hasMore && (
            <CarouselItem className="pl-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 basis-full">
              <div className="p-6 md:p-1 h-full">
                <button
                  onClick={loadMore}
                  disabled={isPending}
                  className="w-full h-full min-h-[260px] rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800 flex flex-col items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <div className="size-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                      <span className="text-sm font-medium">Loading...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-light">+</span>
                      <span className="text-sm font-medium">Load More</span>
                    </>
                  )}
                </button>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>

        {/* Mobile buttons */}
        <div className="flex 2xl:hidden gap-2 px-4 mt-4 w-full">
          <CarouselPrevious className="w-1/2 relative left-0 translate-y-0 translate-x-0" />
          <CarouselNext className="w-1/2 relative right-0 translate-y-0 translate-x-0" />
        </div>

        {/* Desktop buttons */}
        <CarouselPrevious className="hidden 2xl:flex absolute left-2 top-1/2 -translate-y-1/2 -translate-x-16" />
        <CarouselNext className="hidden 2xl:flex absolute right-2 top-1/2 -translate-y-1/2 translate-x-16" />
      </Carousel>
    </div>
  );
}
