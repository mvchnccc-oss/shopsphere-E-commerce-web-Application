import AddToCartButton from "@/components/cart/add-button";
import LoadingImage from "@/components/loading-image";
import AddToWishlistButton from "@/components/wishlist/add-button-whishlist";
import type { Product } from "@/lib/interfaces/products.interface";
import Link from "next/link";

export default function ProductCard({ product: prod }: { product: Product }) {
  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
        <Link href={`/products/${prod.id}`}>
          <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
            <LoadingImage
              src={prod.images[0]}
              width={300}
              height={300}
              alt={prod.title}
              className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-1 flex-col p-3">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">{prod.title}</h3>
            <span className="text-[10px] font-medium text-gray-400 uppercase">
              {prod.brand?.name}
            </span>

            {/* the cost */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-emerald-600">EGP {prod.price}</span>
              </div>
            </div>
          </div>
        </Link>
        <div className="w-full mt-auto px-3 pb-3 flex items-center gap-2">
          <div className="flex-1">
            <AddToCartButton id={prod.id} title={prod.title} price={prod.price} image={prod.images[0]} />
          </div>
          <div className="rounded-xl border-2 border-red-100 bg-red-50">
            <AddToWishlistButton id={Number(prod.id)} iconOnly />
          </div>
        </div>
      </div>
    </>
  );
}
