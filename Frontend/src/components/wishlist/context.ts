import { createContext, useContext } from "react";

interface IWishlistContext {
  wishlist: number[];
  addToWishlist: (id: number) => Promise<boolean>;
  removeFromWishlist: (id: number) => Promise<boolean>;
  isLoading: boolean;
}

export const WishlistContext = createContext<IWishlistContext | null>(null);

export const useWishlist = () => useContext(WishlistContext)!;
