import { createContext, useContext } from "react";

interface IWishlistContext {
  wishlist: number[];
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
}

export const WishlistContext = createContext<IWishlistContext | null>(null);

export const useWishlist = () => useContext(WishlistContext)!;
