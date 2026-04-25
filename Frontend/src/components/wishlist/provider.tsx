"use client";
import { ReactNode, useState } from "react";
import { WishlistContext } from "./context";

export default function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  function addToWishlist(id: number) {
    setWishlist((pervState) => [...pervState, id]);
  }
  function removeFromWishlist(id: number) {
    setWishlist((pervState) => pervState.filter((item) => item != id));
  }

  return (
    <WishlistContext value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext>
  );
}
