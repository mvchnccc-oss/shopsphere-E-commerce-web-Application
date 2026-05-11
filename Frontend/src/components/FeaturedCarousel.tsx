"use client";

import ProductCard from "@/app/(pages)/products/_components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

export function FeaturedCarousel({ featured }: Readonly<{ featured: any[] }>) {
  const plugin = React.useRef(Autoplay({ delay: 1500, stopOnInteraction: true }));

  return (
    <div className="relative px-10">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          duration: 50,
        }}
        plugins={[plugin.current]}
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {featured.map((product) => (
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
