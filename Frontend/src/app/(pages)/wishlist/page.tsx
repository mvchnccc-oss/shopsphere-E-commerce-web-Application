"use client";

import WishlistCarousel from "../../../components/wishlist/_components/wishlist-carousel";
import { useAuthRedirect } from "@/lib/useRoleRedirect";

export default function WishlistPage() {
  const { status, isSeller } = useAuthRedirect();

  if (status === "loading" || isSeller) return null;
  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wishlist</h1>
        <WishlistCarousel />
      </div>
    </div>
  );
}