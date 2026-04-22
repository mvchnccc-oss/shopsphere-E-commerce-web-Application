import { getAllProducts } from "@/lib/actions/products.actions";
import ProductContainer from "./_components/product-container";

export default async function Allproducts() {
  const products = await getAllProducts();

  return <ProductContainer products={products} />;
}
