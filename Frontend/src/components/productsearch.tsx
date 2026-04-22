"use client"


import { useState } from "react";
import ProductCard from './productCard';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Product, Products } from "@/lib/interfaces/products.interface";
import Link from "next/link";

export default function ProductSearch({
    products = [],
}: {
    products: Products;
}) {

    const [search, setSearch] = useState("");

    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
    );
    const groupedProducts = filteredProducts.reduce((acc: Record<string, any>, prod) => {

        const category = prod.category;

        if (!acc[category.id]) {
            acc[category.id] = {
                id: category.id,
                name: category.name,
                products: []
            };
        }

        acc[category.id].products.push(prod);

        return acc;

    }, {} as Record<string, { id: number; name: string; products: Product[] }>);

    return (
        <>

            <div className="relative mb-3 mx-2">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <svg
                    className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
                    />
                </svg>
            </div>

            {Object.entries(groupedProducts).map(([categoryId, categoryData]) => (

                <div key={categoryData.id} className="mb-10">
                    <Link href={`/categories/${categoryData.id}`}>
                        <h2 className="text-2xl font-bold mb-3 px-3">
                            {categoryData.name}
                        </h2>
                    </Link>

                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full relative"
                    >
                        <CarouselContent className="-ml-2">
                            {categoryData.products.map((product: Product, index: number) => (
                                <CarouselItem key={`${categoryData.id}-${product.id}-${index}`} className="pl-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 basis-full">
                                    <div className="p-6 md:p-1">
                                        <ProductCard
                                            product={product}
                                        />
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

            ))}

        </>
    );
}

