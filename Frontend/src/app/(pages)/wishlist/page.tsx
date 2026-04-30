import WishlistCarousel from "../../../components/wishlist/_components/wishlist-carousel";
 
export default function WishlistPage() {
  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wishlist</h1>
        <WishlistCarousel />
      </div>
    </div>
  );
}