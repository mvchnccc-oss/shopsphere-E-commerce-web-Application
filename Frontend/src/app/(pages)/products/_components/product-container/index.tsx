"use client";
import SearchBar from "@/components/search-bar";
import { Products } from "@/lib/interfaces/products.interface";
import { useState } from "react";
import ProductCategories from "./product-categories";

interface ProductContainerProps {
  products: Products;
}

export default function ProductContainer(props: ProductContainerProps) {
  const [products, setProducts] = useState(props.products);

  function handleSearch(term: string) {
    setProducts(
      props.products.filter((product) => product.title.toLowerCase().includes(term.toLowerCase())),
    );
  }

  return (
    <div className="py-7">
      <SearchBar onSearch={handleSearch} />
      <ProductCategories products={products} />
    </div>
  );
}
