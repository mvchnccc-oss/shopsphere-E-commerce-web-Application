"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useWishlist } from "./context";
import { HeartIcon } from "lucide-react";

interface AddToWishlistButtonProps {
  id: number;
  iconOnly?: boolean;
}

export default function AddToWishlistButton({ id, iconOnly }: AddToWishlistButtonProps) {
  const { wishlist, addToWishlist, removeFromWishlist, isLoading } = useWishlist();
  const router = useRouter();
  const session = useSession();

  const isWishlisted = wishlist.includes(id);

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (session.status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  }
  if (iconOnly) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleWishlist}
        disabled={isLoading}
        className={`rounded-full transition-all duration-450 hover:bg-transparent! bg-transparent! ${isWishlisted
          ? "text-rose-500 hover:text-rose-600"
          : "text-rose-400 hover:text-rose-500"
          }`}

        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
        {isLoading ? (
          <span className="size-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <HeartIcon
            className={`size-5 transition-all duration-300 ease-in-out ${isWishlisted ? "scale-110" : "scale-100"
              }`}
            fill={isWishlisted ? "currentColor" : "transparent"} 
            strokeWidth={2}
          />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className={`w-full px-4 py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${isWishlisted
        ? "border-rose-300 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
        : "border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500 dark:hover:border-rose-700"
        }`}
      onClick={toggleWishlist}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <HeartIcon
          className={`size-5 transition-all duration-300 ease-in-out ${isWishlisted ? "scale-110" : "scale-100"
            }`}
          fill={isWishlisted ? "currentColor" : "transparent"} 
          strokeWidth={2}
        />
      )}
      {isLoading ? "Loading..." : isWishlisted ? "Wishlisted" : "Add to Wishlist"}
    </Button>
  );
}
