"use client";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Spinner } from "./ui/spinner";

interface LoadingImageProps {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
}

export default function LoadingImage(props: LoadingImageProps) {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const width = imageRef.current?.width ?? props.width;
  const height = imageRef.current?.width ?? props.height;

  if (isError || !props.src || props.src.trim() === "")
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
        <ImageIcon className="text-gray-400" />
        <span className="text-xs text-gray-500">No Image</span>
      </div>
    );

  return (
    <div
      className="relative"
      style={{
        width,
        height,
      }}
    >
      <Image
        src={props.src}
        width={props.width}
        height={props.height}
        alt={props.alt}
        onLoadingComplete={() => setLoading(false)}
        onError={() => setError(true)}
        className={props.className}
        ref={imageRef}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Spinner className="text-black w-1/4 h-1/4" />
        </div>
      )}
    </div>
  );
}
