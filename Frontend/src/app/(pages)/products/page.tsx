import ProductSearch from "@/components/productsearch";
import { getAllProducts } from "@/lib/actions/products.actions";

export default async function Allproducts() {
  const products = await getAllProducts();

  return (
    <div className="py-7">
      <ProductSearch products={products} />
    </div>
  );
}
