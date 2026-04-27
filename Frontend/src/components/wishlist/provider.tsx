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

  async function addToWishlist(id: number): Promise<boolean> {
    const success = await addToWishlistAction(id);
    if (!success) return false;

    setWishlist((pervState) => [...pervState, id]);
    return true;
  }

  async function removeFromWishlist(id: number): Promise<boolean> {
    const success = await removeFromWishlistAction(id);
    if (!success) return false;

    setWishlist((pervState) => pervState.filter((item) => item != id));
    return true;
  }

  return (
    <WishlistContext value={{ wishlist, addToWishlist, removeFromWishlist, isLoading }}>
      {children}
    </WishlistContext>
  );
}
