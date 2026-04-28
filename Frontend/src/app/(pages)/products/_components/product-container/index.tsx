"use client";
import SearchBar from "@/components/search-bar";
import { Product } from "@/lib/interfaces/products.interface";
import { useMemo, useState } from "react";
import ProductCategories from "./product-categories";

interface ProductContainerProps {
  products: Product[];
}

export default function ProductContainer({ products: initialProducts }: ProductContainerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const products = useMemo(() => {
    const normalized = searchTerm.toLowerCase();
    return searchTerm
      ? initialProducts.filter((p) => p.title.toLowerCase().includes(normalized))
      : initialProducts;
  }, [initialProducts, searchTerm]);

  function handleSearch(term: string) {
    setSearchTerm(term);
  }

  return (
    <div className="py-7">
      <SearchBar onSearch={handleSearch} />
      <ProductCategories products={products} />
    </div>
  );
}
