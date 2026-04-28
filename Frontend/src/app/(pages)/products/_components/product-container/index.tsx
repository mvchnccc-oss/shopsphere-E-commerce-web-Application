"use client";
import SearchBar from "@/components/search-bar";
import { Product } from "@/lib/interfaces/products.interface";
import { useState } from "react";
import ProductCategories from "./product-categories";

interface ProductContainerProps {
  products: Product[];
}

export default function ProductContainer({ products: initialProducts }: ProductContainerProps) {
  const [products, setProducts] = useState(initialProducts);

  function handleSearch(term: string) {
    const normalized = term.toLowerCase();
    setProducts(
      term
        ? initialProducts.filter((p) => p.title.toLowerCase().includes(normalized))
        : initialProducts
    );
  }

  return (
    <div className="py-7">
      <SearchBar onSearch={handleSearch} />
      <ProductCategories products={products} />
    </div>
  );
}
