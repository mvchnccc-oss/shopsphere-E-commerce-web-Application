import Pagination from "@/components/pagination";
import { getPaginatedCategories } from "@/lib/actions/category.action";
import { Suspense } from "react";
import ProductContainer from "./_components/product-container";
import { useAuthRedirect } from "@/lib/useRoleRedirect";

const CATEGORIES_PER_PAGE = 3;

interface AllProductsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AllProductsPage({ searchParams }: AllProductsPageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(0, parseInt(page ?? "0") || 0);
    const { status, isSeller } = useAuthRedirect();
    if (status === "loading" || isSeller) return null;

  const { categories, totalPages } = await getPaginatedCategories(
    currentPage,
    CATEGORIES_PER_PAGE
  );

  return (
    <div>
      <ProductContainer categories={categories} />
      <Suspense>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
