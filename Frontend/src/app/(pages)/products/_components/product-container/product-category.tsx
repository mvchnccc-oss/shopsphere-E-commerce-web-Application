import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/lib/interfaces/products.interface";
import Link from "next/link";
import ProductCard from "../product-card";

interface ProductCategoryProps {
  category: { id: number; name: string; products: Product[] };
}

export default function ProductCategory({ category }: ProductCategoryProps) {
  return (
    <div key={category.id} className="mb-10">
      <Link href={`/categories/${category.id}`}>
        <h2 className="text-2xl font-bold mb-3 px-3">{category.name}</h2>
      </Link>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-2">
          {category.products.map((product: Product, index: number) => (
            <CarouselItem
              key={`${category.id}-${product.id}-${index}`}
              className="pl-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 basis-full"
            >
              <div className="p-6 md:p-1">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Mobile buttons - full width at bottom */}
        <div className="flex 2xl:hidden gap-2 px-4 mt-4 w-full">
          <CarouselPrevious className="w-1/2 relative left-0 translate-y-0 translate-x-0" />
          <CarouselNext className="w-1/2 relative right-0 translate-y-0 translate-x-0" />
        </div>

        {/* Desktop buttons - on sides */}
        <CarouselPrevious className="hidden 2xl:flex absolute left-2 top-1/2 -translate-y-1/2 -translate-x-16" />
        <CarouselNext className="hidden 2xl:flex absolute right-2 top-1/2 -translate-y-1/2 translate-x-16" />
      </Carousel>
    </div>
  );
}
