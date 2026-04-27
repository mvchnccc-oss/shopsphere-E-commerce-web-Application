"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useWishlist } from "./context";
import { Heart, HeartIcon, HeartOff } from "lucide-react";
import toast from "react-hot-toast";

interface AddToWishlistButtonProps {
  id: number;
  iconOnly?: boolean;
}

export default function AddToWishlistButton({ id, iconOnly }: AddToWishlistButtonProps) {
  const { wishlist, addToWishlist, removeFromWishlist, isLoading } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const { status, data } = useSession();

  const isWishlisted = wishlist.includes(id);

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (
      status === "unauthenticated" ||
      (status === "authenticated" && (data as any)?.error === "AccessTokenError")
    ) {
      router.push(`/auth/login?url=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isWishlisted) {
      const removed = await removeFromWishlist(id);
      if (removed) {
        toast("Removed from wishlist", {
          icon: <HeartOff className="size-5 text-gray-500" />,
        });
      } else {
        toast.error("Failed to update wishlist. Try again.", {
          icon: <HeartOff className="size-5 text-red-500" />,
        });
      }
    } else {
      const added = await addToWishlist(id);
      if (added) {
        toast.success("Added to wishlist!", {
          icon: <Heart className="size-5 text-rose-500" fill="#f43f5e" />,
        });
      } else {
        toast.error("Failed to update wishlist. Try again.", {
          icon: <HeartOff className="size-5 text-red-500" />,
        });
      }
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
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
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