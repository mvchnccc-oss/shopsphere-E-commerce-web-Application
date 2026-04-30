import ProductCard from "@/app/(pages)/products/_components/product-card";
import Pagination from "@/components/pagination";
import { getCategoryById } from "@/lib/actions/category.action";
import { getProductsByCategory } from "@/lib/actions/products.actions";
import { useAuthRedirect } from "@/lib/useRoleRedirect";
import { Suspense } from "react";

const PAGE_SIZE = 20;

interface CategoryPageProps {
  params: Promise<{ categoryid: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categoryid } = await params;
  const { page } = await searchParams;
    const { status, isSeller } = useAuthRedirect();
    if (status === "loading" || isSeller) return null;

  const categoryId = parseInt(categoryid);
  const currentPage = Math.max(0, parseInt(page ?? "0") || 0);

  const [category, { products, totalPages }] = await Promise.all([
    getCategoryById(categoryId),
    getProductsByCategory(categoryId, currentPage, PAGE_SIZE),
  ]);

  return (
    <div className="py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">{category?.name} Products</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No products found in this category.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Suspense>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </Suspense>
        </>
      )}
    </div>
  );
}
