import Pagination from "@/components/pagination";
import { getPaginatedCategories } from "@/lib/actions/category.action";
import { searchProducts } from "@/lib/actions/products.actions";
import { Suspense } from "react";
import ProductContainer from "./_components/product-container";
import ProductCard from "./_components/product-card";
import SearchBar from "@/components/search-bar";

const CATEGORIES_PER_PAGE = 3;

interface AllProductsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AllProductsPage({ searchParams }: AllProductsPageProps) {
  const { page, search } = await searchParams;
  const currentPage = Math.max(0, parseInt(page ?? "0") || 0);
  const searchQuery = search?.trim() ?? "";

  if (searchQuery) {
    const { products, totalPages } = await searchProducts(searchQuery, currentPage);

    return (
      <div className="py-7 px-4">
        <SearchBar />
        <p className="text-sm text-muted-foreground mt-6 mb-4">
          {products.length > 0
            ? `${products.length} results for "${searchQuery}"`
            : `No results found for "${searchQuery}"`}
        </p>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
        <Suspense>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      </div>
    );
  }

  const { categories, totalPages } = await getPaginatedCategories(currentPage, CATEGORIES_PER_PAGE);

  return (
    <div>
      <SearchBar />
      <ProductContainer categories={categories} />
      <Suspense>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}