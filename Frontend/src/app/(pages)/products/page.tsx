import Pagination from "@/components/pagination";
import { getAllProducts } from "@/lib/actions/products.actions";
import { Suspense } from "react";
import ProductContainer from "./_components/product-container";

const PAGE_SIZE = 40;

interface AllProductsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AllProductsPage({ searchParams }: AllProductsPageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(0, parseInt(page ?? "0") || 0);

  const { products, totalPages } = await getAllProducts(currentPage, PAGE_SIZE);

  return (
    <div>
      <ProductContainer products={products} />
      <Suspense>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
