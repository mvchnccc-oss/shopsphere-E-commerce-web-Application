"use client";
import Image from "next/image";
import { useState } from "react";

const NoImage = () => (
  <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <span className="text-xs text-gray-500">No Image</span>
  </div>
);

export default function CategoryImage({ src, alt }: { src: string, alt: string }) {
  const [error, setError] = useState(false);

  if (error || !src) return <NoImage />;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      onError={() => setError(true)}
      className="object-cover group-hover:scale-105 transition-transform duration-300"
    />
  );
}