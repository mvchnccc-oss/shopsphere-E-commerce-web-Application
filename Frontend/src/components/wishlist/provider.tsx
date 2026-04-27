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

  useEffect(() => {
    getWishlistAction().then((wishlist) => {
      setWishlist((prevState) => wishlist?.products ?? prevState);
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
    <WishlistContext value={{ wishlist, addToWishlist, removeFromWishlist, isLoading }}>
      {children}
    </WishlistContext>
  );
}
