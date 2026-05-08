"use client";
import {
  addToWishlistAction,
  getWishlistAction,
  removeFromWishlistAction,
} from "@/lib/actions/wishlist.actions";
import { ReactNode, useEffect, useState } from "react";
import { WishlistContext } from "./context";

export default function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWishlistAction().then((result) => {
      if (!result.success) {
        setError(result.message ?? "Failed to load wishlist");
        setLoading(false);
        return;
      }

      setWishlist(result.products);
      setLoading(false);
    });
  }, []);

  async function addToWishlist(id: number) {
    const success = await addToWishlistAction(id);
    if (!success) return;

    setWishlist((pervState) => [...pervState, id]);
  }

  async function removeFromWishlist(id: number) {
    const success = await removeFromWishlistAction(id);
    if (!success) return;

    setWishlist((pervState) => pervState.filter((item) => item != id));
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isLoading, error }}>
      {children}
    </WishlistContext.Provider>
  );
}
