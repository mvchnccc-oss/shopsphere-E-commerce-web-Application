"use client"; // ضروري جداً هنا

import React from 'react';
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCard from '@/app/(pages)/products/_components/product-card';

export function FeaturedCarousel({ featured }: { featured: any[] }) {
    const plugin = React.useRef(
        Autoplay({ delay: 1500, stopOnInteraction: true })
    );

    return (
        <div className="relative px-10">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
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