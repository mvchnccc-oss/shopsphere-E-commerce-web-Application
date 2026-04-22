import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "./_components/product-card/skeleton";

export default function ProductsLoading() {
  return (
    <div className="py-7">
      <Skeleton className="w-full h-12.5 dark:bg-neutral-700 bg-neutral-300 mb-2" />
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div className="mb-10" key={index}>
            <Skeleton className="mb-3 ml-1 h-8 w-60 dark:bg-neutral-700 bg-neutral-300" />

            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full relative"
            >
              <CarouselContent className="-ml-2">
                {Array(10)
                  .fill(0)
                  .map((_, index: number) => (
                    <CarouselItem
                      key={index}
                      className="pl-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 basis-full"
                    >
                      <div className="p-6 md:p-1">
                        <ProductCardSkeleton />
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
    </div>
  );
}
