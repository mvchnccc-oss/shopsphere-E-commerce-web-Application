"use client";
import LoadingImage from "@/components/loading-image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ProductCarousel({
  images,
  title,
}: Readonly<{ images: string[]; title: string }>) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.length === 0 ? (
          <CarouselItem key="image-notavailabile">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <LoadingImage
                src="Not found"
                alt="Not found"
                fill={true}
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ) : (
          images.map((img, i) => (
            <CarouselItem key={`image-${i}`}>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                <LoadingImage
                  src={img}
                  alt={`${title} - ${i + 1}`}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}
