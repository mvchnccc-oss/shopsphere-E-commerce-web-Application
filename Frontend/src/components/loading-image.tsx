"use client";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

interface LoadingImageProps {
  src: string;
  width: number | undefined;
  height: number | undefined;
  alt: string;
  className?: string;
  fill?: boolean;
}

export default function LoadingImage({
  src,
  width,
  height,
  alt,
  className,
  fill,
}: LoadingImageProps) {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const isValidImage =
    src?.trim() && (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://"));

  if (isError || !isValidImage)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
        <ImageIcon className="text-gray-400" />
        <span className="text-xs text-gray-500">No Image</span>
      </div>
    );

  return (
    <div className="relative" style={{ width, height }}>
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        placeholder="empty"
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        fill={fill}
        className={cn(
          className,
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
        )}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="text-black w-1/4 h-1/4" />
        </div>
      )}
    </div>
  );
}
