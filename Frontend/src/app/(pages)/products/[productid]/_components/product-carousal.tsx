"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function ProductCarousel({ images, title }: { images: string[], title: string }) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((img, i) => (
          <CarouselItem key={i}>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <Image src={img} alt={`${title} - ${i + 1}`} fill className="object-cover" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}