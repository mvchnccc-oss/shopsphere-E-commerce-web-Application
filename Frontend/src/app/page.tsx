import { getAllProducts } from '@/lib/actions/products.actions';
import { Products } from '@/lib/interfaces/products.interface';
import Link from 'next/link';
import { ArrowRightIcon, ShoppingBagIcon, SparklesIcon, TruckIcon, ShieldCheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeaturedCarousel } from '@/components/FeaturedCarousel'; // استدعاء المكون الجديد

export default async function HomePage() {
  const allProducts: Products = await getAllProducts();
  const featured = allProducts.slice(0, 18);

  return (
    <main className="min-h-screen bg-background xl:pt-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-emerald-600 dark:bg-emerald-700">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/40 dark:bg-emerald-600/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-800/40 blur-3xl" />

        <div className="relative w-full px-4 py-24 flex flex-col items-center text-center gap-6">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">
            <SparklesIcon className="size-3.5" />
            New arrivals every week
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Everything you want,<br />
            <span className="text-emerald-200">right away.</span>
          </h1>

          <p className="text-emerald-100 text-base sm:text-lg max-w-xl">
            Discover thousands of products across all categories — delivered fast, priced right.
          </p>

          <div className="flex flex-wrap gap-1 justify-center">
            <Button asChild size="lg" className="bg-white text-emerald-500 hover:bg-emerald-700 hover:text-white hover:border-white font-bold shadow-lg">
              <Link href="/products">
                Shop Now <ArrowRightIcon className="size-4 ml-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><TruckIcon className="size-4" /> Free shipping over 1000 EGP</span>
            <span className="flex items-center gap-1.5"><ShieldCheckIcon className="size-4" /> Secure checkout</span>
            <span className="flex items-center gap-1.5"><ShoppingBagIcon className="size-4" /> Easy returns</span>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Featured Products</h2>
            <p className="text-muted-foreground text-sm mt-1">Hand-picked just for you</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:underline">
            View all <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {/* استخدام الـ Client Component هنا */}
        <FeaturedCarousel featured={featured} />
      </section>
    </main>
  );
}